import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy — VIRTVS',
  description: 'How VIRTVS collects and uses Drop I early-access signup information.',
};

const CONTACT_EMAIL = 'ryan.mindigo@gmail.com';
const UPDATED = 'June 7, 2026';

const sections = [
  {
    title: 'Information we collect',
    body: [
      'When you join the Drop I early-access list, we collect the email address you provide, your selected product preference, and your phone number if you choose to add it.',
      'We may also collect basic technical information such as your browser user agent and signup timestamp so we can protect the form from abuse and maintain the waitlist accurately.',
    ],
  },
  {
    title: 'How we use it',
    body: [
      'We use your information to maintain the Drop I early-access list, confirm your signup, send launch timing and product updates, prevent duplicate entries, and contact you about VIRTVS releases.',
      'If you provide a phone number, we may use it for occasional SMS launch updates tied to Drop I. Message and data rates may apply.',
    ],
  },
  {
    title: 'Service providers',
    body: [
      'We use trusted infrastructure providers to operate this site and signup flow, including Vercel for hosting, Supabase for secure waitlist storage, and Resend for transactional email delivery.',
      'These providers process information only as needed to provide their services to VIRTVS.',
    ],
  },
  {
    title: 'Unsubscribe and deletion',
    body: [
      `You can ask to be removed from the list at any time by replying to a VIRTVS email or contacting ${CONTACT_EMAIL}.`,
      'If SMS updates are enabled, you will be able to reply STOP to opt out of text messages.',
    ],
  },
  {
    title: 'Data retention',
    body: [
      'We keep early-access signup information for as long as needed to operate Drop I, fulfill launch communications, maintain brand records, and comply with applicable obligations.',
      'If you ask to be removed, we will delete or suppress your information unless we need to retain limited records for legal, security, or operational reasons.',
    ],
  },
  {
    title: 'Your choices',
    body: [
      'You do not need to provide a phone number to join the list. Email is required so we can confirm your spot and send launch access.',
      'You may request access, correction, or deletion of your information by contacting us.',
    ],
  },
];

export default function PrivacyPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#080806', color: '#f5f0e6' }}>
      <div
        style={{
          width: 'min(980px, calc(100% - 40px))',
          margin: '0 auto',
          padding: '34px 0 88px',
        }}
      >
        <header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 20,
            padding: '0 0 44px',
            borderBottom: '1px solid rgba(232,223,208,.14)',
          }}
        >
          <Link
            href="/"
            style={{
              color: '#f5f0e6',
              textDecoration: 'none',
              letterSpacing: '0.18em',
              fontSize: 14,
              fontFamily: 'var(--font-cinzel), serif',
            }}
          >
            VIRTVS
          </Link>
          <Link
            href="/#signup"
            style={{
              color: '#d8b45d',
              textDecoration: 'none',
              letterSpacing: '0.16em',
              fontSize: 11,
              textTransform: 'uppercase',
              fontFamily: 'Arial, Helvetica, sans-serif',
            }}
          >
            Return to Drop I
          </Link>
        </header>

        <section style={{ padding: '76px 0 52px' }}>
          <p
            style={{
              margin: '0 0 18px',
              color: '#d8b45d',
              fontFamily: 'Arial, Helvetica, sans-serif',
              fontSize: 11,
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              fontWeight: 700,
            }}
          >
            VIRTVS · Privacy
          </p>
          <h1
            style={{
              margin: 0,
              color: '#f7f0df',
              fontFamily: 'var(--font-cinzel), Georgia, serif',
              fontSize: 'clamp(46px, 9vw, 104px)',
              lineHeight: 0.92,
              fontWeight: 400,
              letterSpacing: '-0.045em',
            }}
          >
            Privacy<br />Policy.
          </h1>
          <p
            style={{
              maxWidth: 680,
              margin: '28px 0 0',
              color: '#bdb3a0',
              fontFamily: 'Arial, Helvetica, sans-serif',
              fontSize: 'clamp(16px, 2vw, 19px)',
              lineHeight: 1.75,
            }}
          >
            This policy explains how VIRTVS handles information submitted through the Drop I early-access list.
            Last updated {UPDATED}.
          </p>
        </section>

        <section
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: 18,
          }}
        >
          {sections.map((section) => (
            <article
              key={section.title}
              style={{
                padding: '30px clamp(22px, 4vw, 38px)',
                background: 'linear-gradient(180deg, rgba(255,255,255,.035), rgba(255,255,255,.015))',
                border: '1px solid rgba(232,223,208,.13)',
                boxShadow: '0 24px 80px rgba(0,0,0,.24)',
              }}
            >
              <h2
                style={{
                  margin: '0 0 14px',
                  color: '#f7f0df',
                  fontFamily: 'var(--font-cinzel), Georgia, serif',
                  fontSize: 'clamp(22px, 3vw, 32px)',
                  fontWeight: 400,
                  letterSpacing: '-0.02em',
                }}
              >
                {section.title}
              </h2>
              {section.body.map((paragraph) => (
                <p
                  key={paragraph}
                  style={{
                    margin: '12px 0 0',
                    color: '#bdb3a0',
                    fontFamily: 'Arial, Helvetica, sans-serif',
                    fontSize: 15,
                    lineHeight: 1.75,
                  }}
                >
                  {paragraph}
                </p>
              ))}
            </article>
          ))}
        </section>

        <footer
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: 18,
            flexWrap: 'wrap',
            marginTop: 42,
            paddingTop: 26,
            borderTop: '1px solid rgba(232,223,208,.14)',
            color: '#817665',
            fontFamily: 'Arial, Helvetica, sans-serif',
            fontSize: 12,
            lineHeight: 1.7,
          }}
        >
          <span>© MMXXVI · VIRTVS</span>
          <span>
            Contact:{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: '#d8b45d' }}>
              {CONTACT_EMAIL}
            </a>
          </span>
        </footer>
      </div>
    </main>
  );
}
