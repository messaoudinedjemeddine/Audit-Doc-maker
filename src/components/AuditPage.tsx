'use client'

import type { AuditPageData } from '@/types/audit'
import { DocumentHeader } from './DocumentHeader'
import { AuditTable } from './AuditTable'

interface AuditPageProps {
  data: AuditPageData
  onChange: (updates: Partial<AuditPageData>) => void
  onRemove?: () => void
  isFirstPage: boolean
  pageIndex: number
  totalPages: number
  readOnly?: boolean
}

export function AuditPage({
  data,
  onChange,
  onRemove,
  isFirstPage,
  pageIndex,
  totalPages,
  readOnly,
}: AuditPageProps) {
  return (
    <div className="mx-auto w-[210mm] min-h-[297mm] rounded-2xl border border-slate-200 bg-white p-6 shadow-card print:min-h-0 print:rounded-none print:border-0 print:shadow-none print:break-after-page">
      <DocumentHeader
        data={data}
        onChange={onChange}
        pageIndex={pageIndex}
        totalPages={totalPages}
        readOnly={readOnly}
      />
      <AuditTable data={data} onChange={onChange} readOnly={readOnly} />

      {!readOnly && !isFirstPage && onRemove && (
        <div className="no-print mt-6 flex justify-center">
          <button
            type="button"
            onClick={onRemove}
            className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100"
          >
            Remove this page
          </button>
        </div>
      )}
    </div>
  )
}
