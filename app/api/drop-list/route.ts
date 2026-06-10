import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VALID_PREFS = new Set(['hoodie', 'hat', 'both']);
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 8;
const POSITION_OFFSET = 99;

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Virtvs <noreply@virtvs.co>';
const NOTIFY_EMAIL = process.env.LEAD_NOTIFY_EMAIL || 'ryan.mindigo@gmail.com';
const SUPABASE_TABLE = process.env.SUPABASE_SIGNUPS_TABLE || 'drop_i_signups';

// Lightweight per-instance throttle. Supabase is the durable source of truth;
// this only slows obvious repeated hits against a single serverless instance.
type Entry = { count: number; resetAt: number };
type SignupInput = { email: string; phone?: string; preference: string };
type SignupRecord = {
  id: number;
  email: string;
  phone?: string | null;
  preference: string;
  created_at?: string;
  updated_at?: string;
};

type StoredSignup = SignupInput & { id: number };

const rateLimit = new Map<string, Entry>();

function getResend() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error('RESEND_API_KEY environment variable is not set');
  }
  return new Resend(apiKey);
}

function hasSupabaseConfig() {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables must be set');
  }

  return {
    baseUrl: `${url.replace(/\/$/, '')}/rest/v1/${encodeURIComponent(SUPABASE_TABLE)}`,
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      'Content-Type': 'application/json',
    },
  };
}

function getIp(req: NextRequest) {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'local';
}

function limited(key: string) {
  const now = Date.now();
  const current = rateLimit.get(key);
  if (!current || current.resetAt < now) {
    rateLimit.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  current.count += 1;
  return current.count > MAX_PER_WINDOW;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function preferenceLabel(preference: string) {
  if (preference === 'hoodie') return 'Hoodie';
  if (preference === 'hat') return 'Hat';
  return 'Hoodie + Hat';
}

function positionFor(signup: Pick<SignupRecord, 'id'>) {
  return signup.id + POSITION_OFFSET;
}

async function supabaseFetch(path = '', init: RequestInit = {}) {
  const { baseUrl, headers } = getSupabaseConfig();
  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      ...headers,
      ...(init.headers || {}),
    },
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const message = data?.message || data?.hint || response.statusText || 'Supabase request failed';
    throw new Error(message);
  }

  return data;
}

async function findSignupByEmail(email: string): Promise<SignupRecord | null> {
  const query = `?email=eq.${encodeURIComponent(email)}&select=id,email,phone,preference,created_at,updated_at&limit=1`;
  const rows = await supabaseFetch(query, { method: 'GET' }) as SignupRecord[];
  return rows[0] || null;
}

async function updateSignup(existing: SignupRecord, signup: SignupInput): Promise<SignupRecord> {
  const payload = {
    phone: signup.phone || existing.phone || null,
    preference: signup.preference,
    updated_at: new Date().toISOString(),
  };

  const rows = await supabaseFetch(`?id=eq.${existing.id}&select=id,email,phone,preference,created_at,updated_at`, {
    method: 'PATCH',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify(payload),
  }) as SignupRecord[];

  return rows[0] || { ...existing, ...payload };
}

async function createSignup(signup: SignupInput, req: NextRequest): Promise<{ record: SignupRecord; isExisting: boolean }> {
  const existing = await findSignupByEmail(signup.email);
  if (existing) {
    return { record: await updateSignup(existing, signup), isExisting: true };
  }

  const payload = {
    email: signup.email,
    phone: signup.phone || null,
    preference: signup.preference,
    source: 'virtvs-drop-i-landing',
    user_agent: req.headers.get('user-agent') || null,
  };

  try {
    const rows = await supabaseFetch('?select=id,email,phone,preference,created_at,updated_at', {
      method: 'POST',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify(payload),
    }) as SignupRecord[];

    return { record: rows[0], isExisting: false };
  } catch (error) {
    // Handles a race where the same email is inserted by another request after
    // our initial lookup but before this insert reaches Supabase.
    const racedExisting = await findSignupByEmail(signup.email);
    if (racedExisting) {
      return { record: await updateSignup(racedExisting, signup), isExisting: true };
    }

    throw error;
  }
}

function buildConfirmationEmail(position: number | null, preference: string) {
  const positionLine = position ? `Your Drop I early access position is №${position}. You are on the list.` : 'Your Drop I early access request has been received. You are on the list.';
  const positionHtml = position ? `
                  <tr>
                    <td style="padding:26px 24px;border-bottom:1px solid #3b3325;">
                      <p style="margin:0 0 8px 0;color:#8f846f;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;">
                        Early access position
                      </p>
                      <p style="margin:0;color:#f7f0df;font-family:Georgia,'Times New Roman',Times,serif;font-size:42px;line-height:1;font-weight:400;">
                        №${position}
                      </p>
                    </td>
                  </tr>` : '';

  return `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="color-scheme" content="dark" />
    <meta name="supported-color-schemes" content="dark" />
    <title>Virtvs Drop I Early Access</title>
  </head>
  <body style="margin:0;padding:0;background:#080806;color:#f5f0e6;font-family:Georgia,'Times New Roman',Times,serif;-webkit-font-smoothing:antialiased;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
      ${positionLine}
    </div>

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#080806;margin:0;padding:0;">
      <tr>
        <td align="center" style="padding:34px 16px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:640px;background:#11100d;border:1px solid #3b3325;border-radius:0;overflow:hidden;box-shadow:0 28px 70px rgba(0,0,0,.45);">
            <tr>
              <td style="padding:0;background:#16130e;">
                <div style="height:5px;background:linear-gradient(90deg,#7d5a22,#d8b45d,#7d5a22);"></div>
              </td>
            </tr>

            <tr>
              <td style="padding:42px 38px 30px 38px;background:radial-gradient(circle at 50% 0%,rgba(216,180,93,.16),transparent 42%),#11100d;">
                <p style="margin:0 0 22px 0;color:#d8b45d;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:3.2px;text-transform:uppercase;font-weight:700;">
                  VIRTVS · DROP I
                </p>

                <h1 style="margin:0;color:#f7f0df;font-size:44px;line-height:1.02;font-weight:400;letter-spacing:-.7px;">
                  You’re on<br />the list.
                </h1>

                <p style="margin:22px 0 0 0;color:#bdb3a0;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.7;">
                  Your early access request has been received. When Drop I opens, you’ll receive access before the public release.
                </p>
              </td>
            </tr>

            <tr>
              <td style="padding:0 38px 34px 38px;background:#11100d;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border:1px solid #3b3325;background:#17150f;">
                  ${positionHtml}
                  <tr>
                    <td style="padding:22px 24px;">
                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                        <tr>
                          <td style="padding:0 0 6px 0;color:#8f846f;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;">
                            Preference
                          </td>
                        </tr>
                        <tr>
                          <td style="color:#f7f0df;font-family:Arial,Helvetica,sans-serif;font-size:17px;line-height:1.5;font-weight:700;">
                            ${preference}
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding:0 38px 40px 38px;background:#11100d;">
                <p style="margin:0 0 18px 0;color:#d8b45d;font-family:Arial,Helvetica,sans-serif;font-size:12px;letter-spacing:2.4px;text-transform:uppercase;font-weight:700;">
                  Drop I Preview
                </p>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                  <tr>
                    <td style="padding:18px 0;border-top:1px solid #2f291e;color:#f7f0df;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.55;">
                      <strong>Hercules FORTITVDO Hoodie</strong><br />
                      <span style="color:#988d79;">Heavyweight fleece · limited first release</span>
                    </td>
                    <td align="right" style="padding:18px 0;border-top:1px solid #2f291e;color:#d8b45d;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:700;white-space:nowrap;">
                      $189
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:18px 0;border-top:1px solid #2f291e;border-bottom:1px solid #2f291e;color:#f7f0df;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.55;">
                      <strong>Virtvs Black Corduroy Hat</strong><br />
                      <span style="color:#988d79;">Structured everyday piece · black corduroy</span>
                    </td>
                    <td align="right" style="padding:18px 0;border-top:1px solid #2f291e;border-bottom:1px solid #2f291e;color:#d8b45d;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:700;white-space:nowrap;">
                      $79
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding:0 38px 42px 38px;background:#11100d;">
                <div style="padding:22px 24px;background:#0b0a08;border-left:3px solid #d8b45d;">
                  <p style="margin:0;color:#cfc4ae;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.7;">
                    No spam. No hype. Just the drop — delivered when early access opens.
                  </p>
                </div>
              </td>
            </tr>

            <tr>
              <td style="padding:24px 38px 32px 38px;background:#0b0a08;border-top:1px solid #2f291e;">
                <p style="margin:0 0 8px 0;color:#f7f0df;font-family:Georgia,'Times New Roman',Times,serif;font-size:22px;letter-spacing:.5px;">
                  VIRTVS
                </p>
                <p style="margin:0;color:#817665;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.6;">
                  You received this because you joined the Virtvs Drop I early access list. To be removed, reply to this email or contact ryan.mindigo@gmail.com.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function buildConfirmationText(position: number | null, preference: string) {
  const positionCopy = position ? `Early access position: №${position}` : 'Early access request received.';
  return `You're on the Virtvs Drop I early access list.\n\n${positionCopy}\nPreference: ${preference}\n\nWhen Drop I opens, you'll receive access before the public release.\n\nNo spam. No hype. Just the drop.\n\nTo be removed from the list, reply to this email or contact ryan.mindigo@gmail.com.\n\n— Virtvs`;
}

async function sendSignupEmails(signup: StoredSignup, position: number | null, isExisting: boolean) {
  const resend = getResend();
  const email = escapeHtml(signup.email);
  const phone = signup.phone ? escapeHtml(signup.phone) : 'Not provided';
  const preferenceText = preferenceLabel(signup.preference);
  const preference = escapeHtml(preferenceText);
  const submitted = escapeHtml(new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }));
  const positionCopy = position ? String(position) : 'Pending — Supabase not configured';

  if (!isExisting) {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: NOTIFY_EMAIL,
      subject: `New Drop I Signup - ${signup.email} - Virtvs`,
      html: `
        <h2>New Drop I Signup</h2>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Preference:</strong> ${preference}</p>
        <p><strong>Position:</strong> ${escapeHtml(positionCopy)}</p>
        <p><strong>Submitted:</strong> ${submitted}</p>
      `,
    });
  }

  await resend.emails.send({
    from: FROM_EMAIL,
    to: signup.email,
    subject: position ? `Virtvs Drop I early access confirmed — №${position}` : 'Virtvs Drop I early access confirmed',
    html: buildConfirmationEmail(position, preference),
    text: buildConfirmationText(position, preferenceText),
  });
}

export async function POST(req: NextRequest) {
  const ip = getIp(req);
  if (limited(ip)) {
    return NextResponse.json({ error: 'Too many signup attempts. Try again shortly.' }, { status: 429 });
  }

  const body = await req.json().catch(() => null) as null | {
    email?: string;
    phone?: string;
    preference?: string;
  };

  const email = body?.email?.trim().toLowerCase() || '';
  const phone = body?.phone?.trim() || '';
  const preference = body?.preference || 'both';

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Enter a valid email.' }, { status: 400 });
  }

  if (phone && phone.replace(/\D/g, '').length < 7) {
    return NextResponse.json({ error: 'Enter a valid number, or leave empty.' }, { status: 400 });
  }

  if (!VALID_PREFS.has(preference)) {
    return NextResponse.json({ error: 'Invalid preference.' }, { status: 400 });
  }

  let stored: { record: SignupRecord; isExisting: boolean };
  let position: number | null = null;

  if (hasSupabaseConfig()) {
    try {
      stored = await createSignup({ email, phone, preference }, req);
      position = positionFor(stored.record);
    } catch (error) {
      console.error('Error storing Drop I signup in Supabase:', error);
      return NextResponse.json({ error: 'Unable to join right now.' }, { status: 500 });
    }
  } else {
    console.warn('Supabase env vars are not configured. Capturing signup by Resend email only.');
    stored = {
      record: {
        id: 0,
        email,
        phone: phone || null,
        preference,
      },
      isExisting: false,
    };
  }

  try {
    await sendSignupEmails(
      {
        id: stored.record.id,
        email: stored.record.email,
        phone: stored.record.phone || undefined,
        preference: stored.record.preference,
      },
      position,
      stored.isExisting,
    );
  } catch (error) {
    console.error('Error sending Drop I signup emails:', error);
    return NextResponse.json({ error: 'You are on the list, but we could not send the confirmation email right now.' }, { status: 500 });
  }

  return NextResponse.json({ success: true, position, existing: stored.isExisting });
}
