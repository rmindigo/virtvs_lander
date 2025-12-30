# Virtvs Landing Page

A minimal, premium landing page for the first Virtvs drop, built with Next.js, TypeScript, and Tailwind CSS.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Add your product image:
   - Place `hoodie.png` in the `/public` directory
   - Optionally add `hoodie-front.png`, `hoodie-back.png`, and `hoodie-sleeve.png` for the gallery

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features

- **Email Signup Form**: Sends email notifications and thank you emails via Resend
- **Size Preference**: Optional size selection after email submission
- **Responsive Design**: Mobile-first, works on all devices
- **Analytics**: Console logging for page views, signups, and size selections (toggle via `ENABLE_ANALYTICS_LOGS`)

## Email Setup

The form sends emails using Resend. To set up:

1. **Get a Resend API Key**:
   - Sign up at [https://resend.com](https://resend.com)
   - Go to API Keys and create a new key

2. **Create `.env.local` file** in the root directory:
   ```
   RESEND_API_KEY=re_your_api_key_here
   ```

3. **Update the sender email** in `app/api/submit-lead/route.ts`:
   - Replace `onboarding@resend.dev` with your verified domain email
   - You can verify a domain in your Resend dashboard

4. **Install dependencies**:
   ```bash
   npm install
   ```

When a form is submitted:
- An email is sent to `ryan.mindigo@gmail.com` with the submitted email address
- A thank you email is sent to the submitted email address

## Build for Production

```bash
npm run build
npm start
```

