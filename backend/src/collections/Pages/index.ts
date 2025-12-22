import type { CollectionConfig } from 'payload'
import { authenticated } from '@/collections/access/authenticated'
import { authenticatedOrPublished } from '@/collections/access/authenticatedOrPublished'
import Content from '@/blocks/Content/config'
import { CallToAction } from '@/blocks/CallToAction/config'
import Features from '@/blocks/Features/config'
import FormBlock from '@/blocks/Form/config'
import { BlogArchive } from '@/blocks/BlogArchive/config'
import BlogHighlight from '@/blocks/BlogHighlight/config'
import { slugField } from '@/fields/slug'
import { hero } from '@/heros/config'
import { populatePublishedAt } from '@/hooks/populate-published-at'
import { generatePreviewPath } from '@/utilities/generatePreviewPath'
import { revalidateDelete, revalidatePage } from './hooks/revalidatePage'

export const Pages: CollectionConfig = {
  slug: 'pages',
  access: {
    read: authenticatedOrPublished,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    defaultColumns: ['title', 'slug', 'updatedAt'],
    useAsTitle: 'title',
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: typeof data?.slug === 'string' ? data.slug : '',
        collection: 'pages',
        req,
      }),
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Title & Hero',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
            },
            {
              name: 'description',
              type: 'textarea',
            },
            hero,
          ],
        },
        {
          label: 'Content',
          fields: [
            {
              name: 'layout',
              type: 'blocks',
              blocks: [Content, CallToAction, Features, FormBlock, BlogArchive, BlogHighlight],
              required: true,
            },
          ],
        },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
    slugField(),
    {
      name: 'page',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        hidden: true,
      },
    },
  ],
  hooks: {
    afterChange: [revalidatePage],
    beforeChange: [populatePublishedAt],
    afterDelete: [revalidateDelete],
  },
  versions: {
    drafts: true,
  },
}
