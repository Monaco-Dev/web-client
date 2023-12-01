import AuthService from '@/composables/auth'
import User from '@/api/auth/user'

/**
 * =======================================
 * Route Guards
 * =======================================
 */
export default {
  /**
   * Route guard for protected endpoints.
   *
   * @param next
   * @return next
   */
  async authorized (next) {
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
  },

  /**
   * Route guard for protected endpoints.
   *
   * @param next
   * @return next
   */
  async unauthorized (to, from, next) {
    let unauthenticated = false
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

        if (AuthService.getUser().is_email_verified) {
          verified = true
        }
      })
      .catch(() => { unauthenticated = true })

    if (verified) return next(from.path)

    if (unauthenticated) {
      AuthService.flush()
      return next({ name: 'Login' })
    }

    const path = to.query.path
    const expires = to.query.expires
    const signature = to.query.signature

    if (!path || !expires || !signature) return next()

    await User.verifyEmail(path, { expires, signature })
      .then(() => { verified = true })

    if (verified) return next({ name: 'Home' })

    return next()
  },

  /**
   * Route Guard for registration endpoint (login, register)
   *
   * @param {*} from
   * @param {*} next
   * @return next
   */
  async registration (from, next) {
    /**
     * When user still authenticated and access_token is not expired retain current route
     */
    if (AuthService.isAuthenticated() && !AuthService.isAccessTokenExpired()) {
      return next(from.path)
    }

    AuthService.flush()
    return next()
  },

  /**
   * Route Guard for reset password endpoint
   *
   * @param {*} to
   * @param {*} from
   * @param {*} next
   * @return next
   */
  async resetPassword (to, from, next) {
    const email = to.query.email
    const token = to.query.token

    if (!token || !email) return next(from.path)

    return next()
  }
}
