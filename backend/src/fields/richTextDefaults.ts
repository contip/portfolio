import type { Block } from 'payload'
import { CallToAction } from '@/blocks/CallToAction/config'
import FormBlock from '@/blocks/Form/config'
import { MediaBlock } from '@/blocks/MediaBlock/config'
import MediaGrid from '@/blocks/MediaGrid/config'
import BlogHighlight from '@/blocks/BlogHighlight/config'
import { BlogArchive } from '@/blocks/BlogArchive/config'
import { Code } from '@/blocks/Code/config'
import { defaultRichTextInlineBlocks } from '@/fields/richTextInlineBlocks'

export const defaultRichTextBlocks: Block[] = [
  CallToAction,
  FormBlock,
  MediaBlock,
  MediaGrid,
  BlogHighlight,
  BlogArchive,
  Code,
]
export { defaultRichTextInlineBlocks }
