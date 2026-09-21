export type OverallVerdict = 
  | 'LIKELY_REAL' 
  | 'LIKELY_FAKE' 
  | 'MISLEADING_CLICKBAIT' 
  | 'UNVERIFIED_DISPUTED';

export type SpecificVerdict = 'REAL' | 'FAKE' | 'MISLEADING' | 'UNVERIFIED';

export interface ClaimVerification {
  claim: string;
  verdict: 'VERIFIED_TRUE' | 'FALSE_DEBUNKED' | 'MISLEADING' | 'UNVERIFIED';
  explanation: string;
}

export interface GroundingSource {
  title: string;
  url: string;
}

export interface VerificationResult {
  id: string;
  timestamp: number;
  inputTitle: string;
  inputContent: string;
  sourceUrl?: string;
  
  overallVerdict: OverallVerdict;
  credibilityScore: number; // 0 to 100
  confidenceScore: number; // 0 to 100 (AI confidence in its verdict)
  
  summary: string;
  
  titleAnalysis: {
    verdict: SpecificVerdict;
    score: number; // 0-100 credibility of title
    isClickbait: boolean;
    clickbaitLevel: 'NONE' | 'LOW' | 'MODERATE' | 'EXTREME';
    analysis: string;
    matchesContent: boolean;
    discrepancyNotes?: string;
  };
  
  contentAnalysis: {
    verdict: SpecificVerdict;
    score: number; // 0-100 credibility of content
    factualAccuracy: 'HIGH' | 'MIXED' | 'LOW' | 'FABRICATED';
    emotionalTone: 'OBJECTIVE' | 'SENSATIONAL' | 'ALARMIST' | 'BIASED';
    analysis: string;
  };
  
  claims: ClaimVerification[];
  redFlags: string[];
  reputableSignals: string[];
  
  searchGroundingSources: GroundingSource[];
  searchQueriesUsed?: string[];
  modelUsed: string;
}

export interface SampleNews {
  id: string;
  category: string;
  title: string;
  content: string;
  expectedType: 'real' | 'fake' | 'clickbait';
}
