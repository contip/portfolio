'use client'

import { useAllFormFields, useForm } from '@payloadcms/ui'
import { useMemo, useState } from 'react'

type SelectOption = {
  label: string
  value: string
}

type EmailWorkflowSelectClientProps = {
  path: string
  label: string
  description?: string
  initialValue?: string
  options: SelectOption[]
}

const wrapperStyle = {
  display: 'grid',
  gap: 8,
}

const labelStyle = {
  fontSize: 13,
  fontWeight: 600,
}

const helperStyle = {
  fontSize: 12,
  opacity: 0.7,
  lineHeight: 1.35,
}

const selectStyle = {
  padding: '8px 10px',
  borderRadius: 6,
  border: '1px solid #d1d5db',
  background: '#ffffff',
  fontSize: 14,
}

const EmailWorkflowSelectClient = ({
  path,
  label,
  description,
  initialValue,
  options,
}: EmailWorkflowSelectClientProps) => {
  const [selected, setSelected] = useState<string>(initialValue || '')
  const [_, dispatchFields] = useAllFormFields()
  const { setModified } = useForm()

  const sortedOptions = useMemo(() => {
    return [...options].sort((a, b) => a.label.localeCompare(b.label))
  }, [options])

  const handleSetValue = (nextValue: string) => {
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
    <div style={wrapperStyle}>
      <label style={labelStyle}>{label}</label>
      {description ? <span style={helperStyle}>{description}</span> : null}
      <select
        value={selected}
        onChange={(event) => {
          handleSetValue(event.target.value)
        }}
        style={selectStyle}
      >
        <option value="">Use Global Default</option>
        {sortedOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default EmailWorkflowSelectClient
