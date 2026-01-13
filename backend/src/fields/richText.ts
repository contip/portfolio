import richTextBase, { type RichTextAdditions, type RichTextOverrides } from '@/fields/richTextBase'
import { defaultRichTextBlocks, defaultRichTextInlineBlocks } from '@/fields/richTextDefaults'

type RichTextAdditionsWithDefaults = RichTextAdditions & {
  overrideBlocks?: boolean
  overrideInlineBlocks?: boolean
}

const richText = (overrides?: RichTextOverrides, additions: RichTextAdditionsWithDefaults = {}) => {
  const mergedBlocks = additions.overrideBlocks
    ? additions.blocks ?? []
    : [...defaultRichTextBlocks, ...(additions.blocks ?? [])]

  const mergedInlineBlocks = additions.overrideInlineBlocks
    ? additions.inlineBlocks ?? []
    : [...defaultRichTextInlineBlocks, ...(additions.inlineBlocks ?? [])]

  return richTextBase(overrides, {
    ...additions,
    blocks: mergedBlocks,
    inlineBlocks: mergedInlineBlocks,
  })
}

export default richText
