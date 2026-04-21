// src/app/layout.tsx
// Root layout — every page is wrapped by this.

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/context/AuthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Contact List',
  description: 'Manage your contacts',
  icons: {
    icon: '/images/contact_list.jpg', 
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* AuthProvider makes tokens available to the whole app via useAuth() */}
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}

