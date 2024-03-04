import { DateTime } from 'luxon'
import KFormatter from '@/composables/k-formatter'

/**
 * ===============================================
 * Post service
 * ===============================================
 */

export default {
  /**
   * Prepare post item
   *
   * @param {*} post
   * @return {*}
   */
  mapPost (post) {
    post.timestamp = this.mapTime(post.created_at)
    post.matches_count = KFormatter(post.matches_count ?? 0)
    post.shares_count = KFormatter(post.shares_count ?? 0)
    post.loading = false

    if (post.is_shared) {
      post.shared_post.content.hasSummary = false
      post.shared_post.timestamp = this.mapTime(post.shared_post.created_at)

      const summary = post.shared_post.content.body.slice(0, 500)

      if (summary.length === 500) {
        post.shared_post.content.hasSummary = true
        post.shared_post.content.summary = summary + '...'
        post.shared_post.content.summary = post.shared_post.content.summary.replace(/\n/g, '<br/>')
        post.shared_post.content.expanded = false
      }

      post.shared_post.content.original_body = post.shared_post.content.body
      post.shared_post.content.body = post.shared_post.content.body.replace(/\n/g, '<br/>')
    } else {
      post.content.hasSummary = false

      const summary = post.content.body.slice(0, 500)

      if (summary.length === 500) {
        post.content.hasSummary = true
        post.content.summary = summary + '...'
        post.content.summary = post.content.summary.replace(/\n/g, '<br/>')
        post.content.expanded = false
      }

      post.content.original_body = post.content.body
      post.content.body = post.content.body.replace(/\n/g, '<br/>')
    }

    return post
  },

  mapTime (time) {
    const stamp = DateTime.fromISO(time).toRelative()
    return stamp === '0 seconds ago' ? 'Just now' : stamp
  }
}
