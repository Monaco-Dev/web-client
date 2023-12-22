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
    post.loading = false

    if (post.is_shared) {
      post.content.content.hasSummary = false
      post.content.timestamp = this.mapTime(post.content.created_at)

      const summary = post.content.content.body.slice(0, 500)

      if (summary.length === 500) {
        post.content.content.hasSummary = true
        post.content.content.summary = summary + '...'
        post.content.content.summary = post.content.content.summary.replace(/\n/g, '<br/>')
        post.content.content.expanded = false

        const summaryTags = post.content.content.summary.match(/#\w+/g) ?? []
        summaryTags.forEach(tag => {
          post.content.content.summary = post.content.content.summary.replace(tag, `<a href="?search=${tag}">${tag}</a>`)
        })
      }

      post.content.content.original_body = post.content.content.body
      post.content.content.body = post.content.content.body.replace(/\n/g, '<br/>')

      const bodyTags = post.content.content.body.match(/#\w+/g) ?? []

      bodyTags.forEach(tag => {
        post.content.content.body = post.content.content.body.replace(tag, `<a href="?search=${tag}">${tag}</a>`)
      })
    } else {
      post.content.hasSummary = false

      const summary = post.content.body.slice(0, 500)

      if (summary.length === 500) {
        post.content.hasSummary = true
        post.content.summary = summary + '...'
        post.content.summary = post.content.summary.replace(/\n/g, '<br/>')
        post.content.expanded = false

        const summaryTags = post.content.summary.match(/#\w+/g) ?? []
        summaryTags.forEach(tag => {
          post.content.summary = post.content.summary.replace(tag, `<a href="?search=${tag}">${tag}</a>`)
        })
      }

      post.content.original_body = post.content.body
      post.content.body = post.content.body.replace(/\n/g, '<br/>')

      const bodyTags = post.content.body.match(/#\w+/g) ?? []

      bodyTags.forEach(tag => {
        post.content.body = post.content.body.replace(tag, `<a href="?search=${tag}">${tag}</a>`)
      })
    }

    return post
  },

  mapTime (time) {
    const stamp = DateTime.fromISO(time).toRelative()
    return stamp === '0 seconds ago' ? 'Just now' : stamp
  }
}
