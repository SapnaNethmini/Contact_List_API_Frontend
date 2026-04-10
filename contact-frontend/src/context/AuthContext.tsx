// provides to the whole app:
//   accessToken  — the current JWT (or '' if logged out)
//   refreshToken — the refresh JWT (or '' if logged out)
//   login()      — saves both tokens into state (called after /auth/login succeeds)
//   logout()     — clears both tokens from state
//   isLoggedIn   — true if an accessToken exists

'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

// Shape of the context 
interface AuthContextType {
  accessToken:  string
  refreshToken: string
  isLoggedIn:   boolean
  login:  (accessToken: string, refreshToken: string) => void
  logout: () => void
  updateTokens: (accessToken: string, refreshToken: string) => void
}

//  Create the context object
const AuthContext = createContext<AuthContextType | undefined>(undefined)

//  Provider — wrap the whole app in this
export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken,  setAccessToken]  = useState<string>('')
  const [refreshToken, setRefreshToken] = useState<string>('')

  // Called after a successful login or register
  function login(newAccess: string, newRefresh: string) {
    setAccessToken(newAccess)
    setRefreshToken(newRefresh)
  }

  // Called after a successful token refresh 
  function updateTokens(newAccess: string, newRefresh: string) {
    setAccessToken(newAccess)
    setRefreshToken(newRefresh)
  }

  // Called on logout or when refresh fails
  function logout() {
    setAccessToken('')
    setRefreshToken('')
  }

  return (
    <AuthContext.Provider value={{
      accessToken,
      refreshToken,
      isLoggedIn: accessToken !== '',
      login,
      logout,
      updateTokens,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook 
export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
