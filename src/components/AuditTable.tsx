'use client'

import type { AuditPageData, TableRow } from '@/types/audit'
import {
  createEmptyQuestionRow,
  createEmptySectionRow,
} from '@/types/audit'

interface AuditTableProps {
  data: AuditPageData
  onChange: (updates: Partial<AuditPageData>) => void
  readOnly?: boolean
}

function updateRow(rows: TableRow[], id: string, updates: Partial<TableRow>): TableRow[] {
  return rows.map((r) => (r.id === id ? { ...r, ...updates } : r))
}

function removeRow(rows: TableRow[], id: string): TableRow[] {
  return rows.filter((r) => r.id !== id)
}

function insertAfter(rows: TableRow[], afterId: string, newRow: TableRow): TableRow[] {
  const idx = rows.findIndex((r) => r.id === afterId)
  if (idx === -1) return [...rows, newRow]
  return [...rows.slice(0, idx + 1), newRow, ...rows.slice(idx + 1)]
}


function DottedLines({ lines = 3 }: { lines?: number }) {
  const dotLine = '·'.repeat(52)
  return (
    <div className="flex flex-col gap-1 py-1">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="text-slate-300 text-sm leading-loose tracking-widest select-none"
          style={{ fontFamily: 'monospace' }}
        >
          {dotLine}
        </div>
      ))}
    </div>
  )
}

export function AuditTable({ data, onChange, readOnly }: AuditTableProps) {
  const { rows, tableColumns, headerColor } = data
  const headerStyle = { backgroundColor: headerColor, borderColor: headerColor }

  const setRows = (newRows: TableRow[]) => onChange({ rows: newRows })

  const addSection = () => setRows([...rows, createEmptySectionRow()])
  const addQuestionAtEnd = () => setRows([...rows, createEmptyQuestionRow()])
  const addRowBelow = (afterId: string) =>
    setRows(insertAfter(rows, afterId, createEmptyQuestionRow()))
  const deleteRow = (id: string) => {
    if (readOnly) return
    if (typeof window !== 'undefined' && window.confirm('Delete this row?')) {
      setRows(removeRow(rows, id))
    }
  }

  const updateQuestion = (
    id: string,
    updates: Partial<Extract<TableRow, { type: 'question' }>>
  ) => {
    setRows(updateRow(rows, id, updates) as TableRow[])
  }

  const updateSection = (id: string, title: string) => {
    setRows(updateRow(rows, id, { title }) as TableRow[])
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full table-fixed border-collapse">
        <thead>
          <tr style={headerStyle}>
            <th className="w-[48%] border px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-white" style={headerStyle}>
              {readOnly ? (
                tableColumns.exigences
              ) : (
                <input
                  type="text"
                  value={tableColumns.exigences}
                  onChange={(e) =>
                    onChange({
                      tableColumns: { ...tableColumns, exigences: e.target.value },
                    })
                  }
                  className="w-full rounded border-0 bg-transparent text-white placeholder:text-white/70 focus:ring-2 focus:ring-white focus:ring-inset"
                />
              )}
            </th>
            <th className="w-[10%] border px-2 py-3 text-center text-xs font-semibold uppercase tracking-wide text-white" style={headerStyle}>
              {readOnly ? (
                tableColumns.yes
              ) : (
                <input
                  type="text"
                  value={tableColumns.yes}
                  onChange={(e) =>
                    onChange({
                      tableColumns: { ...tableColumns, yes: e.target.value },
                    })
                  }
                  className="w-full rounded border-0 bg-transparent text-center text-white placeholder:text-white/70 focus:ring-2 focus:ring-white focus:ring-inset"
                />
              )}
            </th>
            <th className="w-[8%] border px-2 py-3 text-center text-xs font-semibold uppercase tracking-wide text-white" style={headerStyle}>
              {readOnly ? (
                tableColumns.no
              ) : (
                <input
                  type="text"
                  value={tableColumns.no}
                  onChange={(e) =>
                    onChange({
                      tableColumns: { ...tableColumns, no: e.target.value },
                    })
                  }
                  className="w-full rounded border-0 bg-transparent text-center text-white placeholder:text-white/70 focus:ring-2 focus:ring-white focus:ring-inset"
                />
              )}
            </th>
            <th className="w-[34%] border px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-white" style={headerStyle}>
              {readOnly ? (
                tableColumns.observation
              ) : (
                <input
                  type="text"
                  value={tableColumns.observation}
                  onChange={(e) =>
                    onChange({
                      tableColumns: { ...tableColumns, observation: e.target.value },
                    })
                  }
                  className="w-full rounded border-0 bg-transparent text-white placeholder:text-white/70 focus:ring-2 focus:ring-white focus:ring-inset"
                />
              )}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) =>
            row.type === 'section' ? (
              <tr key={row.id} className="group border-b border-slate-200 bg-slate-50">
                <td
                  colSpan={4}
                  className="border-r border-b border-slate-200 px-3 py-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    {readOnly ? (
                      <span className="font-bold text-slate-900">{row.title}</span>
                    ) : (
                      <input
                        type="text"
                        value={row.title}
                        onChange={(e) => updateSection(row.id, e.target.value)}
                        className="min-w-0 flex-1 rounded border-0 bg-transparent font-bold text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-sky-300 focus:ring-inset"
                        placeholder="Section title"
                      />
                    )}
                    {!readOnly && (
                      <div className="no-print flex shrink-0 gap-1 opacity-0 transition group-hover:opacity-100">
                        <button
                          type="button"
                          onClick={() => addRowBelow(row.id)}
                          className="flex h-7 w-7 items-center justify-center rounded-full bg-sky-100 text-sky-600 hover:bg-sky-200"
                          title="Add row below"
                        >
                          +
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteRow(row.id)}
                          className="flex h-7 w-7 items-center justify-center rounded-full bg-red-100 text-red-600 hover:bg-red-200"
                          title="Delete section"
                        >
                          ×
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              <tr
                key={row.id}
                className="group border-b border-slate-200 transition hover:bg-slate-50/50"
              >
                <td className="border border-slate-200 px-3 py-2 align-top">
                  <div className="space-y-1">
                    {readOnly ? (
                      <>
                        <div className="font-semibold text-slate-900">{row.title}</div>
                        <div className="text-xs text-slate-600">{row.description}</div>
                      </>
                    ) : (
                      <>
                        <input
                          type="text"
                          value={row.title}
                          onChange={(e) => updateQuestion(row.id, { title: e.target.value })}
                          className="w-full rounded border-0 bg-transparent text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-sky-300 focus:ring-inset"
                          placeholder="Item title"
                        />
                        <input
                          type="text"
                          value={row.description}
                          onChange={(e) =>
                            updateQuestion(row.id, { description: e.target.value })
                          }
                          className="w-full rounded border-0 bg-transparent text-xs text-slate-600 placeholder:text-slate-400 focus:ring-2 focus:ring-sky-300 focus:ring-inset"
                          placeholder="Description"
                        />
                      </>
                    )}
                  </div>
                </td>
                <td className="w-[10%] border border-slate-200 bg-white text-center align-middle">
                  <div className="flex justify-center py-1" aria-hidden>
                    <div className="h-6 w-6 shrink-0 rounded border-2 border-slate-400 bg-white" />
                  </div>
                </td>
                <td className="w-[8%] border border-slate-200 bg-white text-center align-middle">
                  <div className="flex justify-center py-1" aria-hidden>
                    <div className="h-6 w-6 shrink-0 rounded border-2 border-slate-400 bg-white" />
                  </div>
                </td>
                <td className="relative w-[34%] border border-slate-200 align-top px-2">
                  <DottedLines lines={3} />
                  {!readOnly && (
                    <div className="no-print absolute right-1 top-1 flex gap-1 opacity-0 transition group-hover:opacity-100">
                      <button
                        type="button"
                        onClick={() => addRowBelow(row.id)}
                        className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-100 text-xs text-sky-600 hover:bg-sky-200"
                        title="Add below"
                      >
                        +
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteRow(row.id)}
                        className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-xs text-red-600 hover:bg-red-200"
                        title="Delete row"
                      >
                        ×
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            )
          )}
        </tbody>
        {!readOnly && (
          <tfoot className="no-print">
            <tr>
              <td colSpan={4} className="border border-dashed border-slate-300 bg-slate-50/80 px-4 py-3 text-center">
                <div className="flex flex-wrap justify-center gap-2">
                  <button
                    type="button"
                    onClick={addSection}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-800 shadow-sm transition hover:bg-amber-100"
                  >
                    + Add section
                  </button>
                  <button
                    type="button"
                    onClick={addQuestionAtEnd}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-sky-200 bg-sky-50 px-3 py-1.5 text-sm font-medium text-sky-800 shadow-sm transition hover:bg-sky-100"
                  >
                    + Add question row
                  </button>
                </div>
              </td>
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  )
}
