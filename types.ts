export type PosterType = 'setA' | 'setB';
export type WindowState = 'closed' | 'empty' | 'cases' | 'content' | 'analyzing' | 'result' | 'brief';
export type Dimension = 'Feasibility' | 'Advantages/Disadvantages' | 'Originality' | 'Cost';

export interface AnalysisResult {
  code: string;
  critique: string;
}

export interface ChatMessage {
  role: 'user' | 'ai';
  text: string;
}

export interface PosterProps {
  type: PosterType;
  variant: 'A' | 'B';
  size?: 'small' | 'large';
  noShadow?: boolean;
}
