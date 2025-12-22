import type { CollectionConfig } from 'payload'
import { authenticated } from '@/collections/access/authenticated'
import { authenticatedOrPublished } from '@/collections/access/authenticatedOrPublished'
import { slugField } from '@/fields/slug'
import Content from '@/blocks/Content/config'
import { CallToAction } from '@/blocks/CallToAction/config'
import { hero } from '@/heros/config'
import Features from '@/blocks/Features/config'
import FormBlock from '@/blocks/Form/config'
import { populatePublishedAt } from '@/hooks/populate-published-at'
import { generatePreviewPath } from '@/utilities/generatePreviewPath'
import { revalidateService, revalidateDelete } from './hooks/revalidateService'

export const Services: CollectionConfig = {
  slug: 'services',
  labels: {
    singular: 'Service',
    plural: 'Services',
  },
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
        collection: 'services',
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
              label: 'Service Description',
              type: 'text',
              required: true,
              maxLength: 45,
              admin: {
                description:
                  'This is the blurb that appears in the nav dropdown. Max length 45 characters.',
              },
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
              blocks: [Content, CallToAction, Features, FormBlock],
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
      name: 'service',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
        hidden: true,
      },
    },
  ],
  hooks: {
    afterChange: [revalidateService],
    beforeChange: [populatePublishedAt],
    afterDelete: [revalidateDelete],
  },
  versions: {
    drafts: true,
  },
}
