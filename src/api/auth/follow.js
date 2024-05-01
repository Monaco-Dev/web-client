import api from '../index'
import Config from '@/config/app'

const { http } = api

/**
 * ===================
 * Follow API
 * ===================
 */
export default {
  baseUrl: `${Config.services.auth.url}/api`,
  url: 'follows',
  http,

  /**
   * Store a newly created resource in storage.
   *
   */
  follow(id) {
    return this.http(this.baseUrl).post(`${this.url}/${id}/follow`)
  },

  /**
   * Remove the specified resource from storage.
   *
   */
  unfollow(id) {
    return this.http(this.baseUrl).delete(`${this.url}/${id}/unfollow`)
  },

  /**
   * Search for a specific resource in the database using POST.
   *
   */
  searchFollowing(payload) {
    return this.http(this.baseUrl).post(`${this.url}/search/following`, payload)
  },

  /**
   * Search for a specific resource in the database using POST.
   *
   */
  searchFollowers(payload) {
    return this.http(this.baseUrl).post(`${this.url}/search/followers`, payload)
  },
}
