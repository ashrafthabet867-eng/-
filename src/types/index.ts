export type ResponseMode = 'brief' | 'detailed';

export interface ChatMessageItem {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  mode?: ResponseMode;
  timestamp: string;
  image?: {
    data: string; // base64
    mimeType: string;
    name: string;
  };
  isStreaming?: boolean;
  hasError?: boolean;
  legalArticlesCited?: string[];
}

export interface LegalDocument {
  id: string;
  number: string;
  category: 'pensions' | 'early_retirement' | 'survivors' | 'contributions' | 'work_injury' | 'sickness' | 'grants' | 'forms' | 'tables';
  title: string;
  summary: string;
  fullText: string;
  conditions?: string[];
  requiredDocs?: string[];
}

export interface PensionCalculationResult {
  wage: number;
  totalMonths: number;
  yearsFloat: number;
  calculatedPension: number;
  finalPension: number;
  maxPension: number;
  raisedToMinimum: boolean;
  minPensionLimit: number;
  earlyRetirement: {
    eligible: boolean;
    criteriaLogs: string[];
  };
  grants: {
    deathGrant: number;
    funeralExpenses: number;
    daughterMarriageGrant: number;
  };
}
