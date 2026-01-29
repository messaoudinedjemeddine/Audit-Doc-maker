'use client'

import { useRef } from 'react'
import type { AuditPageData, DocMetaItem } from '@/types/audit'

interface DocumentHeaderProps {
  data: AuditPageData
  onChange: (updates: Partial<AuditPageData>) => void
  pageIndex: number
  totalPages: number
  readOnly?: boolean
}

export function DocumentHeader({
  data,
  onChange,
  pageIndex,
  totalPages,
  readOnly,
}: DocumentHeaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const docMeta = data.docMeta

  const handleLogoClick = () => {
    if (readOnly) return
    fileInputRef.current?.click()
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => onChange({ logoDataUrl: reader.result as string })
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const updateDocMetaItem = (id: string, updates: Partial<DocMetaItem>) => {
    onChange({
      docMeta: docMeta.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      ),
    })
  }

  const moveDocMetaItem = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= docMeta.length) return
    const next = [...docMeta]
    ;[next[index], next[newIndex]] = [next[newIndex], next[index]]
    onChange({ docMeta: next })
  }

  const removeDocMetaItem = (id: string) => {
    if (docMeta.length <= 1) return
    onChange({ docMeta: docMeta.filter((item) => item.id !== id) })
  }

  const addDocMetaItem = () => {
    onChange({
      docMeta: [
        ...docMeta,
        {
          id: crypto.randomUUID(),
          label: 'New field',
          value: '',
        },
      ],
    })
  }

  return (
    <header className="mb-8 flex flex-wrap items-center justify-between gap-6 border-b-2 border-sky-600 pb-6">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden no-print"
        onChange={handleLogoChange}
      />

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={handleLogoClick}
          className="print:pointer-events-none print:border-0 print:bg-transparent print:shadow-none relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-sky-500 to-sky-700 text-white shadow-md transition hover:from-sky-600 hover:to-sky-800 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2"
          disabled={readOnly}
          title={readOnly ? undefined : 'Upload logo'}
        >
          {data.logoDataUrl ? (
            <img
              src={data.logoDataUrl}
              alt="Company logo"
              className="h-full w-full object-contain p-1 bg-white"
            />
          ) : (
            <svg
              className="h-7 w-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          )}
          {!readOnly && (
            <span className="no-print absolute inset-0 flex items-center justify-center bg-black/40 text-xs font-medium opacity-0 transition hover:opacity-100">
              Upload
            </span>
          )}
        </button>

        <div>
          <h1 className="text-lg font-bold uppercase tracking-wide text-slate-900">
            {readOnly ? (
              data.companyName
            ) : (
              <input
                type="text"
                value={data.companyName}
                onChange={(e) => onChange({ companyName: e.target.value })}
                className="w-full min-w-[200px] rounded border-0 bg-transparent font-bold uppercase tracking-wide text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-sky-300 focus:ring-inset"
                placeholder="Company name"
              />
            )}
          </h1>
          <h2 className="mt-0.5 text-sm text-slate-600">
            {readOnly ? (
              data.companySubtitle
            ) : (
              <input
                type="text"
                value={data.companySubtitle}
                onChange={(e) => onChange({ companySubtitle: e.target.value })}
                className="w-full min-w-[200px] rounded border-0 bg-transparent text-sm text-slate-600 placeholder:text-slate-400 focus:ring-2 focus:ring-sky-300 focus:ring-inset"
                placeholder="Subtitle"
              />
            )}
          </h2>
        </div>
      </div>

      <div className="text-right">
        <div className="text-xl font-extrabold text-slate-900">
          {readOnly ? (
            data.docTitle
          ) : (
            <input
              type="text"
              value={data.docTitle}
              onChange={(e) => onChange({ docTitle: e.target.value })}
              className="w-full min-w-[140px] rounded border-0 bg-transparent text-right text-xl font-extrabold text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-sky-300 focus:ring-inset"
              placeholder="INTERNAL AUDIT"
            />
          )}
        </div>

        {/* Doc credentials: editable labels + values, reorderable */}
        <div className="mt-1 space-y-0 text-sm text-slate-600">
          {docMeta.map((item, index) => (
            <div key={item.id} className="flex items-center justify-end gap-2 border-b border-slate-400 py-1.5 last:border-b-0">
              {!readOnly && (
                <div className="no-print flex shrink-0 items-center gap-0.5" aria-hidden>
                  <button
                    type="button"
                    onClick={() => moveDocMetaItem(index, 'up')}
                    disabled={index === 0}
                    className="rounded p-0.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 disabled:opacity-30"
                    title="Move up"
                    aria-label="Move up"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => moveDocMetaItem(index, 'down')}
                    disabled={index === docMeta.length - 1}
                    className="rounded p-0.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 disabled:opacity-30"
                    title="Move down"
                    aria-label="Move down"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {docMeta.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeDocMetaItem(item.id)}
                      className="rounded p-0.5 text-red-400 hover:bg-red-50 hover:text-red-600"
                      title="Remove field"
                      aria-label="Remove"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              )}
              <span className="flex items-center gap-1">
                {readOnly ? (
                  <>
                    <strong className="text-slate-800">{item.label}:</strong> {item.value}
                  </>
                ) : (
                  <>
                    <input
                      type="text"
                      value={item.label}
                      onChange={(e) => updateDocMetaItem(item.id, { label: e.target.value })}
                      className="min-w-[4rem] max-w-[8rem] rounded border-0 bg-transparent text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-sky-300 focus:ring-inset"
                      placeholder="Label"
                    />
                    <span>:</span>
                    <input
                      type="text"
                      value={item.value}
                      onChange={(e) => updateDocMetaItem(item.id, { value: e.target.value })}
                      className="min-w-[5rem] max-w-[12rem] rounded border-0 bg-transparent focus:ring-2 focus:ring-sky-300 focus:ring-inset"
                      placeholder="Value"
                    />
                  </>
                )}
              </span>
            </div>
          ))}
          {!readOnly && (
            <div className="no-print flex justify-end pt-0.5">
              <button
                type="button"
                onClick={addDocMetaItem}
                className="text-xs text-sky-600 hover:text-sky-700 hover:underline"
              >
                + Add field
              </button>
            </div>
          )}
        </div>

        {/* Pagination: Page X of Y — auto when pages are added */}
        <div className="mt-2 text-xs font-medium text-slate-500">
          Page {pageIndex + 1} of {totalPages}
        </div>
      </div>
    </header>
  )
}
