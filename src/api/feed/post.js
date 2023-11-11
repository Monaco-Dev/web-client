import api from '../index'
import Config from '@/config/app'

const {
  http,
  show,
  store,
  update,
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
  update,
  search,
  destroy,

  searchWall (id, payload) {
    return this.http(this.baseUrl)
      .post(`${this.url}/search/wall/${id}`, payload)
  },

  searchMatches (id, payload) {
    return this.http(this.baseUrl)
      .post(`${this.url}/search/${id}/matches`, payload)
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
  }
}
