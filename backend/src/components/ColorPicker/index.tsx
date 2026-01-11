'use client'

import { useMemo, useState } from 'react'
import { useField } from '@payloadcms/ui'
import rawColors from '@/config/colors.json'

type Color = { title: string; hex: string }

type RawCategory = {
  name: string
  colors: Color[]
}

type ColorCategory = {
  title: string
  colors: Color[]
}

interface Props {
  path: string
  label?: string
  prefix?: string
}

const formatCategories = (categories: RawCategory[]): ColorCategory[] =>
  categories.map((category) => ({
    title: category.name,
    colors: category.colors,
  }))

/**
 * Converts a color title to a Tailwind class with the given prefix.
 * e.g., ("slate-500", "bg-") -> "bg-slate-500"
 * e.g., ("slate-500", "text-") -> "text-slate-500"
 */
const toTailwindClass = (title: string, prefix: string): string => `${prefix}${title}`

/**
 * Extracts the color name from a Tailwind class by removing the prefix.
 * e.g., ("bg-slate-500", "bg-") -> "slate-500"
 * e.g., ("text-slate-500", "text-") -> "slate-500"
 */
const fromTailwindClass = (className: string, prefix: string): string => {
  if (className.startsWith(prefix)) {
    return className.slice(prefix.length)
  }
  return className
}

export default function ColorPicker({ path, prefix = 'bg-' }: Props) {
  const { value, setValue } = useField<string>({ path })
  const [showMore, setShowMore] = useState(false)

  const categories = useMemo(() => formatCategories(rawColors as RawCategory[]), [])
  const flatColors = useMemo(
    () => categories.flatMap((category) => category.colors),
    [categories],
  )

  // Extract color name from stored Tailwind class (e.g., "bg-slate-500" -> "slate-500")
  const colorName = typeof value === 'string' ? fromTailwindClass(value, prefix) : ''
  const selected = flatColors.find((color) => color.title === colorName)

  const primaryColors = categories[0]?.colors ?? []
  const extraCategories = categories.slice(1)

  const choose = (color: Color) => {
    // Store as Tailwind class name (e.g., "bg-slate-500" or "text-slate-500")
    setValue(toTailwindClass(color.title, prefix))
  }

  const Swatch = ({ color }: { color: Color }) => {
    const isSelected = selected?.title === color.title

    return (
      <button
        type="button"
        onClick={() => choose(color)}
        aria-label={`Set color to ${color.title}`}
        style={{
          width: 40,
          height: 40,
          borderRadius: 9999,
          border: `2px solid ${isSelected ? '#111827' : 'transparent'}`,
          background: color.hex,
          cursor: 'pointer',
        }}
      />
    )
  }

  if (!categories.length) {
    return <p>Loading color palette...</p>
  }

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Swatch color={selected || { title: 'None', hex: '#ffffff' }} />
        <div>
          <div style={{ fontSize: 12, opacity: 0.7 }}>Selected</div>
          <div style={{ fontSize: 14 }}>
            {value ? `${value} (${selected?.title || 'custom'})` : 'None'}
          </div>
        </div>
      </div>

      {selected && (
        <button
          type="button"
          onClick={() => setValue('')}
          style={{
            width: 'fit-content',
            padding: '6px 10px',
            borderRadius: 6,
            border: '1px solid #e5e7eb',
            background: '#ffffff',
            cursor: 'pointer',
          }}
        >
          Clear Selected
        </button>
      )}

      <p style={{ fontSize: 12, opacity: 0.7, margin: 0 }}>
        Theme colors (background, primary, muted, etc.) follow light/dark mode. Palette colors stay
        fixed.
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {primaryColors.map((color) => (
          <Swatch key={color.title} color={color} />
        ))}
      </div>

      {extraCategories.length > 0 && (
        <div style={{ display: 'grid', gap: 12 }}>
          <button
            type="button"
            onClick={() => setShowMore((prev) => !prev)}
            style={{
              width: 'fit-content',
              padding: '6px 10px',
              borderRadius: 6,
              border: '1px solid #e5e7eb',
              background: '#f9fafb',
              cursor: 'pointer',
            }}
          >
            {showMore ? 'Hide' : 'Show'} More Colors
          </button>

          {showMore && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                gap: 12,
                maxHeight: 320,
                overflow: 'auto',
                paddingRight: 4,
              }}
            >
              {extraCategories.map((category) => (
                <div key={category.title}>
                  <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8, opacity: 0.7 }}>
                    {category.title}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {category.colors.map((color) => (
                      <Swatch key={color.title} color={color} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
