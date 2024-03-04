import api from '../index'
import Config from '@/config/app'

const {
  http,
  show,
  store,
  destroy,
  search
} = api

/**
 * ===================
 * Post API
 * ===================
 */
export default {
  baseUrl: `${Config.services.feed.url}/api`,
  url: 'posts',
  http,
  show,
  store,
  search,
  destroy,

  /**
   * Update the specified resource in storage.
   *
   */
  update (payload) {
    return this.http(this.baseUrl)
      .post(`${this.url}/update`, payload)
  },

  searchWall (id, payload) {
    return this.http(this.baseUrl)
      .post(`${this.url}/search/wall/${id}`, payload)
  },

  searchMatches (id, payload) {
    return this.http(this.baseUrl)
      .post(`${this.url}/search/${id}/matches`, payload)
  },

  searchPins (payload) {
    return this.http(this.baseUrl)
      .post(`${this.url}/search/pins`, payload)
  },

  searchArchives (payload) {
    return this.http(this.baseUrl)
      .post(`${this.url}/search/archives`, payload)
  },

  share (id) {
    return this.http(this.baseUrl)
      .post(`${this.url}/${id}/share`)
  },

  pin (id) {
    return this.http(this.baseUrl)
      .post(`${this.url}/${id}/pin`)
  },

  unpin (id) {
    return this.http(this.baseUrl)
      .post(`${this.url}/${id}/unpin`)
  },

  restore (id) {
    return this.http(this.baseUrl)
      .post(`${this.url}/${id}/restore`)
  }
}
