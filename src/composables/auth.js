import axios from 'axios'
import { DateTime } from 'luxon'
import { getActivePinia } from 'pinia'

import Config from '@/config/app'

/**
 * ===============================================
 * Auth service
 * ===============================================
 *
 * Provides authentication properties and actions
 *
 * ===============================================
 */

export default {
  /**
   * Formats and stores the auth access in localStorage
   *
   * @param data
   */
  setAuth(data) {
    data.expiration_date = DateTime.now().plus({ seconds: 31622400 }).toISO()

    localStorage.setItem('auth', JSON.stringify(data))
  },
  /**
   * Gets the auth access in localStorage.
   *
   * @return * { token_type, access_token, refresh_token, expires_in, expiration_date }
   */
  getAuth() {
    return JSON.parse(localStorage.getItem('auth'))
  },
  /**
   * store the user data in localStorage
   *
   * @param data
   */
  setUser(data) {
    localStorage.setItem('user', JSON.stringify(data))
  },
  /**
   * Gets the user data in localStorage.
   *
   * @return {*}
   */
  getUser() {
    return JSON.parse(localStorage.getItem('user'))
  },
  /**
   * Verify if authenticated
   *
   * @return bool
   */
  isAuthenticated() {
    return !!this.getAuth()
  },
  /**
   * Gets the access_token from auth.
   *
   * @return string
   */
  getAccessToken() {
    return this.getAuth() ? this.getAuth().access_token : null
  },
  /**
   * Gets the refresh_token from auth.
   *
   * @return string
   */
  getRefreshToken() {
    return this.getAuth() ? this.getAuth().refresh_token : null
  },
  /**
   * Gets the expiration_date from auth.
   *
   */
  getTokenExpiration() {
    return this.getAuth() ? this.getAuth().expiration_date : null
  },
  /**
   * Removes auth and user from localStorage.
   *
   */
  flush() {
    localStorage.removeItem('auth')
    localStorage.removeItem('user')
    sessionStorage.clear()
    getActivePinia()._s.forEach((store) => store.$reset())
  },
  /**
   * Checks if token is expired.
   * An allowance of 1 minute is set
   * to prevent tokens expiring between API calls
   *
   * @return bool
   */
  isAccessTokenExpired() {
    return (
      DateTime.now().plus({ minutes: 1 }) >=
      DateTime.fromISO(this.getTokenExpiration())
    )
  },
  /**
   * Sends an auth check request to Auth API.
   *
   * @return {*} http
   */
  verifyAccessToken() {
    const headers = {
      Accept: 'application/json',
      Authorization: `Bearer ${this.getAccessToken()}`,
    }

    return axios.get(`${Config.services.auth.url}/api/auth/verify-token`, {
      headers,
    })
  },
  /**
   * Sends refresh token to Auth API.
   *
   * @return {*} http
   */
  refreshToken() {
    const headers = { Accept: 'application/json' }

    const payload = { refresh_token: `${this.getRefreshToken()}` }

    return axios.post(
      `${Config.services.auth.url}/api/auth/refresh-token`,
      payload,
      { headers },
    )
  },
  /**
   * Sends refresh token to Auth API.
   *
   * @return {*} http
   */
  socialite(id, driver) {
    const headers = { Accept: 'application/json' }

    const payload = { id }

    return axios.post(
      `${Config.services.auth.url}/api/auth/${driver}/login`,
      payload,
      { headers },
    )
  },
}
