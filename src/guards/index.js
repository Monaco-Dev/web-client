import authorized from './authorized'
import unauthorized from './unauthorized'
import registration from './registration'
import resetPassword from './resetPassword'
import verifyLicense from './verifyLicense'

/**
 * =======================================
 * Route Guards
 * =======================================
 */
export default {
  authorized,
  unauthorized,
  registration,
  resetPassword,
  verifyLicense
}
