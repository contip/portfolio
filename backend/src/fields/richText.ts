import deepMerge from '@/utilities/deepMerge'
import { PayloadAiPluginLexicalEditorFeature } from '@ai-stack/payloadcms'
import {
  BlocksFeature,
  BoldFeature,
  BlockquoteFeature,
  OrderedListFeature,
  UnorderedListFeature,
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
  defaultColors,
} from '@payloadcms/richtext-lexical'
import type {
  Block,
  RichTextField,
  RichTextFieldValidation,
  TextFieldSingleValidation,
} from 'payload'

type RichText = (
  overrides?: Partial<RichTextField> & { admin?: LexicalEditorProps },
  additions?: {
    blocks?: Block[]
    disableBlocks?: boolean
  },
) => RichTextField

const richText: RichText = (
  overrides,
  additions = {
    blocks: [],
    disableBlocks: false,
  },
) => {
  const lexicalOptions: LexicalEditorProps = {
    features: ({ defaultFeatures }) => {
      const features = [
        BoldFeature(),
        ItalicFeature(),
        UnderlineFeature(),
        StrikethroughFeature(),
        SubscriptFeature(),
        SuperscriptFeature(),
        InlineCodeFeature(),
        BlockquoteFeature(),
        OrderedListFeature(),
        UnorderedListFeature(),
        IndentFeature(),
        TextStateFeature({
          state: {
            color: {
              ...defaultColors.text,
              white: {
                label: 'White',
                css: { color: 'white' },
              },
              galaxy: {
                label: 'Galaxy',
                css: { background: 'linear-gradient(to right, #0000ff, #ff0000)', color: 'white' },
              },
              sunset: {
                label: 'Sunset',
                css: { background: 'linear-gradient(to top, #ff5f6d, #6a3093)' },
              },
            },
            background: {
              ...defaultColors.background,
              black: {
                label: 'Black',
                css: { background: 'black' },
              },
            },
            size: {
              large: {
                label: 'Large Text',
                css: {
                  'font-size': 'large',
                },
              },
              larger: {
                label: 'Larger Text',
                css: {
                  'font-size': 'larger',
                },
              },
            },
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
          enabledCollections: ['lizards'],
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

      if (!additions.disableBlocks) {
        features.push(
          BlocksFeature({
            blocks: [...(additions.blocks ?? [])],
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

export default richText
