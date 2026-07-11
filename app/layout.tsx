import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import EditorialShell from '@/components/editorial/EditorialShell'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'DubLaunch - Discover Amazing Projects by UW Students',
  description: 'A ProductHunt for UW students - discover, launch, and vote on the coolest projects from the University of Washington community.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-FP72VC89TG"></script>
        <script dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-FP72VC89TG');
          `,
        }} />
      </head>
      <body
        className={`${inter.variable} editorial font-sans antialiased bg-white text-black selection:bg-uw-purple selection:text-white`}
      >
        <EditorialShell>{children}</EditorialShell>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#FFFFFF',
              color: '#000000',
              border: '1px solid rgba(0,0,0,0.1)',
              borderRadius: 0,
            },
          }}
        />
      </body>
    </html>
  )
}
