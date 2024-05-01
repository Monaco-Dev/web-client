import axios from 'axios'

import AuthService from '@/composables/auth'

/**
 *============================================================
 * API
 * ===========================================================
 *
 * Initialize the axios instance with an Authorization header.
 * Refreshes expired token before am API request.
 *
 */
export default {
  /**
   * Creates an axios instance with an access token as authorization header
   *
   * @param String baseUrl
   * @return {*} http
   */
  http(baseUrl) {
    const http = axios.create({ baseURL: baseUrl })

    http.interceptors.request.use(async (config) => {
      if (!AuthService.isAuthenticated()) return config

      /**
       * Interrupt request and check if access_token is expired then
       * Attempt Refreshing the token
       */
      if (AuthService.isAccessTokenExpired()) {
        await AuthService.refreshToken()
          .then(({ data }) => AuthService.setAuth(data))
          .catch(() => {
            AuthService.flush()
            window.location.replace(`${window.location.origin}/login`)
          })
      }

      /**
       * Set Headers config
       */
      config.headers.Accept = 'application/json'
      config.headers.Authorization = `Bearer ${AuthService.getAccessToken()}`

      return config
    })

    return http
  },

  /**
   * Display a list of the resource.
   *
   */
  index(params = null) {
    return this.http(this.baseUrl).get(this.url, { params })
  },

  /**
   * Display the specified resource.
   *
   */
  show(id, params = null) {
    return this.http(this.baseUrl).get(`${this.url}/${id}`, { params })
  },

  /**
   * Store a newly created resource in storage.
   *
   */
  store(payload) {
    return this.http(this.baseUrl).post(`${this.url}`, payload)
  },

  /**
   * Update the specified resource in storage.
   *
   */
  update(id, payload) {
    return this.http(this.baseUrl).put(`${this.url}/${id}`, payload)
  },

  /**
   * Remove the specified resource from storage.
   *
   */
  destroy(id) {
    return this.http(this.baseUrl).delete(`${this.url}/${id}`)
  },

  /**
   * Search for a specific resource in the database using POST.
   *
   */
  search(payload) {
    return this.http(this.baseUrl).post(`${this.url}/search`, payload)
  },
}
