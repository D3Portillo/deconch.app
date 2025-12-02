/** `true` when not in production environment */
export const isDevEnv = () => {
  return process.env.NODE_ENV != "production"
}
