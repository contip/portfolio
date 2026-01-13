'use client'

import React from 'react'
import type { LexicalInlineBlockClientProps } from '@payloadcms/richtext-lexical'
import {
  InlineBlockContainer,
  InlineBlockEditButton,
  InlineBlockRemoveButton,
} from '@payloadcms/richtext-lexical/client'
import { useFormFields } from '@payloadcms/ui'
import rawColors from '@/config/colors.json'

type IconValue =
  | {
      id?: number | string
      title?: string | null
      svg?: string | null
      value?: number | string
    }
  | {
      relationTo?: string
      value?: number | string | { id?: number | string; title?: string | null; svg?: string | null }
    }
  | number
  | string
  | null

type Color = { title: string; hex: string }
type RawCategory = { name: string; colors: Color[] }

const colorHexByTitle = new Map<string, string>(
  (rawColors as RawCategory[]).flatMap((category) =>
    category.colors.map((color) => [color.title, color.hex] as const),
  ),
)

const resolveThemeColor = (value?: string | null) => {
  if (!value) return null

  if (value.startsWith('text-') || value.startsWith('bg-')) {
    const title = value.replace(/^text-|^bg-/, '').split('/')[0]
    return colorHexByTitle.get(title) || null
  }

  return value
}

const normalizeSvg = (svg: string) => {
  const withRootStyle = /<svg[^>]*\sstyle=/.test(svg)
    ? svg.replace(
        /<svg([^>]*\sstyle=["'])([^"']*)(["'])/i,
        (_match, before, styles, after) =>
          `<svg${before}${styles}; color: currentColor; fill: currentColor; stroke: currentColor;${after}`,
      )
    : svg.replace(
        /<svg/i,
        '<svg style="color: currentColor; fill: currentColor; stroke: currentColor;"',
      )

  return withRootStyle.replace(
    /\s(fill|stroke)=(['"])(?!none|currentColor)[^'"]*\2/gi,
    ' $1="currentColor"',
  )
}

const getIdValue = (value: unknown) =>
  typeof value === 'string' || typeof value === 'number' ? String(value) : null

const getIconMeta = (value: IconValue) => {
  if (!value) {
    return { id: null, title: null, svg: null }
  }

  if (typeof value === 'object') {
    const directId = 'id' in value ? getIdValue(value.id) : null
    const directTitle = 'title' in value ? value.title ?? null : null
    const directSvg = 'svg' in value ? value.svg ?? null : null
    const nested = 'value' in value ? value.value : null
    let nestedId = getIdValue(nested)
    let nestedTitle: string | null = null
    let nestedSvg: string | null = null

    if (nested && typeof nested === 'object') {
      const nestedObj = nested as { id?: unknown; title?: string | null; svg?: string | null }
      if (!nestedId) {
        nestedId = getIdValue(nestedObj.id)
      }
      nestedTitle = nestedObj.title ?? null
      nestedSvg = nestedObj.svg ?? null
    }

    const id = directId ?? nestedId

    return {
      id,
      title: directTitle ?? nestedTitle,
      svg: directSvg ?? nestedSvg,
    }
  }

  return {
    id: String(value),
    title: null,
    svg: null,
  }
}

const RichTextInlineIcon: React.FC<LexicalInlineBlockClientProps> = () => {
  const iconField = useFormFields(([fields]) => fields.icon)
  const iconValue = (iconField?.value ?? null) as IconValue
  const textColorField = useFormFields(([fields]) => fields.textColor)
  const backgroundColorField = useFormFields(([fields]) => fields.backgroundColor)
  const textColor = (textColorField?.value ?? null) as string | null
  const backgroundColor = (backgroundColorField?.value ?? null) as string | null
  const [iconSvg, setIconSvg] = React.useState<string | null>(null)
  const [iconTitle, setIconTitle] = React.useState<string | null>(null)

  React.useEffect(() => {
    const { id, title, svg } = getIconMeta(iconValue)

    if (svg) {
      setIconSvg(normalizeSvg(svg))
      setIconTitle(title)
      return
    }

    if (!id) {
      setIconSvg(null)
      setIconTitle(null)
      return
    }

    const controller = new AbortController()
    let isActive = true

    const loadIcon = async () => {
      try {
        const response = await fetch(`/api/icons/${id}?depth=0`, {
          signal: controller.signal,
        })

        if (!response.ok) {
          return
        }

        const data = (await response.json()) as {
          svg?: string
          title?: string
        }

        if (!isActive) {
          return
        }

        setIconSvg(data.svg ? normalizeSvg(data.svg) : null)
        setIconTitle(data.title ?? null)
      } catch (error) {
        if (controller.signal.aborted) {
          return
        }
        setIconSvg(null)
        setIconTitle(null)
      }
    }

    void loadIcon()

    return () => {
      isActive = false
      controller.abort()
    }
  }, [iconValue])

  const resolvedTextColor = resolveThemeColor(textColor)
  const resolvedBackgroundColor = resolveThemeColor(backgroundColor)
  const iconStyle: React.CSSProperties = {
    color: resolvedTextColor ?? undefined,
    backgroundColor: resolvedBackgroundColor ?? undefined,
    borderRadius: resolvedBackgroundColor ? '0.2em' : undefined,
    padding: resolvedBackgroundColor ? '0.15em' : undefined,
  }

  return (
    <InlineBlockContainer>
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
        }}
      >
        <span
          aria-label={iconTitle ?? 'Icon'}
          role="img"
          title={iconTitle ?? undefined}
          style={{
            ...iconStyle,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '1em',
            width: '1em',
            overflow: 'hidden',
            lineHeight: 1,
          }}
          {...(iconSvg
            ? { dangerouslySetInnerHTML: { __html: iconSvg } }
            : { children: 'Icon' })}
        />
        <InlineBlockEditButton />
        <InlineBlockRemoveButton />
      </span>
    </InlineBlockContainer>
  )
}

export default RichTextInlineIcon
