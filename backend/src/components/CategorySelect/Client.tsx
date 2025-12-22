'use client'

import { useAllFormFields, useForm } from '@payloadcms/ui'
import { useMemo, useState } from 'react'
import type { CategorySelectClientProps, CategorySelectValue, SelectItem } from './types'

type FlatOption = {
  label: string
  value: string | number
}

const flattenCategories = (
  items: SelectItem[],
  depth = 0,
  result: FlatOption[] = [],
  currentId?: string | number,
): FlatOption[] => {
  items.forEach((item) => {
    if (String(item.value) !== String(currentId)) {
      const prefix = depth > 0 ? `${'--'.repeat(depth)} ` : ''
      const label = item.fullTitle || item.label
      result.push({ label: `${prefix}${label}`, value: item.value })
    }

    if (item.children?.length) {
      flattenCategories(item.children, depth + 1, result, currentId)
    }
  })

  return result
}

const CategorySelectClient = ({
  path,
  categories,
  initialData,
  collectionSlug,
  currentId,
}: CategorySelectClientProps) => {
  const initialValue =
    typeof initialData === 'string' || typeof initialData === 'number' ? initialData : null
  const [selected, setSelected] = useState<CategorySelectValue | null>(initialValue)
  const [_, dispatchFields] = useAllFormFields()
  const { setModified } = useForm()

  const options = useMemo(
    () => flattenCategories(categories, 0, [], currentId),
    [categories, currentId],
  )
  const optionValueType = typeof options[0]?.value

  const parseValue = (value: string) => {
    if (optionValueType === 'number') {
      const parsed = Number(value)
      return Number.isNaN(parsed) ? value : parsed
    }

    return value
  }

  const handleSetValue = (nextValue: string | number | null) => {
    dispatchFields({
      type: 'UPDATE',
      path,
      initialValue: nextValue,
      value: nextValue,
      valid: true,
    })
    setModified(true)
    setSelected(nextValue)
  }

  return (
    <div style={{ display: 'grid', gap: 8 }}>
      <label style={{ fontSize: 12, opacity: 0.7 }}>
        {collectionSlug === 'categories' ? 'Parent Category' : 'Category'}
      </label>
      <select
        value={selected ?? ''}
        onChange={(event) => {
          const nextValue = event.target.value
          handleSetValue(nextValue ? parseValue(nextValue) : null)
        }}
        style={{
          padding: '6px 10px',
          borderRadius: 6,
          border: '1px solid #e5e7eb',
          background: '#ffffff',
        }}
      >
        <option value="">No Selection</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default CategorySelectClient
