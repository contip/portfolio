import type { CollectionAfterReadHook } from 'payload'
import type { Post } from '@/payload-types'

export const populateAuthor: CollectionAfterReadHook<Post> = async ({ doc, req: { payload } }) => {
  if (doc?.author) {
    try {
      const authorDoc = await payload.findByID({
        id: typeof doc.author === 'object' ? doc.author?.id : doc.author,
        collection: 'users',
        depth: 0,
      })

      if (authorDoc) {
        doc.populatedAuthor = {
          id: String(authorDoc.id),
          name: authorDoc.name,
        }
      }
    } catch {
      // Swallow errors so public reads do not fail.
    }
  }

  return doc
}
