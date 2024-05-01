import AuthService from '@/composables/auth'

/**
 * Route Guard for registration endpoint (login, register)
 *
 * @param {*} from
 * @param {*} next
 * @return next
 */
export default async function registration(from, next) {
  /**
   * When user still authenticated and access_token is not expired retain current route
   */
  if (AuthService.isAuthenticated() && !AuthService.isAccessTokenExpired()) {
    return next(from.path)
  }

  AuthService.flush()
  return next()
}
