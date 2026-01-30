'use client'

import { useEffect, useRef } from 'react'
import type { AuditPageData, DocMetaItem } from '@/types/audit'

const HEADER_LINE_COLOR = '#ff8500'

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
  const docMeta = data.docMeta

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
          label: 'Nouveau champ',
          value: '',
        },
      ],
    })
  }

  const companyNameRef = useRef<HTMLTextAreaElement>(null)
  useEffect(() => {
    const ta = companyNameRef.current
    if (!ta) return
    ta.style.height = 'auto'
    ta.style.height = Math.max(ta.scrollHeight, 28) + 'px'
  }, [data.companyName])

  return (
    <header
      className="mb-8 flex flex-wrap items-center justify-between gap-6 pb-6"
      style={{ borderBottom: `2px solid ${HEADER_LINE_COLOR}` }}
    >
      <div className="flex items-center gap-4">
        {/* Permanent logo from project */}
        <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white p-1 print:border print:border-slate-200">
          <img
            src="/logo-sonatrach-white-text.svg"
            alt="Logo Sonatrach"
            className="h-full w-full object-contain"
          />
        </div>

        <div className="min-w-0 max-w-[280px]">
          <h1 className="text-lg font-bold uppercase tracking-wide text-slate-900">
            {readOnly ? (
              <span className="break-words">{data.companyName}</span>
            ) : (
              <textarea
                ref={companyNameRef}
                value={data.companyName}
                onChange={(e) => onChange({ companyName: e.target.value })}
                rows={1}
                className="w-full min-h-[1.5rem] resize-none overflow-hidden rounded border-0 bg-transparent font-bold uppercase tracking-wide text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-[#ff8500] focus:ring-inset"
                placeholder="Nom de l'entreprise"
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
                className="w-full min-w-[200px] rounded border-0 bg-transparent text-sm text-slate-600 placeholder:text-slate-400 focus:ring-2 focus:ring-[#ff8500] focus:ring-inset"
                placeholder="Sous-titre"
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
              className="w-full min-w-[140px] rounded border-0 bg-transparent text-right text-xl font-extrabold text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-[#ff8500] focus:ring-inset"
              placeholder="AUDIT INTERNE"
            />
          )}
        </div>

        {/* Metadata as table: left = title, right = value */}
        <div className="mt-2 overflow-hidden rounded border border-slate-300 bg-white text-sm text-slate-600">
          <table className="w-full min-w-[220px] table-fixed border-collapse">
            <tbody>
              {docMeta.map((item, index) => (
                <tr key={item.id} className="border-b border-slate-200 last:border-b-0">
                  <td className="w-[45%] border-r border-slate-200 py-1.5 pl-2 pr-2 font-medium text-slate-800">
                    {readOnly ? (
                      item.label
                    ) : (
                      <input
                        type="text"
                        value={item.label}
                        onChange={(e) => updateDocMetaItem(item.id, { label: e.target.value })}
                        className="w-full rounded border-0 bg-transparent text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-[#ff8500] focus:ring-inset"
                        placeholder="Libellé"
                      />
                    )}
                  </td>
                  <td className="w-[55%] py-1.5 pl-2 pr-2">
                    {readOnly ? (
                      item.value
                    ) : (
                      <div className="flex items-center gap-1">
                        <input
                          type="text"
                          value={item.value}
                          onChange={(e) => updateDocMetaItem(item.id, { value: e.target.value })}
                          className="min-w-0 flex-1 rounded border-0 bg-transparent focus:ring-2 focus:ring-[#ff8500] focus:ring-inset"
                          placeholder="Valeur"
                        />
                        {!readOnly && (
                          <div className="no-print flex shrink-0 items-center gap-0.5" aria-hidden>
                            <button
                              type="button"
                              onClick={() => moveDocMetaItem(index, 'up')}
                              disabled={index === 0}
                              className="rounded p-0.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 disabled:opacity-30"
                              title="Monter"
                              aria-label="Monter"
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
                              title="Descendre"
                              aria-label="Descendre"
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
                                title="Supprimer le champ"
                                aria-label="Supprimer"
                              >
                                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!readOnly && (
            <div className="no-print border-t border-slate-200 px-2 py-1">
              <button
                type="button"
                onClick={addDocMetaItem}
                className="text-xs text-[#ff8500] hover:underline"
              >
                + Ajouter un champ
              </button>
            </div>
          )}
        </div>

        <div className="mt-2 text-xs font-medium text-slate-500">
          Page {pageIndex + 1} sur {totalPages}
        </div>
      </div>
    </header>
  )
}
