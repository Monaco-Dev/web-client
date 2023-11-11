import api from '../index'
import Config from '@/config/app'

const {
  http,
  show,
  update,
  search
} = api

/**
 * ===================
 * User API
 * ===================
 */
export default {
  baseUrl: `${Config.services.auth.url}/api`,
  url: 'users',
  http,
  show,
  update,
  search,

  /**
   * Validate and verify email token
   *
   * @param string path
   * @param {*} params
   * @return {*} http
   */
  verifyEmail (path, params) {
    return this.http(this.baseUrl).get(path, params)
  },

  /**
   * Resend verification email
   *
   * @return {*} http
   */
  resendVerificationEmail () {
    return this.http(this.baseUrl)
      .post('auth/email/verification-notification')
  },

  /**
   * Deactivate account
   *
   * @return {*} http
   */
  deactivate () {
    return this.http(this.baseUrl).post('auth/deactivate')
  }
}
