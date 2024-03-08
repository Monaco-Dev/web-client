export default {
  services: {
    /**
     * ===========================================
     * Service Configuration
     * ===========================================
     */
    auth: {
      url: import.meta.env.VITE_APP_AUTH_SERVICE_URL
    },
    feed: {
      url: import.meta.env.VITE_APP_FEED_SERVICE_URL
    },
    test: import.meta.env.VITE_APP_GTAG_PROPERTY_ID
  }
}
