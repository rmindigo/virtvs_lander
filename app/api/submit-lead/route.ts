import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const { email, size } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Email to ryan.mindigo@gmail.com with the submitted email
    await resend.emails.send({
      from: 'Virtvs <onboarding@resend.dev>', // Update this with your verified domain
      to: 'ryan.mindigo@gmail.com',
      subject: 'New Early Access Signup - Virtvs',
      html: `
        <h2>New Early Access Signup</h2>
        <p><strong>Email:</strong> ${email}</p>
        ${size ? `<p><strong>Size Preference:</strong> ${size}</p>` : ''}
        <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
      `,
    })

    // Thank you email to the submitted email address
    await resend.emails.send({
      from: 'Virtvs <onboarding@resend.dev>', // Update this with your verified domain
      to: email,
      subject: 'Thank You - You\'re on the Virtvs Early Access List',
      html: `
        <h2>Thank You</h2>
        <p>You're on the list.</p>
        <p>When the first Virtvs drop opens, you'll receive early access before the public release.</p>
        <p>No spam. No hype. Just the drop.</p>
        <br />
        <p>— Virtvs</p>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error sending emails:', error)
    return NextResponse.json(
      { error: 'Failed to send emails' },
      { status: 500 }
    )
  }
}

