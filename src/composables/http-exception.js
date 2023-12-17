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

let apiError

/**
 * Determine the appropriate action for the error
 *
 * @param error
 */
export default function httpException (error) {
  this.dialogStore = useDialogStore()

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
  this.dialogStore.openAlertDialog({
    title: 'Server Error',
    body: 'We have encountered issues with our server, and our team is working on it. Apologies for any inconvenience this may have caused.'
  })
}

/**
 * Shows an alert dialog with the error status from response.
 *
 */
function defaultError () {
  this.dialogStore.openAlertDialog({
    title: apiError.statusText,
    body: apiError.message
  })
}

/**
 * Shows an alert dialog with a status of 500.
 *
 */
function internalServerError () {
  this.dialogStore.openAlertDialog({
    title: 'Oops! Something went wrong.',
    body: apiError.data.message
  })
}

/**
 * Shows an alert dialog with a status of 404.
 *
 */
function notFound () {
  this.dialogStore.openAlertDialog({
    title: 'The requested resource was not found.',
    body: apiError.data.message
  })
}

/**
 * Shows an alert dialog with a status of 401.
 *
 */
function unauthenticated () {
  this.dialogStore.openAlertDialog({
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
  this.dialogStore.openAlertDialog({
    title: 'Forbidden',
    body: apiError.data.message
  })
}

/**
 * Shows an alert dialog with a status of 422.
 *
 */
function unprocessable () {
  this.dialogStore.openAlertDialog({
    title: 'There was an error with your request.',
    body: apiError.data.message
  })
}

/**
 * Shows an alert dialog with a status of 429.
 *
 */
function tooManyRequestsError () {
  this.dialogStore.openAlertDialog({
    title: 'Too many requests.',
    body: apiError.data.message
  })
}
