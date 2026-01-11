import type { Block, Field } from 'payload'
import richText from '@/fields/richText'
import colorField from '@/fields/Color/config'
import { CallToAction } from '../CallToAction/config'
import Features from '../Features/config'
import FormBlock from '../Form/config'
import { MediaBlock } from '../MediaBlock/config'
import MediaGrid from '../MediaGrid/config'
import BlogHighlight from '../BlogHighlight/config'
import { BlogArchive } from '../BlogArchive/config'
import { Code } from '../Code/config'

const columnFields: Field[] = [
  {
    name: 'size',
    type: 'select',
    defaultValue: 'oneThird',
    options: [
      {
        label: 'One Third',
        value: 'oneThird',
      },
      {
        label: 'Half',
        value: 'half',
      },
      {
        label: 'Two Thirds',
        value: 'twoThirds',
      },
      {
        label: 'Full',
        value: 'full',
      },
    ],
  },
  richText(
    {},
    {
      blocks: [
        CallToAction,
        Features,
        FormBlock,
        MediaBlock,
        MediaGrid,
        BlogHighlight,
        BlogArchive,
        Code,
      ],
    },
  ),
  colorField({ name: 'backgroundColor', label: 'Background Color', prefix: 'bg-' }),
]

const Content: Block = {
  slug: 'content',
  interfaceName: 'ContentBlock',
  fields: [
    {
      name: 'columns',
      type: 'array',
      fields: columnFields,
    },
  ],
}

export default Content
