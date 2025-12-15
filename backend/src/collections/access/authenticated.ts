import type { Access, AccessArgs } from 'payload'

export const authenticated: Access = async ({ req, id, data }: AccessArgs) => {
  const { user } = req

  /* if no user, return false */
  if (!user) {
    return false
  }

  return true
}
