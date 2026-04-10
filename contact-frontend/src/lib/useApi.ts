// Gets tokens from AuthContext
// Wraps callApi()
// Automatically passes:
// accessToken
// refreshToken
// updateTokens
// logout
// Handles redirect to /login on logout

//Instead of manually passing tokens everywhere, this hook auto-injects tokens into API calls

import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { callApi } from './api'

export function useApi() {
  const { accessToken, refreshToken, updateTokens, logout } = useAuth()
  const router = useRouter()

  // Wrap logout so it also navigates to /login
  function handleLogout() {
    logout()
    router.replace('/login')
  }

  // Return a pre-filled version of callApi
  return function api(
    path: string,
    method: string = 'GET',
    body?: object,              
  )
   {
    return callApi(
      path,
      method,
      body,
      accessToken,
      refreshToken,
      updateTokens,   //this becomes onTokenRefresh
      handleLogout,   
    )
  }
}
