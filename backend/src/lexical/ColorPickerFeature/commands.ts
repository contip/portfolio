import { createCommand } from '@payloadcms/richtext-lexical/lexical'
import type { LexicalCommand } from '@payloadcms/richtext-lexical/lexical'

export type ColorPickerType = 'text' | 'highlight'

export type OpenColorPickerPayload = {
  type: ColorPickerType
}

export type ApplyColorPayload = {
  type: ColorPickerType
  color: string | null
}

export const OPEN_COLOR_PICKER_COMMAND: LexicalCommand<OpenColorPickerPayload> =
  createCommand('OPEN_COLOR_PICKER_COMMAND')

export const APPLY_COLOR_COMMAND: LexicalCommand<ApplyColorPayload> =
  createCommand('APPLY_COLOR_COMMAND')
