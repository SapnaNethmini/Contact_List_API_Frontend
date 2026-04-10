// // src/app/page.tsx
// // This is the root page at /
// // It just checks if the user is logged in and redirects them.
// // If logged in → go to /contacts
// // If not logged in → go to /login
//  isLoggedIn comes from useAuth() (React state in AuthContext)

'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

export default function HomePage() {
  const router = useRouter()
  const { isLoggedIn } = useAuth()   

  useEffect(() => {
    if (isLoggedIn) {
      router.replace('/contacts')
    } else {
      router.replace('/login')
    }
  }, [isLoggedIn, router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  )
}
