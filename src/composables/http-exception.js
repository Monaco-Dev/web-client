/**
 * ===============================================
 * HTTP Exception
 * ===============================================
 *
 * Handles HTTP exceptions by prompting users.
 * Imported by components that uses APIs, and
 * called in the .catch() fallback of HTTP calls.
 *
 * ===============================================
 */

import { useDialogStore } from '@/store/dialog'
import auth from '@/composables/auth'

const dialogStore = useDialogStore()
let apiError = null

/**
 * Determine the appropriate action for the error
 *
 * @param error
 */
export default function httpException (error) {
  if (!error) return criticalError()

  setError(error)

  switch (error.status) {
    case 401:
      return unauthenticated()

    case 403:
      return unauthorized()

    case 404:
      return notFound()

    case 422:
      return unprocessable()

    case 429:
      return tooManyRequestsError()

    case 500:
      return internalServerError()

    default:
      return defaultError()
  }
}

/**
 * Parse error string if error is not yet an object
 *
 * @param error
 */
function setError (error) {
  if (typeof error !== 'object') error.error = JSON.parse(error.error)

  apiError = error
}

/**
 * Handles critical error without response.
 *
 */
function criticalError () {
  dialogStore.openAlertDialog({
    title: 'Server Error',
    body: 'We have encountered issues with our server, and our team is working on it. Apologies for any inconvenience this may have caused.'
  })
}

/**
 * Shows an alert dialog with the error status from response.
 *
 */
function defaultError () {
  dialogStore.openAlertDialog({
    title: apiError.statusText,
    body: apiError.message
  })
}

/**
 * Shows an alert dialog with a status of 500.
 *
 */
function internalServerError () {
  dialogStore.openAlertDialog({
    title: 'Oops! Something went wrong.',
    body: apiError.data.message
  })
}

/**
 * Shows an alert dialog with a status of 404.
 *
 */
function notFound () {
  dialogStore.openAlertDialog({
    title: 'The requested resource was not found.',
    body: apiError.data.message
  })
}

/**
 * Shows an alert dialog with a status of 401.
 *
 */
function unauthenticated () {
  dialogStore.openAlertDialog({
    title: 'Please login to continue.',
    body: apiError.data.message,
    action: () => {
      auth.flush()
      window.location.replace(`${window.location.origin}/login`)
      sessionStorage.clear()
    }
  })
}

/**
 * Shows an alert dialog with a status of 403.
 *
 */
function unauthorized () {
  dialogStore.openAlertDialog({
    title: 'Forbidden',
    body: apiError.data.message
  })
}

/**
 * Shows an alert dialog with a status of 422.
 *
 */
function unprocessable () {
  dialogStore.openAlertDialog({
    title: 'There was an error with your request.',
    body: apiError.data.message
  })
}

/**
 * Shows an alert dialog with a status of 429.
 *
 */
function tooManyRequestsError () {
  dialogStore.openAlertDialog({
    title: 'Too many requests.',
    body: apiError.data.message
  })
}
