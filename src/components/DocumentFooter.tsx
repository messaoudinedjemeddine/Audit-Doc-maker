'use client'

import type { AuditPageData } from '@/types/audit'

interface DocumentFooterProps {
  data: AuditPageData
  onChange: (updates: Partial<AuditPageData>) => void
  readOnly?: boolean
}

export function DocumentFooter({ data, onChange, readOnly }: DocumentFooterProps) {
  const { nonConformities, leadAuditor, auditee } = data

  return (
    <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="border-b-2 border-sky-600 pb-1.5 text-xs font-bold uppercase tracking-wide text-slate-900">
          {readOnly ? 'Non-Conformities' : (
            <input
              type="text"
              value="Non-Conformities"
              readOnly
              className="w-full border-0 bg-transparent font-bold uppercase tracking-wide focus:ring-0"
            />
          )}
        </h3>
        <div className="mt-3 space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-slate-600">Major:</span>
            {readOnly ? (
              <span className="font-medium text-slate-900">{nonConformities.major}</span>
            ) : (
              <input
                type="number"
                min={0}
                value={nonConformities.major}
                onChange={(e) =>
                  onChange({
                    nonConformities: {
                      ...nonConformities,
                      major: Math.max(0, parseInt(e.target.value, 10) || 0),
                    },
                  })
                }
                className="w-14 rounded border border-slate-200 px-2 py-0.5 text-right text-slate-900 focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
              />
            )}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-600">Minor:</span>
            {readOnly ? (
              <span className="font-medium text-slate-900">{nonConformities.minor}</span>
            ) : (
              <input
                type="number"
                min={0}
                value={nonConformities.minor}
                onChange={(e) =>
                  onChange({
                    nonConformities: {
                      ...nonConformities,
                      minor: Math.max(0, parseInt(e.target.value, 10) || 0),
                    },
                  })
                }
                className="w-14 rounded border border-slate-200 px-2 py-0.5 text-right text-slate-900 focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
              />
            )}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-600">Observation:</span>
            {readOnly ? (
              <span className="font-medium text-slate-900">{nonConformities.observation}</span>
            ) : (
              <input
                type="number"
                min={0}
                value={nonConformities.observation}
                onChange={(e) =>
                  onChange({
                    nonConformities: {
                      ...nonConformities,
                      observation: Math.max(0, parseInt(e.target.value, 10) || 0),
                    },
                  })
                }
                className="w-14 rounded border border-slate-200 px-2 py-0.5 text-right text-slate-900 focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
              />
            )}
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="border-b-2 border-sky-600 pb-1.5 text-xs font-bold uppercase tracking-wide text-slate-900">
          Sign-off
        </h3>
        <div className="mt-3 space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wide text-slate-500">
              Lead Auditor
            </label>
            {readOnly ? (
              <div className="mt-1 min-h-[1.5rem] border-b border-slate-200 text-slate-900">
                {leadAuditor || '—'}
              </div>
            ) : (
              <input
                type="text"
                value={leadAuditor}
                onChange={(e) => onChange({ leadAuditor: e.target.value })}
                placeholder="Name"
                className="mt-1 w-full border-0 border-b border-slate-200 bg-transparent py-1 text-slate-900 placeholder:text-slate-400 focus:border-sky-400 focus:outline-none focus:ring-0"
              />
            )}
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wide text-slate-500">
              Auditee
            </label>
            {readOnly ? (
              <div className="mt-1 min-h-[1.5rem] border-b border-slate-200 text-slate-900">
                {auditee || '—'}
              </div>
            ) : (
              <input
                type="text"
                value={auditee}
                onChange={(e) => onChange({ auditee: e.target.value })}
                placeholder="Name"
                className="mt-1 w-full border-0 border-b border-slate-200 bg-transparent py-1 text-slate-900 placeholder:text-slate-400 focus:border-sky-400 focus:outline-none focus:ring-0"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
