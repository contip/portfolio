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
              name: 'enableHero',
              label: 'Enable Hero Section',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                description: 'Add a featured section on the left side of the dropdown',
              },
            },
            {
              name: 'hero',
              label: 'Hero Section',
              type: 'group',
              admin: {
                condition: (_data, siblingData) => siblingData?.enableHero === true,
              },
              fields: [
                {
                  name: 'title',
                  label: 'Title',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'description',
                  label: 'Description',
                  type: 'textarea',
                },
                link({
                  overrides: {
                    name: 'heroLink',
                    label: 'Hero Link',
                    admin: {
                      hideGutter: true,
                    },
                  },
                }),
              ],
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
                {
                  name: 'description',
                  label: 'Description',
                  type: 'text',
                  admin: {
                    description: 'Short description shown below the link in the dropdown menu',
                  },
                },
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
