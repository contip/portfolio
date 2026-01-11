'use client'

import { useEffect, useMemo, useState } from 'react'
import { Drawer, useModal } from '@payloadcms/ui'
import rawColors from '@/config/colors.json'
import type { ColorPickerType } from './commands'

type Color = { title: string; hex: string }

type RawCategory = {
  name: string
  colors: Color[]
}

type ColorCategory = {
  title: string
  colors: Color[]
}

export const DRAWER_SLUG = 'color-picker-drawer'

interface ColorPickerDrawerProps {
  isOpen: boolean
  colorType: ColorPickerType
  onColorSelect: (color: string | null) => void
  onClose: () => void
}

const formatCategories = (categories: RawCategory[]): ColorCategory[] =>
  categories.map((category) => ({
    title: category.name,
    colors: category.colors,
  }))

export const ColorPickerDrawer = ({
  isOpen,
  colorType,
  onColorSelect,
  onClose,
}: ColorPickerDrawerProps) => {
  const { openModal, closeModal, isModalOpen } = useModal()
  const [showMore, setShowMore] = useState(false)
  const [selectedValue, setSelectedValue] = useState<string | null>(null)

  // Sync isOpen prop with modal state
  useEffect(() => {
    if (isOpen && !isModalOpen(DRAWER_SLUG)) {
      openModal(DRAWER_SLUG)
    } else if (!isOpen && isModalOpen(DRAWER_SLUG)) {
      closeModal(DRAWER_SLUG)
    }
  }, [isOpen, openModal, closeModal, isModalOpen])

  const categories = useMemo(() => formatCategories(rawColors as RawCategory[]), [])
  const flatColors = useMemo(
    () => categories.flatMap((category) => category.colors),
    [categories],
  )

  const primaryColors = categories[0]?.colors ?? []
  const primaryTitle = categories[0]?.title ?? 'Colors'
  const extraCategories = categories.slice(1)

  const prefix = colorType === 'text' ? 'text-' : 'bg-'
  const selectedTitle = selectedValue?.replace(/^text-|^bg-/, '')
  const selectedColor =
    (selectedTitle && flatColors.find((c) => c.title === selectedTitle)) ||
    (selectedValue && flatColors.find((c) => c.hex === selectedValue))

  const handleColorClick = (color: Color) => {
    const value = `${prefix}${color.title}`
    setSelectedValue(value)
    onColorSelect(value)
  }

  const handleClear = () => {
    setSelectedValue(null)
    onColorSelect(null)
  }

  const handleClose = () => {
    closeModal(DRAWER_SLUG)
    onClose()
  }

  const Swatch = ({ color }: { color: Color }) => {
    const isSelected = selectedTitle === color.title

    return (
      <button
        type="button"
        onClick={() => handleColorClick(color)}
        aria-label={`Set color to ${color.title}`}
        style={{
          width: 36,
          height: 36,
          borderRadius: 9999,
          border: `2px solid ${isSelected ? '#111827' : 'transparent'}`,
          background: color.hex,
          cursor: 'pointer',
          flexShrink: 0,
        }}
      />
    )
  }

  const title = colorType === 'text' ? 'Select Text Color' : 'Select Highlight Color'

  return (
    <Drawer slug={DRAWER_SLUG} title={title}>
      <div style={{ padding: 16, display: 'grid', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 9999,
              border: '2px solid #e5e7eb',
              background: selectedColor?.hex || '#ffffff',
            }}
          />
          <div>
            <div style={{ fontSize: 12, opacity: 0.7 }}>Selected</div>
            <div style={{ fontSize: 14 }}>
              {selectedColor?.title || (selectedValue ? 'Custom' : 'None')}
            </div>
          </div>
        </div>

        <p style={{ fontSize: 12, opacity: 0.7, margin: 0 }}>
          Theme colors swap with light/dark mode. Palette colors stay fixed.
        </p>

        <button
          type="button"
          onClick={handleClear}
          style={{
            width: 'fit-content',
            padding: '6px 12px',
            borderRadius: 6,
            border: '1px solid #e5e7eb',
            background: '#ffffff',
            cursor: 'pointer',
            fontSize: 14,
          }}
        >
          Clear Color
        </button>

        <div>
          <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8, opacity: 0.7 }}>
            {primaryTitle}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {primaryColors.map((color) => (
              <Swatch key={color.title} color={color} />
            ))}
          </div>
        </div>

        {extraCategories.length > 0 && (
          <div style={{ display: 'grid', gap: 12 }}>
            <button
              type="button"
              onClick={() => setShowMore((prev) => !prev)}
              style={{
                width: 'fit-content',
                padding: '6px 12px',
                borderRadius: 6,
                border: '1px solid #e5e7eb',
                background: '#f9fafb',
                cursor: 'pointer',
                fontSize: 14,
              }}
            >
              {showMore ? 'Hide' : 'Show'} More Colors
            </button>

            {showMore && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                  gap: 16,
                  maxHeight: 400,
                  overflow: 'auto',
                  paddingRight: 4,
                }}
              >
                {extraCategories.map((category) => (
                  <div key={category.title}>
                    <div
                      style={{ fontSize: 12, fontWeight: 600, marginBottom: 8, opacity: 0.7 }}
                    >
                      {category.title}
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
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
    </Drawer>
  )
}
