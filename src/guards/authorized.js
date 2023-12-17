import AuthService from '@/composables/auth'

/**
 * Route guard for protected endpoints.
 *
 * @param next
 * @return next
 */
export default async function authorized (next) {
  let unauthenticated = false
  let unverified = false

  // Proceed to login page if the user is unauthenticated
  if (!AuthService.isAuthenticated()) {
    AuthService.flush()
    return next({ name: 'Login' })
  }

  // Attempt to refresh token if token is expired
  if (AuthService.isAccessTokenExpired()) {
    await AuthService.refreshToken()
      .then(({ data }) => AuthService.setAuth(data))
      .catch(() => { unauthenticated = true })

    if (unauthenticated) {
      AuthService.flush()
      return next({ name: 'Login' })
    }
  }

  // If user is authenticated, verify the access token
  await AuthService.verifyAccessToken()
    .then(async ({ data }) => {
      AuthService.setUser(data)

      if (!AuthService.getUser().is_email_verified) {
        unverified = true
      }
    })
    .catch(() => { unauthenticated = true })

  if (unverified) return next({ name: 'VerifyEmail' })

  if (unauthenticated) {
    AuthService.flush()
    return next({ name: 'Login' })
  }

  return next()
}
