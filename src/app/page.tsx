'use client'

import { useCallback, useState } from 'react'
import type { AuditPageData } from '@/types/audit'
import { defaultPageData } from '@/types/audit'
import { AuditPage } from '@/components/AuditPage'

function createNewPage(): AuditPageData {
  return defaultPageData(crypto.randomUUID())
}

export default function Home() {
  const [pages, setPages] = useState<AuditPageData[]>(() => [createNewPage()])

  const updatePage = useCallback((pageId: string, updates: Partial<AuditPageData>) => {
    setPages((prev) =>
      prev.map((p) => (p.id === pageId ? { ...p, ...updates } : p))
    )
  }, [])

  const addPage = useCallback(() => {
    const first = pages[0]
    const newPage: AuditPageData = {
      ...createNewPage(),
      id: crypto.randomUUID(),
      companyName: first.companyName,
      companySubtitle: first.companySubtitle,
      docTitle: first.docTitle,
      docMeta: first.docMeta.map((item) => ({
        ...item,
        id: crypto.randomUUID(),
        value: item.value,
      })),
      logoDataUrl: first.logoDataUrl,
      headerColor: first.headerColor,
      sectionHeaderColor: first.sectionHeaderColor,
      questionRowColor: first.questionRowColor,
      tableColumns: { ...first.tableColumns },
      rows: [
        {
          type: 'question',
          id: crypto.randomUUID(),
          title: 'New Item Title',
          description: 'Description or question goes here...',
          yes: false,
          no: false,
          observation: '',
        },
      ],
    }
    setPages((prev) => [...prev, newPage])
    requestAnimationFrame(() => {
      document.getElementById(`page-${newPage.id}`)?.scrollIntoView({
        behavior: 'smooth',
      })
    })
  }, [pages])

  const removePage = useCallback((pageId: string) => {
    if (typeof window !== 'undefined' && !window.confirm('Remove this entire page?')) return
    setPages((prev) => prev.filter((p) => p.id !== pageId))
  }, [])

  const handlePrint = useCallback(() => {
    window.print()
  }, [])

  const handleSavePdf = useCallback(() => {
    window.print()
  }, [])

  return (
    <div className="min-h-screen bg-slate-100 py-8 print:bg-white print:py-0">
      {/* Toolbar - hidden when printing */}
      <div className="no-print fixed right-6 top-6 z-50 flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <span>Header:</span>
          <input
            type="color"
            value={pages[0]?.headerColor ?? '#0284c7'}
            onChange={(e) => {
              const color = e.target.value
              setPages((prev) => prev.map((p) => ({ ...p, headerColor: color })))
            }}
            className="h-9 w-14 cursor-pointer rounded border border-slate-300"
            title="Table header color"
          />
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <span>Section titles:</span>
          <input
            type="color"
            value={pages[0]?.sectionHeaderColor ?? '#e2e8f0'}
            onChange={(e) => {
              const color = e.target.value
              setPages((prev) => prev.map((p) => ({ ...p, sectionHeaderColor: color })))
            }}
            className="h-9 w-14 cursor-pointer rounded border border-slate-300"
            title="Section title rows color"
          />
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <span>Item rows:</span>
          <input
            type="color"
            value={pages[0]?.questionRowColor ?? '#f8fafc'}
            onChange={(e) => {
              const color = e.target.value
              setPages((prev) => prev.map((p) => ({ ...p, questionRowColor: color })))
            }}
            className="h-9 w-14 cursor-pointer rounded border border-slate-300"
            title="Question row (title item) color"
          />
        </label>
        <button
          type="button"
          onClick={addPage}
          className="flex items-center gap-2 rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2"
        >
          <span className="text-lg leading-none">+</span>
          Add page
        </button>
        <button
          type="button"
          onClick={handleSavePdf}
          className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2"
          title="Opens print dialog — choose &quot;Save as PDF&quot; or &quot;Microsoft Print to PDF&quot; as destination"
        >
          Save as PDF
        </button>
        <button
          type="button"
          onClick={handlePrint}
          className="flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
        >
          Print
        </button>
      </div>

      {/* Document area - used for PDF export */}
      <div id="document-area" className="mx-auto flex max-w-[230mm] flex-col gap-8 px-4 print:max-w-none print:gap-0 print:px-0">
        {pages.map((page, index) => (
          <div key={page.id} id={`page-${page.id}`}>
            <AuditPage
              data={page}
              onChange={(updates) => updatePage(page.id, updates)}
              onRemove={pages.length > 1 ? () => removePage(page.id) : undefined}
              isFirstPage={index === 0}
              pageIndex={index}
              totalPages={pages.length}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
