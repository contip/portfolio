import type { CollectionConfig } from 'payload'
import { anyone } from '@/collections/access/anyone'
import { authenticated } from '@/collections/access/authenticated'
import populateDynamicFields from './hooks/populate-dynamic-fields'
import { generatePreviewPath } from '@/utilities/generatePreviewPath'
import { revalidateCategories, revalidateDelete } from './hooks/revalidateCategories'

export const Categories: CollectionConfig = {
  slug: 'categories',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['title', 'featured', 'updatedAt'],
    useAsTitle: 'title',
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: typeof data?.slug === 'string' ? data.slug : '',
        collection: 'categories',
        req,
      }),
  },
  hooks: {
    beforeChange: [populateDynamicFields],
    afterChange: [revalidateCategories],
    afterDelete: [revalidateDelete],
  },
  fields: [
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Feature this category on the blog landing page.',
      },
    },
    {
      name: 'featuredRank',
      type: 'number',
      admin: {
        position: 'sidebar',
        description: 'Higher numbers appear first in featured placements.',
        condition: (data) => Boolean(data?.featured),
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Title & Config',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
            },
            {
              name: 'description',
              type: 'textarea',
              label: 'Category Description',
              required: true,
            },
            {
              name: 'image',
              type: 'upload',
              hasMany: false,
              relationTo: 'media',
              label: 'Category Image',
              admin: {
                description: 'Image for this category, used in the posts categories grid',
              },
            },
            {
              name: 'fullTitle',
              label: 'Full Title (Breadcrumbs Display)',
              type: 'text',
              admin: {
                readOnly: true,
              },
            },
            {
              name: 'url',
              label: 'URL',
              type: 'text',
              admin: {
                readOnly: true,
              },
            },
            {
              name: 'parentId',
              label: 'Category Parent ID',
              type: 'relationship',
              relationTo: 'categories',
              hasMany: false,
              defaultValue: undefined,
              admin: {
                hidden: true,
              },
            },
            {
              name: 'parentIdUi',
              type: 'ui',
              label: 'Category Parent',
              admin: {
                components: {
                  Field: '@/components/CategorySelect',
                },
              },
            },
          ],
        },
        {
          label: 'Posts',
          fields: [
            {
              name: 'posts',
              type: 'join',
              collection: 'posts',
              on: 'category',
              maxDepth: 2,
            },
          ],
        },
      ],
    },
    {
      name: 'slug',
      type: 'text',
      label: 'Slug',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
  ],
}
