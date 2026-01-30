import type { AuditPageData, DocMetaItem, TableRow } from '@/types/audit'

const EXPORT_VERSION = 1

const DEFAULT_TABLE_COLUMN_WIDTHS = {
  exigences: 28,
  oui: 6,
  non: 6,
  nonConcerne: 11,
  observe: 11,
  affirmeParOperateur: 11,
  observation: 27,
}

export interface AuditDocument {
  version: number
  exportedAt: string
  app: string
  pages: AuditPageData[]
}

/**
 * Serialize the current document for saving to a file.
 */
export function exportDocument(pages: AuditPageData[]): string {
  const doc: AuditDocument = {
    version: EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    app: 'Audit-Doc-maker',
    pages,
  }
  return JSON.stringify(doc, null, 2)
}

/**
 * Parse and validate an imported file. Returns normalized pages or null if invalid.
 */
export function importDocument(json: string): AuditPageData[] | null {
  try {
    const data = JSON.parse(json) as unknown
    if (!data || typeof data !== 'object') return null
    const doc = data as Record<string, unknown>
    if (doc.version !== EXPORT_VERSION && doc.version !== undefined) {
      // Allow version 1 only for now
      if (doc.version !== 1) return null
    }
    const rawPages = doc.pages
    if (!Array.isArray(rawPages) || rawPages.length === 0) return null

    const pages: AuditPageData[] = rawPages.map((p: unknown) =>
      normalizePage(p as Record<string, unknown>)
    )
    return pages
  } catch {
    return null
  }
}

function ensureId(): string {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `id-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

function normalizePage(p: Record<string, unknown>): AuditPageData {
  const docMeta = (Array.isArray(p.docMeta) ? p.docMeta : []).map((item: unknown) => {
    const i = item as Record<string, unknown>
    return {
      id: typeof i.id === 'string' ? i.id : ensureId(),
      label: typeof i.label === 'string' ? i.label : '',
      value: typeof i.value === 'string' ? i.value : '',
    } as DocMetaItem
  })

  const tableColumns = (p.tableColumns && typeof p.tableColumns === 'object'
    ? p.tableColumns
    : {}) as Record<string, string>
  const defaultColumns = {
    exigences: 'Exigences',
    oui: 'Oui',
    non: 'Non',
    nonConcerne: 'Non\nconcerné',
    observe: 'Observe',
    affirmeParOperateur: "Affirmé par\nl'opérateur",
    observation: 'Observation',
  }
  const mergedColumns = { ...defaultColumns, ...tableColumns }

  const tableColumnWidths = (p.tableColumnWidths && typeof p.tableColumnWidths === 'object'
    ? { ...DEFAULT_TABLE_COLUMN_WIDTHS, ...(p.tableColumnWidths as object) }
    : DEFAULT_TABLE_COLUMN_WIDTHS) as AuditPageData['tableColumnWidths']

  const rows = (Array.isArray(p.rows) ? p.rows : []).map((r: unknown) =>
    normalizeRow(r as Record<string, unknown>)
  ) as TableRow[]

  return {
    id: typeof p.id === 'string' ? p.id : ensureId(),
    companyName: typeof p.companyName === 'string' ? p.companyName : '',
    companySubtitle: typeof p.companySubtitle === 'string' ? p.companySubtitle : '',
    docTitle: typeof p.docTitle === 'string' ? p.docTitle : '',
    docMeta: docMeta.length > 0 ? docMeta : [{ id: ensureId(), label: 'N° Doc', value: '' }],
    logoDataUrl: typeof p.logoDataUrl === 'string' ? p.logoDataUrl : p.logoDataUrl === null ? null : null,
    headerColor: typeof p.headerColor === 'string' ? p.headerColor : '#ff8500',
    sectionHeaderColor: typeof p.sectionHeaderColor === 'string' ? p.sectionHeaderColor : '#e2e8f0',
    questionRowColor: typeof p.questionRowColor === 'string' ? p.questionRowColor : '#f8fafc',
    tableColumns: mergedColumns,
    tableColumnWidths,
    rows,
  }
}

function normalizeRow(r: Record<string, unknown>): TableRow {
  const id = typeof r.id === 'string' ? r.id : ensureId()
  if (r.type === 'section') {
    return {
      type: 'section',
      id,
      title: typeof r.title === 'string' ? r.title : '',
    }
  }
  const response = (r.response === 'oui' || r.response === 'non' || r.response === 'nonConcerne' || r.response === 'observe' || r.response === 'affirmeParOperateur')
    ? r.response
    : null
  return {
    type: 'question',
    id,
    title: typeof r.title === 'string' ? r.title : '',
    description: typeof r.description === 'string' ? r.description : '',
    response,
    observation: typeof r.observation === 'string' ? r.observation : '',
  }
}
