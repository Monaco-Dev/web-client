import api from '../index'
import Config from '@/config/app'

const {
  http
} = api

/**
 * ===================
 * License API
 * ===================
 */
export default {
  baseUrl: `${Config.services.auth.url}/api`,
  url: 'licenses',
  http,

  /**
   * Store a newly created resource in storage.
   *
   */
  store (payload) {
    return this.http(this.baseUrl)
      .post(`${this.url}`, payload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
  }
}
