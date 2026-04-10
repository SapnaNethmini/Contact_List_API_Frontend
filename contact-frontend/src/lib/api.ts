const BASE_URL = process.env.NEXT_PUBLIC_API_URL

export async function callApi(
  path: string,
  method: string = 'GET',
  body?: object,     // request data
  accessToken: string = '',
  refreshToken: string = '',
  onTokenRefresh?: (newAccess: string, newRefresh: string) => void,
  onLogout?: () => void,
) {
  // Build request options(Autherization)
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {}),
    },
  }

  // convert body object to JSON string if it exists
  if (body) {
    options.body = JSON.stringify(body)
  }

  // Send the request
  const response = await fetch(`${BASE_URL}${path}`, options)

  //  401: try refreshing the token 
  if (response.status === 401) {
    if (!refreshToken) {   //(Comes from AuthContext)
      onLogout?.()
      return
    }

    //Send refresh token to backend
    const refreshResponse = await fetch(`${BASE_URL}/auth/refresh`, { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    })

    if (!refreshResponse.ok) {
      onLogout?.()
      return
    }

    // Got new tokens — tell AuthContext to update its state
    const newTokens = await refreshResponse.json()
    onTokenRefresh?.(newTokens.accessToken, newTokens.refreshToken)

    // Retry original request with new access token
    const retryOptions: RequestInit = {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${newTokens.accessToken}`,
      },
    }
    const retryResponse = await fetch(`${BASE_URL}${path}`, retryOptions)
    return retryResponse.json()
  }


  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || 'Something went wrong')
  }

  return response.json()
}
