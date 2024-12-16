import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from "@/components/ui/toaster"
import { SupabaseProvider } from '@/components/providers/supabase-provider'
import { redirect } from 'next/navigation'

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
  // Force redirect to login on initial load
  if (typeof window !== 'undefined' && window.location.pathname === '/') {
    redirect('/login')
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <SupabaseProvider>
          <main className="container mx-auto py-6">{children}</main>
          <Toaster />
        </SupabaseProvider>
      </body>
    </html>
  )
}