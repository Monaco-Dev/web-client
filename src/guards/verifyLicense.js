import AuthService from '@/composables/auth'

/**
 * Route guard for protected endpoints.
 *
 * @param next
 * @return next
 */
export default async function verifyLicense (to, from, next) {
  let unauthenticated = false
  let unverifiedEmail = false
  let verified = false

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
        unverifiedEmail = true
      } else if (AuthService.getUser().is_verified) {
        verified = true
      }
    })
    .catch(() => { unauthenticated = true })

  if (unverifiedEmail) return next({ name: 'VerifyEmail' })

  if (unauthenticated) {
    AuthService.flush()
    return next({ name: 'Login' })
  }

  if (verified) return next({ name: 'Home' })

  return next()
}
