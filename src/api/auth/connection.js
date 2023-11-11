import api from '../index'
import Config from '@/config/app'

const {
  http,
  search
} = api

/**
 * ===================
 * Connection API
 * ===================
 */
export default {
  baseUrl: `${Config.services.auth.url}/api`,
  url: 'connections',
  http,
  search,

  /**
   * Store a newly created resource in storage.
   *
   */
  connect (id) {
    return this.http(this.baseUrl)
      .post(`${this.url}/${id}/connect`)
  },

  /**
   * Remove the specified resource from storage.
   *
   */
  disconnect (id) {
    return this.http(this.baseUrl)
      .delete(`${this.url}/${id}/disconnect`)
  }
}
