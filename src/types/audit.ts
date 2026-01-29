export type TableRow = 
  | { type: 'section'; id: string; title: string }
  | {
      type: 'question';
      id: string;
      title: string;
      description: string;
      yes: boolean;
      no: boolean;
      observation: string;
    };

export interface DocMetaItem {
  id: string;
  label: string;
  value: string;
}

export interface AuditPageData {
  id: string;
  companyName: string;
  companySubtitle: string;
  docTitle: string;
  docMeta: DocMetaItem[];
  logoDataUrl: string | null;
  headerColor: string;
  sectionHeaderColor: string;
  questionRowColor: string;
  tableColumns: { exigences: string; yes: string; no: string; observation: string };
  rows: TableRow[];
}

export const defaultDocMeta = (): DocMetaItem[] => [
  { id: crypto.randomUUID(), label: 'Doc No', value: 'FR/ADC-PM-02/03' },
  { id: crypto.randomUUID(), label: 'Rev', value: '00' },
  { id: crypto.randomUUID(), label: 'Date', value: '03 April 2023' },
  { id: crypto.randomUUID(), label: 'Standard', value: 'ISO 14001:2015' },
]

export const createEmptyQuestionRow = (): Extract<TableRow, { type: 'question' }> => ({
  type: 'question',
  id: crypto.randomUUID(),
  title: 'New Item Title',
  description: 'Description or question goes here...',
  yes: false,
  no: false,
  observation: '',
});

export const createEmptySectionRow = (): Extract<TableRow, { type: 'section' }> => ({
  type: 'section',
  id: crypto.randomUUID(),
  title: 'NEW SECTION TITLE',
});

export const defaultPageData = (id: string): AuditPageData => ({
  id,
  companyName: 'PT. ARTHA DAYA COALINDO',
  companySubtitle: 'Subsidiary of PT. INDONESIA POWER',
  docTitle: 'INTERNAL AUDIT',
  docMeta: defaultDocMeta(),
  logoDataUrl: null,
  headerColor: '#0284c7',
  sectionHeaderColor: '#e2e8f0',
  questionRowColor: '#f8fafc',
  tableColumns: {
    exigences: 'Exigences',
    yes: 'Yes',
    no: 'No',
    observation: 'Observation',
  },
  rows: [
    {
      type: 'section',
      id: crypto.randomUUID(),
      title: '4. CONTEXT OF THE ORGANIZATION',
    },
    {
      type: 'question',
      id: crypto.randomUUID(),
      title: '4.1 Understanding the organization',
      description:
        'Has the organization determined external and internal issues relevant to its purpose?',
      yes: false,
      no: false,
      observation: '',
    },
    {
      type: 'question',
      id: crypto.randomUUID(),
      title: '4.2 Interested Parties',
      description: 'Have requirements of interested parties been identified?',
      yes: false,
      no: false,
      observation: '',
    },
  ],
});
