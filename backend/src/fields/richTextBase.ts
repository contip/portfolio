import deepMerge from '@/utilities/deepMerge'
import { PayloadAiPluginLexicalEditorFeature } from '@ai-stack/payloadcms'
import {
  BlocksFeature,
  BoldFeature,
  BlockquoteFeature,
  OrderedListFeature,
  UnorderedListFeature,
  HeadingFeature,
  IndentFeature,
  InlineCodeFeature,
  ItalicFeature,
  StrikethroughFeature,
  UnderlineFeature,
  SubscriptFeature,
  SuperscriptFeature,
  FixedToolbarFeature,
  lexicalEditor,
  LexicalEditorProps,
  LinkFeature,
  LinkFields,
  UploadFeature,
  TextStateFeature,
} from '@payloadcms/richtext-lexical'
import { ColorPickerFeature } from '@/lexical/ColorPickerFeature'
import { defaultRichTextInlineBlocks } from '@/fields/richTextInlineBlocks'
import type {
  Block,
  RichTextField,
  RichTextFieldValidation,
  TextFieldSingleValidation,
} from 'payload'

export type RichTextOverrides = Partial<RichTextField> & { admin?: LexicalEditorProps }

export type RichTextAdditions = {
  blocks?: Block[]
  inlineBlocks?: Block[]
  disableBlocks?: boolean
}

type RichText = (overrides?: RichTextOverrides, additions?: RichTextAdditions) => RichTextField

const richTextBase: RichText = (
  overrides,
  additions = {
    blocks: [],
    inlineBlocks: defaultRichTextInlineBlocks,
    disableBlocks: false,
  },
) => {
  const { blocks = [], inlineBlocks = defaultRichTextInlineBlocks, disableBlocks = false } =
    additions

  const lexicalOptions: LexicalEditorProps = {
    features: ({ defaultFeatures }) => {
      const features = [
        BoldFeature(),
        ItalicFeature(),
        HeadingFeature(),
        UnderlineFeature(),
        StrikethroughFeature(),
        SubscriptFeature(),
        SuperscriptFeature(),
        InlineCodeFeature(),
        BlockquoteFeature(),
        OrderedListFeature(),
        UnorderedListFeature(),
        IndentFeature(),
        ColorPickerFeature(),
        TextStateFeature({
          state: {
            underline: {
              solid: {
                label: 'Solid',
                css: { 'text-decoration': 'underline', 'text-underline-offset': '4px' },
              },
              'yellow-dashed': {
                label: 'Yellow Dashed',
                css: {
                  'text-decoration': 'underline dashed',
                  'text-decoration-color': 'light-dark(#EAB308,yellow)',
                  'text-underline-offset': '4px',
                },
              },
            },
          },
        }),
        LinkFeature({
          enabledCollections: ['categories', 'posts', 'pages', 'services', 'caseStudies'],
          fields: ({ defaultFields }) => {
            const defaultFieldsWithoutUrl = defaultFields.filter((field) => {
              if ('name' in field && field.name === 'url') return false
              return true
            })

            return [
              ...defaultFieldsWithoutUrl,
              {
                name: 'url',
                type: 'text',
                admin: {
                  condition: (_data, siblingData) => siblingData?.linkType !== 'internal',
                },
                label: ({ t }) => t('fields:enterURL'),
                required: true,
                validate: ((value, options) => {
                  if ((options?.siblingData as LinkFields)?.linkType === 'internal') {
                    return true // no validation needed, as no url should exist for internal links
                  }
                  return value ? true : 'URL is required'
                }) as TextFieldSingleValidation,
              },
            ]
          },
        }),
        UploadFeature({
          collections: {
            media: {
              fields: [],
            },
          },
        }),
        FixedToolbarFeature(),
        PayloadAiPluginLexicalEditorFeature(),
        ...defaultFeatures,
      ]

      if (!disableBlocks) {
        features.push(
          BlocksFeature({
            blocks,
            inlineBlocks,
          }),
        )
      }

      return features
    },
    lexical: overrides?.admin?.lexical || undefined,
  }

  const fieldOverrides: Omit<Partial<RichTextField>, 'admin'> & {
    validate: RichTextFieldValidation
  } = {
    ...(overrides || {}),
    validate: (value) => {
      // Define a regex pattern for illegal characters, e.g., non-printable characters
      const illegalCharactersPattern = /[\x00-\x08\x0E-\x1F\x7F]/ // Control characters that might not be suitable for text fields

      // Check if the text contains any illegal characters
      if (illegalCharactersPattern.test(JSON.stringify(value))) {
        return 'The text contains illegal characters.'
      }

      // If no illegal characters, return true
      return true
    },
  }

  return deepMerge<RichTextField, Partial<RichTextField>>(
    {
      name: 'richText',
      type: 'richText',
      required: true,
      editor: lexicalEditor(lexicalOptions),
    },
    fieldOverrides,
  )
}

export default richTextBase
