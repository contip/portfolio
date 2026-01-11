'use client'

import { useCallback, useEffect, useState } from 'react'
import { useLexicalComposerContext } from '@payloadcms/richtext-lexical/lexical/react/LexicalComposerContext'
import {
  $getNodeByKey,
  $getSelection,
  $isRangeSelection,
  $getState,
  $setState,
  createState,
  COMMAND_PRIORITY_EDITOR,
  TextNode,
} from '@payloadcms/richtext-lexical/lexical'
import { $forEachSelectedTextNode } from '@payloadcms/richtext-lexical/lexical/selection'
import type { PluginComponent } from '@payloadcms/richtext-lexical'
import {
  OPEN_COLOR_PICKER_COMMAND,
  APPLY_COLOR_COMMAND,
  type ColorPickerType,
  type ApplyColorPayload,
} from './commands'
import { ColorPickerDrawer } from './ColorPickerDrawer'
import rawColors from '@/config/colors.json'

// Create state configs for color and background - these store data in node.$
const colorStateConfig = createState('color', {
  parse: (value: unknown) => (typeof value === 'string' ? value : undefined),
})

const backgroundStateConfig = createState('background', {
  parse: (value: unknown) => (typeof value === 'string' ? value : undefined),
})

type Color = { title: string; hex: string }
type RawCategory = { name: string; colors: Color[] }

const colorHexByTitle = new Map<string, string>(
  (rawColors as RawCategory[]).flatMap((category) =>
    category.colors.map((color) => [color.title, color.hex] as const),
  ),
)

const resolveColorValue = (value?: string | null) => {
  if (!value) return null

  if (value.startsWith('text-') || value.startsWith('bg-')) {
    const title = value.replace(/^text-|^bg-/, '').split('/')[0]
    return colorHexByTitle.get(title) || null
  }

  return value
}

export const ColorPickerPlugin: PluginComponent = () => {
  const [editor] = useLexicalComposerContext()
  const [isOpen, setIsOpen] = useState(false)
  const [colorType, setColorType] = useState<ColorPickerType>('text')

  const applyColor = useCallback(
    (payload: ApplyColorPayload) => {
      editor.update(() => {
        const selection = $getSelection()
        if (!$isRangeSelection(selection)) {
          return
        }

        const stateConfig = payload.type === 'text' ? colorStateConfig : backgroundStateConfig
        const stateValue = payload.color || undefined

        // Apply state to each selected text node
        $forEachSelectedTextNode((textNode) => {
          $setState(textNode, stateConfig, stateValue)
        })
      })
    },
    [editor],
  )

  // Mutation listener to sync node state to DOM styles
  useEffect(() => {
    const unregisterMutationListener = editor.registerMutationListener(
      TextNode,
      (mutatedNodes) => {
        editor.getEditorState().read(() => {
          for (const [nodeKey, mutation] of mutatedNodes) {
            if (mutation === 'destroyed') {
              continue
            }

            const node = $getNodeByKey(nodeKey)
            const dom = editor.getElementByKey(nodeKey)

            if (!node || !dom || !(node instanceof TextNode)) {
              continue
            }

            // Get color and background from state and apply to DOM
            const color = $getState(node, colorStateConfig)
            const background = $getState(node, backgroundStateConfig)

            if (color) {
              dom.style.color = resolveColorValue(color) || ''
            } else {
              dom.style.color = ''
            }

            if (background) {
              dom.style.backgroundColor = resolveColorValue(background) || ''
            } else {
              dom.style.backgroundColor = ''
            }
          }
        })
      },
    )

    return () => {
      unregisterMutationListener()
    }
  }, [editor])

  useEffect(() => {
    const unregisterOpen = editor.registerCommand(
      OPEN_COLOR_PICKER_COMMAND,
      (payload) => {
        setColorType(payload.type)
        setIsOpen(true)
        return true
      },
      COMMAND_PRIORITY_EDITOR,
    )

    const unregisterApply = editor.registerCommand(
      APPLY_COLOR_COMMAND,
      (payload) => {
        applyColor(payload)
        return true
      },
      COMMAND_PRIORITY_EDITOR,
    )

    return () => {
      unregisterOpen()
      unregisterApply()
    }
  }, [editor, applyColor])

  const handleColorSelect = useCallback(
    (color: string | null) => {
      applyColor({ type: colorType, color })
      setIsOpen(false)
    },
    [colorType, applyColor],
  )

  const handleClose = useCallback(() => {
    setIsOpen(false)
  }, [])

  return (
    <ColorPickerDrawer
      isOpen={isOpen}
      colorType={colorType}
      onColorSelect={handleColorSelect}
      onClose={handleClose}
    />
  )
}
