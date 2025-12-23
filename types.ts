
export interface WyckoffAnalysis {
  phase: string;
  context: string;
  detections: string[];
  laws: {
    effortResult: string;
    causeEffect: string;
    supplyDemand: string;
  };
  emotionalState: string;
  recommendations: {
    aggressive: string;
    conservative: string;
  };
  isSpringOrUpthrust: boolean;
  summary: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface VisualEntriesResult {
  annotatedImageBase64: string;
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface InvestigationResult {
  pair: string;
  analysis: string;
  sources: GroundingSource[];
  timestamp: string;
}
