
export type TradeDirection = 'Long' | 'Short';

export interface GeminiAnalysis {
  strengths: string[];
  weaknesses: string[];
  potentialImprovements: string[];
  overallRating: number;
  summary: string;
}

export interface Trade {
  id: string;
  pair: string;
  date: string;
  direction: TradeDirection;
  entry: number;
  exit: number;
  pnl: number;
  notes?: string;
  screenshot?: string; // base64 string
  analysis?: GeminiAnalysis;
}
