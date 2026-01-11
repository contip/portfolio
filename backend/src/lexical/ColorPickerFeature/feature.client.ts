'use client'

import { createClientFeature, toolbarFeatureButtonsGroupWithItems } from '@payloadcms/richtext-lexical/client'
import { ColorPickerPlugin } from './plugin'
import { TextColorIcon, HighlightColorIcon } from './icons'
import { OPEN_COLOR_PICKER_COMMAND } from './commands'

export const ColorPickerClientFeature = createClientFeature({
  plugins: [
    {
      Component: ColorPickerPlugin,
      position: 'normal',
    },
  ],
  toolbarFixed: {
    groups: [
      toolbarFeatureButtonsGroupWithItems([
        {
          ChildComponent: TextColorIcon,
          key: 'textColor',
          label: () => 'Text Color',
          onSelect: ({ editor }) => {
            editor.dispatchCommand(OPEN_COLOR_PICKER_COMMAND, { type: 'text' })
          },
        },
        {
          ChildComponent: HighlightColorIcon,
          key: 'highlightColor',
          label: () => 'Highlight Color',
          onSelect: ({ editor }) => {
            editor.dispatchCommand(OPEN_COLOR_PICKER_COMMAND, { type: 'highlight' })
          },
        },
      ]),
    ],
  },
  toolbarInline: {
    groups: [
      toolbarFeatureButtonsGroupWithItems([
        {
          ChildComponent: TextColorIcon,
          key: 'textColor',
          label: () => 'Text Color',
          onSelect: ({ editor }) => {
            editor.dispatchCommand(OPEN_COLOR_PICKER_COMMAND, { type: 'text' })
          },
        },
        {
          ChildComponent: HighlightColorIcon,
          key: 'highlightColor',
          label: () => 'Highlight Color',
          onSelect: ({ editor }) => {
            editor.dispatchCommand(OPEN_COLOR_PICKER_COMMAND, { type: 'highlight' })
          },
        },
      ]),
    ],
  },
})
