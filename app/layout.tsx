import type { Metadata } from 'next'
import { Cinzel } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-cinzel',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Virtvs — Fortitvdo',
  description: 'Strength earned, not given. The first Virtvs drop.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const isProduction = process.env.NODE_ENV === 'production'

  return (
    <html lang="en" className={cinzel.variable}>
      <head>
        {/* Privacy-friendly analytics by Plausible */}
      </head>
      <body>
        {children}
        {isProduction && (
          <>
            <Script
              async
              src="https://plausible.io/js/pa-Zia6uwlZO52TW2QdViyNr.js"
              strategy="afterInteractive"
            />
            <Script
              id="plausible-init"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)};
                  plausible.init=plausible.init||function(i){plausible.o=i||{}};
                  plausible.init();
                `,
              }}
            />
          </>
        )}
      </body>
    </html>
  )
}

