import type { GlobalConfig } from 'payload'
import { anyone } from '@/collections/access/anyone'
import { authenticated } from '@/collections/access/authenticated'
import { link } from '@/fields/link'
import { revalidateNav } from './hooks/revalidateNav'

const Nav: GlobalConfig = {
  slug: 'nav',
  access: {
    read: anyone,
    update: authenticated,
  },
  fields: [
    {
      name: 'logo',
      type: 'upload',
      hasMany: false,
      relationTo: 'media',
    },
    {
      name: 'logoType',
      type: 'radio',
      options: [
        {
          label: 'Square',
          value: 'square',
        },
        {
          label: 'Rectangular',
          value: 'rectangular',
        },
      ],
      defaultValue: 'rectangular',
      admin: {
        description: 'Square: w-24 h-24, Rectangular: w-72 h-24',
      },
    },
    {
      name: 'navItems',
      label: 'Nav Items',
      type: 'array',
      fields: [
        {
          name: 'type',
          type: 'radio',
          options: [
            {
              label: 'Single Link',
              value: 'link',
            },
            {
              label: 'Dropdown',
              value: 'dropdown',
            },
          ],
          defaultValue: 'link',
        },
        {
          type: 'row',
          fields: [link()],
          admin: {
            condition: (_data, siblingData) => siblingData?.type === 'link',
          },
        },
        {
          name: 'ddSettings',
          label: 'Dropdown Settings',
          type: 'group',
          admin: {
            condition: (_data, siblingData) => siblingData?.type === 'dropdown',
          },
          fields: [
            {
              name: 'title',
              label: 'Dropdown Title',
              type: 'text',
              required: true,
            },
            {
              name: 'ddLinks',
              label: 'Dropdown Links',
              type: 'array',
              fields: [
                link({
                  overrides: {
                    admin: {
                      hideGutter: true,
                    },
                  },
                }),
              ],
              maxRows: 6,
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateNav],
  },
}

export default Nav
