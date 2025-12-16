export interface DocumentInput {
  id: number;
  text: string;
}

export interface IntermediatePair {
  term: string;
  docId: number;
  originalToken?: string; // For visualization purposes
}

export interface DictionaryEntry {
  term: string;
  postings: number[];
}

export enum PipelineStep {
  INGESTION = 0,
  TOKENIZATION = 1,
  STEMMING = 2,
  SORTING = 3,
  INDEXING = 4,
  SEARCH = 5
}
