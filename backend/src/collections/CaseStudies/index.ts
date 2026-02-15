import type { CollectionConfig } from 'payload'
import { authenticated } from '@/collections/access/authenticated'
import { authenticatedOrPublished } from '@/collections/access/authenticatedOrPublished'
import Content from '@/blocks/Content/config'
import { CallToAction } from '@/blocks/CallToAction/config'
import FormBlock from '@/blocks/Form/config'
import { MediaBlock } from '@/blocks/MediaBlock/config'
import MediaGrid from '@/blocks/MediaGrid/config'
import { Code } from '@/blocks/Code/config'
import { slugField } from '@/fields/slug'
import { hero } from '@/heros/config'
import { populatePublishedAt } from '@/hooks/populate-published-at'
import { generatePreviewPath } from '@/utilities/generatePreviewPath'
import { revalidateCaseStudies, revalidateDelete } from './hooks/revalidateCaseStudies'

export const CaseStudies: CollectionConfig = {
  slug: 'caseStudies',
  labels: {
    singular: 'Case Study',
    plural: 'Case Studies',
  },
  access: {
    read: authenticatedOrPublished,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    defaultColumns: ['title', 'clientName', 'industry', 'publishedAt', 'updatedAt'],
    useAsTitle: 'title',
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: typeof data?.slug === 'string' ? data.slug : '',
        collection: 'caseStudies',
        req,
      }),
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Overview',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
            },
            {
              name: 'summary',
              type: 'textarea',
              required: true,
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'clientName',
                  label: 'Client',
                  type: 'text',
                },
                {
                  name: 'industry',
                  type: 'text',
                },
                {
                  name: 'engagementDuration',
                  type: 'text',
                },
              ],
            },
            {
              name: 'heroImage',
              type: 'upload',
              relationTo: 'media',
              hasMany: false,
            },
            hero,
          ],
        },
        {
          label: 'Key Results',
          fields: [
            {
              name: 'keyResults',
              type: 'array',
              maxRows: 8,
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'value',
                  type: 'text',
                  required: true,
                },
              ],
            },
          ],
        },
        {
          label: 'Content',
          fields: [
            {
              name: 'layout',
              type: 'blocks',
              blocks: [
                Content,
                CallToAction,
                FormBlock,
                MediaBlock,
                MediaGrid,
                Code,
              ],
              required: true,
            },
          ],
        },
        {
          label: 'Relationships',
          fields: [
            {
              name: 'services',
              type: 'relationship',
              relationTo: 'services',
              hasMany: true,
            },
            {
              name: 'relatedCaseStudies',
              type: 'relationship',
              relationTo: 'caseStudies',
              hasMany: true,
              filterOptions: ({ id }) => ({
                id: {
                  not_in: [id],
                },
              }),
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
      name: 'caseStudy',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        hidden: true,
      },
    },
  ],
  hooks: {
    afterChange: [revalidateCaseStudies],
    beforeChange: [populatePublishedAt],
    afterDelete: [revalidateDelete],
  },
  versions: {
    drafts: true,
  },
}
