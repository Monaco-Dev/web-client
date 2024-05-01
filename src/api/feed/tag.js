import api from '../index'
import Config from '@/config/app'

const { http, search } = api

/**
 * ===================
 * Tag API
 * ===================
 */
export default {
  baseUrl: `${Config.services.feed.url}/api`,
  url: 'tags',
  http,
  search,
}
