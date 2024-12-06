import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from "@/components/ui/toaster"
import { SupabaseProvider } from '@/components/providers/supabase-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'BiteSync',
  description: 'Optimize schedules and manage project tasks seamlessly',
  icons: {
    icon: '/bitesynclogo2.png',
    shortcut: '/bitesynclogo2.png',
    apple: '/bitesynclogo2.png',
  },
  manifest: '/site.webmanifest'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <SupabaseProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <main className="container mx-auto py-6">{children}</main>
          </ThemeProvider>
          <Toaster />
        </SupabaseProvider>
      </body>
    </html>
  )
}