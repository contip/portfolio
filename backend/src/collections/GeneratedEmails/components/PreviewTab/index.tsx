'use client'

import { useField } from '@payloadcms/ui'
import type { CSSProperties } from 'react'

const controlButtonStyle: CSSProperties = {
  cursor: 'pointer',
  borderRadius: 8,
  border: '1px solid rgba(15, 23, 42, 0.24)',
  background: '#0f172a',
  color: '#ffffff',
  fontSize: 13,
  fontWeight: 600,
  lineHeight: 1.2,
  padding: '10px 14px',
}

const PreviewTab = () => {
  const { value: html } = useField<string>({ path: 'html' })
  const { value: status } = useField<string>({ path: 'status' })
  const { value: subject } = useField<string>({ path: 'subject' })

  const openPreview = () => {
    const previewWindow = window.open('', '_blank', 'noopener,noreferrer')
    if (!previewWindow) return

    previewWindow.document.open()
    previewWindow.document.write(
      html ||
        '<!doctype html><html><body><p style="font-family:sans-serif">No email HTML found.</p></body></html>',
    )
    previewWindow.document.close()
  }

  return (
    <div style={{ width: '100%', display: 'grid', gap: 12 }}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
        <button type="button" onClick={openPreview} disabled={!html} style={controlButtonStyle}>
          Open in New Window
        </button>
        <span style={{ fontSize: 12, opacity: 0.75 }}>
          {status ? `Status: ${status}` : ''} {subject ? `| ${subject}` : ''}
        </span>
      </div>
      <iframe
        title="Generated Email Preview"
        srcDoc={html || '<html><body><p>No preview available.</p></body></html>'}
        style={{
          width: '100%',
          minHeight: 520,
          border: '1px solid rgba(15, 23, 42, 0.2)',
          borderRadius: 10,
          backgroundColor: '#ffffff',
        }}
      />
    </div>
  )
}

export default PreviewTab
