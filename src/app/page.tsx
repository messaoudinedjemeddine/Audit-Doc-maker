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
      tableColumnWidths: { ...first.tableColumnWidths },
      rows: [
        {
          type: 'question',
          id: crypto.randomUUID(),
          title: 'Nouveau titre',
          description: 'Description ou question...',
          response: null,
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
    if (typeof window !== 'undefined' && !window.confirm('Supprimer cette page entière ?')) return
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
      {/* Left navbar - blur/glass effect, French labels */}
      <nav className="no-print fixed left-0 top-0 z-50 flex h-full w-48 flex-col gap-4 border-r border-white/20 bg-white/10 px-4 py-6 backdrop-blur-md">
        <div className="text-sm font-semibold text-slate-700">Couleurs</div>
        <label className="flex flex-col gap-1.5 text-sm text-slate-700">
          <span>En-tête</span>
          <input
            type="color"
            value={pages[0]?.headerColor ?? '#ff8500'}
            onChange={(e) => {
              const color = e.target.value
              setPages((prev) => prev.map((p) => ({ ...p, headerColor: color })))
            }}
            className="h-9 w-full cursor-pointer rounded border border-slate-300 bg-white/50"
            title="Couleur de l'en-tête du tableau"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm text-slate-700">
          <span>Titres de section</span>
          <input
            type="color"
            value={pages[0]?.sectionHeaderColor ?? '#e2e8f0'}
            onChange={(e) => {
              const color = e.target.value
              setPages((prev) => prev.map((p) => ({ ...p, sectionHeaderColor: color })))
            }}
            className="h-9 w-full cursor-pointer rounded border border-slate-300 bg-white/50"
            title="Couleur des titres de section"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm text-slate-700">
          <span>Lignes d'éléments</span>
          <input
            type="color"
            value={pages[0]?.questionRowColor ?? '#f8fafc'}
            onChange={(e) => {
              const color = e.target.value
              setPages((prev) => prev.map((p) => ({ ...p, questionRowColor: color })))
            }}
            className="h-9 w-full cursor-pointer rounded border border-slate-300 bg-white/50"
            title="Couleur des lignes de question"
          />
        </label>
        <div className="my-2 border-t border-white/20" />
        <button
          type="button"
          onClick={addPage}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#ff8500] px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-[#e67600] focus:outline-none focus:ring-2 focus:ring-[#ff8500] focus:ring-offset-2"
        >
          <span className="text-lg leading-none">+</span>
          Ajouter une page
        </button>
        <button
          type="button"
          onClick={handleSavePdf}
          className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2"
          title="Ouvre la boîte d'impression — choisir « Enregistrer au format PDF » comme destination"
        >
          Enregistrer en PDF
        </button>
        <button
          type="button"
          onClick={handlePrint}
          className="flex items-center justify-center gap-2 rounded-xl bg-slate-800 px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
        >
          Imprimer
        </button>
      </nav>

      {/* Document area - offset for left navbar */}
      <div id="document-area" className="mx-auto flex max-w-[230mm] flex-col gap-8 px-4 pl-56 print:max-w-none print:gap-0 print:px-0 print:pl-0">
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
