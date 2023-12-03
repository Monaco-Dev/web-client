import api from '../index'
import Config from '@/config/app'

const {
  http,
  destroy
} = api

/**
 * ===================
 * ConnectionInvitation API
 * ===================
 */
export default {
  baseUrl: `${Config.services.auth.url}/api`,
  url: 'connection-invitations',
  http,
  destroy,

  /**
   * Store a newly created resource in storage.
   *
   */
  send (id, payload) {
    return this.http(this.baseUrl)
      .post(`${this.url}/${id}/send`, payload)
  },

  /**
   * Search for a specific resource in the database using POST.
   *
   */
  searchOutgoing (payload) {
    return this.http(this.baseUrl)
      .post(`${this.url}/search/outgoing`, payload)
  },

  /**
   * Search for a specific resource in the database using POST.
   *
   */
  searchIncoming (payload) {
    return this.http(this.baseUrl)
      .post(`${this.url}/search/incoming`, payload)
  }
}
