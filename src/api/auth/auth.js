/**
 * =====================================
 * API Request for Authentication
 * =====================================
 */
import axios from 'axios'
import Config from '@/config/app'
import AuthService from '@/composables/auth'

/**
  * Initial config for http request
  *
  * @param String baseUrl
  * @return {*} http
 */
const http = (baseUrl) => {
  const http = axios.create({ baseURL: baseUrl })

  http.interceptors.request.use(async config => {
    config.headers.Accept = 'application/json'
    return config
  })

  return http
}

export default {
  baseUrl: Config.services.auth.url,
  endpoint: '/api/auth',

  /**
   * Login request
   *
   * @param {*} params
   * @return {*} http
   */
  login (params) {
    return http(this.baseUrl).post(`${this.endpoint}/login`, params)
  },

  /**
   * Logout Request
   *
   * @param {*} params
   * @return {*} http
   */
  logout () {
    return http(this.baseUrl).post(`${this.endpoint}/logout`, {}, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${AuthService.getAccessToken()}`
      }
    })
  },

  /**
   * Register request
   *
   * @param {*} params
   * @return {*} http
   */
  register (params) {
    return http(this.baseUrl).post(`${this.endpoint}/register`, params)
  },

  /**
   * Request to send password reset
   *
   * @param {*} params
   * @return {*} http
   */
  forgotPassword (params) {
    return http(this.baseUrl).post(`${this.endpoint}/forgot-password`, params)
  },

  /**
   * Proceed to password reset
   *
   * @param {*} params
   * @return {*} http
   */
  resetPassword (params) {
    return http(this.baseUrl).post(`${this.endpoint}/reset-password`, params)
  }
}
