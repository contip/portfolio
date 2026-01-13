import colorField from '@/fields/Color/config'
import { link } from '@/fields/link'
import richTextBase from '@/fields/richTextBase'
import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { Block } from 'payload'

const Features: Block = {
  slug: 'featuresBlock',
  interfaceName: 'FeaturesBlock',
  fields: [
    // {
    //   name: 'background',
    //   label: 'Background',
    //   type: 'select',
    //   defaultValue: 'dark',
    //   options: [
    //     {
    //       label: 'Light',
    //       value: 'light',
    //     },
    //     {
    //       label: 'Dark',
    //       value: 'dark',
    //     },
    //   ],
    // },
    colorField({ name: 'backgroundColor', label: 'Background Color', prefix: 'bg-' }),
    {
      name: 'tagline',
      label: 'Tagline',
      type: 'text',
    },
    // {
    //   name: 'richText',
    //   type: 'richText',
    //   label: 'Title',
    //   editor: lexicalEditor({
    //     features: ({ rootFeatures }) => {
    //       return [
    //         ...rootFeatures,
    //         HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
    //         FixedToolbarFeature(),
    //         InlineToolbarFeature(),
    //       ]
    //     },
    //   }),
    // },
    richTextBase({ name: 'richText', label: 'Title' }),
    {
      name: 'features',
      type: 'array',
      label: 'Features',
      maxRows: 3,
      fields: [
        {
          name: 'name',
          label: 'Name',
          type: 'text',
          required: true,
        },
        {
          name: 'icon',
          label: 'Icon',
          type: 'relationship',
          relationTo: 'icons',
          hasMany: false,
        },
        {
          name: 'description',
          label: 'Description',
          type: 'textarea',
          required: true,
        },
        {
          name: 'hasLink',
          label: 'Include Link',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          admin: {
            condition: (_, siblingData) => siblingData.hasLink === true,
          },
          ...link(),
        },
      ],
    },
  ],
}

export default Features
