import type { TableRow } from '@/types/audit'

function newId(): string {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `id-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

/**
 * Parse a pasted list into section and question rows.
 *
 * Format:
 * - Line starting with "Section:" or "Section :" → section row (rest = title)
 * - Line containing " | " → question row (left = title, right = question/description)
 * - Other non-empty line → question row (whole line = title, description empty)
 */
export function parseContentList(text: string): TableRow[] {
  const rows: TableRow[] = []
  const lines = text.split(/\r?\n/)

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) continue

    if (/^Section\s*:\s*/i.test(trimmed)) {
      const title = trimmed.replace(/^Section\s*:\s*/i, '').trim()
      rows.push({
        type: 'section',
        id: newId(),
        title: title || 'Nouvelle section',
      })
      continue
    }

    if (trimmed.includes(' | ')) {
      const [title, description] = trimmed.split(' | ', 2).map((s) => s.trim())
      rows.push({
        type: 'question',
        id: newId(),
        title: title || 'Sans titre',
        description: description || '',
        response: null,
        observation: '',
      })
      continue
    }

    rows.push({
      type: 'question',
      id: newId(),
      title: trimmed,
      description: '',
      response: null,
      observation: '',
    })
  }

  return rows
}
