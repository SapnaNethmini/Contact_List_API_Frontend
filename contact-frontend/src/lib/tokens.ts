// // // src/lib/tokens.ts
// // // Simple helpers to save and read JWT tokens.
// // // We store them in localStorage — the browser's built-in key-value storage.
// // // localStorage is simple: set a key, get a key, remove a key.
// // // No cookies, no complex libraries needed.

// // // Save both tokens after login
// // export function saveTokens(accessToken: string, refreshToken: string) {
// //   localStorage.setItem('access_token', accessToken)
// //   localStorage.setItem('refresh_token', refreshToken)
// // }

// // // Read the access token — we send this with every API request
// // export function getAccessToken(): string {
// //   return localStorage.getItem('access_token') || ''
// // }

// // // Read the refresh token — we send this to /auth/refresh when access token expires
// // export function getRefreshToken(): string {
// //   return localStorage.getItem('refresh_token') || ''
// // }

// // // Delete both tokens — called when logging out
// // export function removeTokens() {
// //   localStorage.removeItem('access_token')
// //   localStorage.removeItem('refresh_token')
// // }

// // // Check if a user is logged in — just checks if a token exists
// // export function isLoggedIn(): boolean {
// //   // typeof window check is needed because Next.js also runs on the server
// //   // and localStorage does not exist on the server
// //   if (typeof window === 'undefined') return false
// //   return localStorage.getItem('access_token') !== null
// // }



// // src/lib/tokens.ts
// // Helper functions for storing, retrieving, and removing JWT tokens in localStorage.

// const ACCESS_KEY = 'accessToken'
// const REFRESH_KEY = 'refreshToken'

// // Save tokens to localStorage
// export function saveTokens(accessToken: string, refreshToken: string) {
//   localStorage.setItem(ACCESS_KEY, accessToken)
//   localStorage.setItem(REFRESH_KEY, refreshToken)
// }

// // Remove tokens from localStorage
// export function removeTokens() {
//   localStorage.removeItem(ACCESS_KEY)
//   localStorage.removeItem(REFRESH_KEY)
// }

// // Get access token
// export function getAccessToken(): string | null {
//   return localStorage.getItem(ACCESS_KEY)
// }

// // Get refresh token
// export function getRefreshToken(): string | null {
//   return localStorage.getItem(REFRESH_KEY)
// }

// // Check if user is logged in (based on access token presence)
// export function isLoggedIn(): boolean {
//   return Boolean(getAccessToken())
// }
