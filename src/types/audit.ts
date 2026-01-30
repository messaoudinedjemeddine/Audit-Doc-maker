export type ResponseOption = 'oui' | 'non' | 'nonConcerne' | 'observe' | 'affirmeParOperateur'

export type TableRow =
  | { type: 'section'; id: string; title: string }
  | {
      type: 'question';
      id: string;
      title: string;
      description: string;
      response: ResponseOption | null;
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
  tableColumns: {
    exigences: string;
    oui: string;
    non: string;
    nonConcerne: string;
    observe: string;
    affirmeParOperateur: string;
    observation: string;
  };
  rows: TableRow[];
}

export const defaultDocMeta = (): DocMetaItem[] => [
  { id: crypto.randomUUID(), label: 'N° Doc', value: 'FR/ADC-PM-02/03' },
  { id: crypto.randomUUID(), label: 'Révision', value: '00' },
  { id: crypto.randomUUID(), label: 'Date', value: '03 avril 2023' },
  { id: crypto.randomUUID(), label: 'Norme', value: 'ISO 14001:2015' },
]

export const createEmptyQuestionRow = (): Extract<TableRow, { type: 'question' }> => ({
  type: 'question',
  id: crypto.randomUUID(),
  title: 'Nouveau titre',
  description: 'Description ou question...',
  response: null,
  observation: '',
});

export const createEmptySectionRow = (): Extract<TableRow, { type: 'section' }> => ({
  type: 'section',
  id: crypto.randomUUID(),
  title: 'NOUVEAU TITRE DE SECTION',
});

export const defaultPageData = (id: string): AuditPageData => ({
  id,
  companyName: 'PT. ARTHA DAYA COALINDO',
  companySubtitle: 'Filiale de PT. INDONESIA POWER',
  docTitle: 'AUDIT INTERNE',
  docMeta: defaultDocMeta(),
  logoDataUrl: null,
  headerColor: '#ff8500',
  sectionHeaderColor: '#e2e8f0',
  questionRowColor: '#f8fafc',
  tableColumns: {
    exigences: 'Exigences',
    oui: 'Oui',
    non: 'Non',
    nonConcerne: 'Non\nconcerné',
    observe: 'Observe',
    affirmeParOperateur: "Affirmé par\nl'opérateur",
    observation: 'Observation',
  },
  rows: [
    {
      type: 'section',
      id: crypto.randomUUID(),
      title: '4. CONTEXTE DE L\'ORGANISATION',
    },
    {
      type: 'question',
      id: crypto.randomUUID(),
      title: '4.1 Compréhension de l\'organisation',
      description:
        "L'organisation a-t-elle déterminé les enjeux externes et internes pertinents pour son objectif ?",
      response: null,
      observation: '',
    },
    {
      type: 'question',
      id: crypto.randomUUID(),
      title: '4.2 Parties intéressées',
      description: 'Les exigences des parties intéressées ont-elles été identifiées ?',
      response: null,
      observation: '',
    },
  ],
});
