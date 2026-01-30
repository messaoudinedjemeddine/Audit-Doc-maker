'use client'

import { useCallback, useRef, useState } from 'react'
import type { AuditPageData } from '@/types/audit'
import { defaultPageData } from '@/types/audit'
import { AuditPage } from '@/components/AuditPage'
import { exportDocument, importDocument } from '@/lib/audit-export'
import { parseContentList } from '@/lib/parse-content-list'

function createNewPage(): AuditPageData {
  return defaultPageData(crypto.randomUUID())
}

export default function Home() {
  const [pages, setPages] = useState<AuditPageData[]>(() => [createNewPage()])
  const [showContentModal, setShowContentModal] = useState(false)
  const [contentListText, setContentListText] = useState('')
  const [compactMode, setCompactMode] = useState(false)

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

  const insertPageBreak = useCallback((pageId: string, rowIndex: number) => {
    setPages((prev) => {
      const pageIndex = prev.findIndex((p) => p.id === pageId)
      if (pageIndex === -1 || rowIndex <= 0 || rowIndex >= prev[pageIndex].rows.length) return prev
      const page = prev[pageIndex]
      const headRows = page.rows.slice(0, rowIndex)
      const tailRows = page.rows.slice(rowIndex)
      const newPage: AuditPageData = {
        ...page,
        id: crypto.randomUUID(),
        companyName: page.companyName,
        companySubtitle: page.companySubtitle,
        docTitle: page.docTitle,
        docMeta: page.docMeta.map((item) => ({ ...item, id: crypto.randomUUID(), value: item.value })),
        logoDataUrl: page.logoDataUrl,
        headerColor: page.headerColor,
        sectionHeaderColor: page.sectionHeaderColor,
        questionRowColor: page.questionRowColor,
        tableColumns: { ...page.tableColumns },
        tableColumnWidths: { ...page.tableColumnWidths },
        rows: tailRows,
      }
      const updatedPage = { ...page, rows: headRows }
      const next = [...prev]
      next[pageIndex] = updatedPage
      next.splice(pageIndex + 1, 0, newPage)
      return next
    })
  }, [])

  const resetToSinglePage = useCallback(() => {
    if (typeof window !== 'undefined' && !window.confirm('Tout remettre sur une seule page ? Vous pourrez ensuite redécouper les pages comme vous voulez.')) return
    setPages((prev) => {
      if (prev.length <= 1) return prev
      const first = prev[0]
      const allRows = prev.flatMap((p) => p.rows)
      return [{ ...first, rows: allRows }]
    })
  }, [])

  const handlePrint = useCallback(() => {
    window.print()
  }, [])

  const handleSavePdf = useCallback(() => {
    window.print()
  }, [])

  const handleExportDocument = useCallback(() => {
    const json = exportDocument(pages)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `audit-document-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }, [pages])

  const fileInputRef = useRef<HTMLInputElement>(null)
  const listFileInputRef = useRef<HTMLInputElement>(null)

  const handleImportClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleImportListClick = useCallback(() => {
    listFileInputRef.current?.click()
  }, [])

  const LIST_TEMPLATE = `Section: 4. CONTEXTE DE L'ORGANISATION
4.1 Compréhension de l'organisation | L'organisation a-t-elle déterminé les enjeux externes et internes pertinents pour son objectif ?
4.2 Parties intéressées | Les exigences des parties intéressées ont-elles été identifiées ?
Section: 5. LEADERSHIP
5.1 Leadership et engagement | La direction a-t-elle démontré son engagement ?
5.2 Politique | La politique est-elle appropriée et communiquée ?`

  const handleDownloadListTemplate = useCallback(() => {
    const blob = new Blob([LIST_TEMPLATE], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'modele-liste-audit.txt'
    a.click()
    URL.revokeObjectURL(url)
  }, [])

  const handleImportListFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const text = reader.result as string
      const rows = parseContentList(text)
      if (rows.length === 0) {
        if (typeof window !== 'undefined') {
          window.alert('Aucune ligne reconnue dans le fichier. Utilisez le format : Section: titre, ou Titre | Question')
        }
        return
      }
      const firstPageId = pages[0]?.id
      if (firstPageId) {
        updatePage(firstPageId, { rows })
        if (typeof window !== 'undefined') {
          window.alert(`${rows.length} ligne(s) importée(s). Le tableau a été rempli.`)
        }
      }
    }
    reader.readAsText(file, 'UTF-8')
    e.target.value = ''
  }, [pages, updatePage])

  const handleImportFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const text = reader.result as string
      const imported = importDocument(text)
      if (imported) {
        setPages(imported)
        if (typeof window !== 'undefined') {
          window.alert('Document importé avec succès.')
        }
      } else {
        if (typeof window !== 'undefined') {
          window.alert('Fichier invalide. Utilisez un fichier .json exporté par cette application.')
        }
      }
    }
    reader.readAsText(file, 'UTF-8')
    e.target.value = ''
  }, [])

  const handleFillFromList = useCallback(() => {
    const rows = parseContentList(contentListText)
    if (rows.length === 0) {
      if (typeof window !== 'undefined') {
        window.alert('Aucune ligne reconnue. Utilisez le format indiqué dans la boîte.')
      }
      return
    }
    const firstPageId = pages[0]?.id
    if (firstPageId) {
      updatePage(firstPageId, { rows })
      setShowContentModal(false)
      setContentListText('')
      if (typeof window !== 'undefined') {
        window.alert(`${rows.length} ligne(s) ajoutée(s) au tableau.`)
      }
    }
  }, [contentListText, pages, updatePage])

  return (
    <div className="min-h-screen bg-slate-100 py-8 print:bg-white print:py-0">
      {/* Left navbar - blur/glass effect, French labels */}
      <nav className="no-print fixed left-0 top-0 z-50 flex h-full w-52 flex-col gap-3 overflow-y-auto border-r border-white/20 bg-white/10 px-4 py-6 backdrop-blur-md">
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
        <label className="no-print flex cursor-pointer items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={compactMode}
            onChange={(e) => setCompactMode(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-[#ff8500] focus:ring-[#ff8500]"
          />
          <span>Mode compact (moins de pages)</span>
        </label>
        <div className="my-2 border-t border-white/20" />
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          className="hidden"
          aria-hidden
          onChange={handleImportFile}
        />
        <input
          ref={listFileInputRef}
          type="file"
          accept=".txt,text/plain"
          className="hidden"
          aria-hidden
          onChange={handleImportListFile}
        />
        <button
          type="button"
          onClick={handleExportDocument}
          className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
          title="Télécharge un fichier .json pour rouvrir plus tard"
        >
          Enregistrer le document
        </button>
        <button
          type="button"
          onClick={handleImportClick}
          className="flex items-center justify-center gap-2 rounded-xl bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
          title="Ouvrir un fichier .json précédemment exporté"
        >
          Importer un document
        </button>
        <button
          type="button"
          onClick={handleImportListClick}
          className="flex items-center justify-center gap-1.5 rounded-xl bg-violet-600 px-3 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2"
          title="Choisir un fichier .txt pour remplir le tableau (format : Section: titre, ou Titre | Question)"
        >
          <span className="text-base leading-none" aria-hidden>📄</span>
          Importer un fichier .txt
        </button>
        <button
          type="button"
          onClick={handleDownloadListTemplate}
          className="text-[11px] text-violet-600 hover:underline"
        >
          Télécharger le modèle .txt
        </button>
        <button
          type="button"
          onClick={() => setShowContentModal(true)}
          className="flex items-center justify-center gap-2 rounded-xl bg-violet-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2"
          title="Coller une liste pour remplir le tableau"
        >
          Coller une liste
        </button>
        <button
          type="button"
          onClick={resetToSinglePage}
          disabled={pages.length <= 1}
          className="flex items-center justify-center gap-2 rounded-xl bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"
          title="Remet tout le contenu sur une seule page ; vous pourrez ensuite redécouper avec le bouton ↵ sur chaque ligne"
        >
          Tout sur une page
        </button>
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
          title="Ouvre la boîte d'impression. Pour ne pas afficher la date, le titre et l'URL sur le PDF : décocher « En-têtes et pieds de page » (ou « Headers and footers »)."
        >
          Enregistrer en PDF
        </button>
        <p className="text-[10px] leading-tight text-slate-500">
          PDF sans date ni lien : dans la fenêtre d&apos;impression, décocher « En-têtes et pieds de page ».
        </p>
        <button
          type="button"
          onClick={handlePrint}
          className="flex items-center justify-center gap-2 rounded-xl bg-slate-800 px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
        >
          Imprimer
        </button>
      </nav>

      {/* Modal: fill table from pasted list */}
      {showContentModal && (
        <div className="no-print fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-xl">
            <div className="border-b border-slate-200 px-6 py-4">
              <h2 className="text-lg font-bold text-slate-900">Remplir le tableau</h2>
              <p className="mt-1 text-sm text-slate-600">
                Collez votre liste ci-dessous. Une ligne par section ou par item.
              </p>
              <p className="mt-2 text-xs text-slate-500">
                <strong>Section :</strong> commencez une ligne par &quot;Section :&quot; pour un titre de section.
                <br />
                <strong>Item avec question :</strong> utilisez &quot; | &quot; entre le titre et la question (ex. 4.1 Titre | La question ici ?).
                <br />
                <strong>Item seul :</strong> une ligne sans &quot;Section :&quot; ni &quot;|&quot; = titre d&apos;item (sans question).
              </p>
            </div>
            <div className="p-6">
              <textarea
                value={contentListText}
                onChange={(e) => setContentListText(e.target.value)}
                placeholder={"Section: 4. CONTEXTE DE L'ORGANISATION\n4.1 Compréhension | L'organisation a-t-elle déterminé les enjeux ?\n4.2 Parties intéressées | Les exigences ont-elles été identifiées ?"}
                rows={12}
                className="w-full rounded-lg border border-slate-300 p-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#ff8500] focus:outline-none focus:ring-2 focus:ring-[#ff8500]/20"
              />
            </div>
            <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4">
              <button
                type="button"
                onClick={() => {
                  setShowContentModal(false)
                  setContentListText('')
                }}
                className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleFillFromList}
                className="rounded-xl bg-[#ff8500] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#e67600] focus:outline-none focus:ring-2 focus:ring-[#ff8500] focus:ring-offset-2"
              >
                Remplir le tableau
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document area - offset for left navbar */}
      <div id="document-area" className="mx-auto flex max-w-[230mm] flex-col gap-8 px-4 pl-56 print:max-w-none print:gap-0 print:px-0 print:pl-0">
        {pages.map((page, index) => (
          <div key={page.id} id={`page-${page.id}`}>
            <AuditPage
              data={page}
              onChange={(updates) => updatePage(page.id, updates)}
              onRemove={pages.length > 1 ? () => removePage(page.id) : undefined}
              onInsertPageBreakAbove={(rowIndex) => insertPageBreak(page.id, rowIndex)}
              isFirstPage={index === 0}
              pageIndex={index}
              totalPages={pages.length}
              compactMode={compactMode}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
