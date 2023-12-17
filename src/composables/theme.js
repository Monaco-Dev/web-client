/**
 * ===============================================
 * Theme service
 * ===============================================
 */

export default {
  /**
   * Stores the current theme in localStorage
   *
   * @param data
   */
  setTheme (data) {
    localStorage.setItem('theme', data)
  },
  /**
   * Gets the current theme in localStorage.
   *
   * @return *
   */
  getTheme () {
    return localStorage.getItem('theme') ?? 'light'
  }
}
