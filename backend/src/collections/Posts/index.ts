import type { CollectionConfig } from 'payload'
import { authenticated } from '@/collections/access/authenticated'
import { authenticatedOrPublished } from '@/collections/access/authenticatedOrPublished'
import Content from '@/blocks/Content/config'
import Features from '@/blocks/Features/config'
import FormBlock from '@/blocks/Form/config'
import { slugField } from '@/fields/slug'
import { populatePublishedAt } from '@/hooks/populate-published-at'
import { generatePreviewPath } from '@/utilities/generatePreviewPath'
import { populateAuthor } from './hooks/populateAuthor'
import { revalidateDelete, revalidatePosts } from './hooks/revalidatePosts'

export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: {
    singular: 'Post',
    plural: 'Posts',
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
        collection: 'posts',
        req,
      }),
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Name & Description',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
            },
            {
              name: 'description',
              type: 'text',
              required: true,
            },
            {
              name: 'heroImage',
              type: 'upload',
              hasMany: false,
              relationTo: 'media',
            },
          ],
        },
        {
          label: 'Content',
          fields: [
            {
              name: 'layout',
              type: 'blocks',
              blocks: [Content, Features, FormBlock],
              required: true,
            },
          ],
        },
        {
          label: 'Relationships',
          fields: [
            {
              name: 'relatedPosts',
              type: 'relationship',
              relationTo: 'posts',
              filterOptions: ({ id }) => {
                return {
                  id: {
                    not_in: [id],
                  },
                }
              },
              hasMany: true,
            },
            {
              name: 'category',
              type: 'relationship',
              relationTo: 'categories',
              hasMany: false,
              maxDepth: 2,
              admin: {
                hidden: true,
              },
            },
            {
              name: 'categoryUi',
              label: 'Post Category',
              type: 'ui',
              admin: {
                components: {
                  Field: '@/components/CategorySelect',
                },
              },
            },
          ],
        },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        position: 'sidebar',
      },
    },
    {
      name: 'author',
      type: 'relationship',
      admin: {
        position: 'sidebar',
      },
      hasMany: false,
      relationTo: 'users',
    },
    {
      name: 'populatedAuthor',
      type: 'group',
      access: {
        update: () => false,
      },
      admin: {
        disabled: true,
        readOnly: true,
      },
      fields: [
        {
          name: 'id',
          type: 'text',
        },
        {
          name: 'name',
          type: 'text',
        },
      ],
    },
    {
      name: 'post',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        hidden: true,
      },
    },
    slugField(),
  ],
  hooks: {
    afterChange: [revalidatePosts],
    afterRead: [populateAuthor],
    beforeChange: [populatePublishedAt],
    afterDelete: [revalidateDelete],
  },
  versions: {
    drafts: true,
  },
}
