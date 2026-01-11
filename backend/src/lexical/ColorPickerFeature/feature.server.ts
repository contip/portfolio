import { createServerFeature } from '@payloadcms/richtext-lexical'

export const ColorPickerFeature = createServerFeature({
  feature: {
    ClientFeature: '@/lexical/ColorPickerFeature/feature.client#ColorPickerClientFeature',
    i18n: {
      en: {
        textColor: 'Text Color',
        highlightColor: 'Highlight Color',
        clearColor: 'Clear Color',
        selectTextColor: 'Select text color',
        selectHighlightColor: 'Select highlight color',
      },
    },
  },
  key: 'colorPicker',
})
