/**
 * =======================================
 * Route Guards
 * =======================================
 */
export default async function resetPassword (to, from, next) {
  const email = to.query.email
  const token = to.query.token

  if (!token || !email) return next(from.path)

  return next()
}
