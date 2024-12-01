export interface NewsItem {
  title: string;
  description: string;
  link: string;
  pubDate: string;
  sentiment: string;
  impact: 'low' | 'medium' | 'high';
  category: string;
}

export interface Settings {
  apiKey: string;
  model: string;
}

export interface HighImpactNews {
  title: string;
  impact: string;
  affectedCurrencies: string[];
  tradingImplications: string;
  riskLevel: 'high' | 'medium' | 'low';
  confidence: number;
  keywords: string[];
  classification: {
    category: 'monetary' | 'economic' | 'geopolitical' | 'technical';
    confidence: number;
    keywords: string[];
  };
}

export interface MarketContext {
  currentTrend: string;
  keyRisks: string[];
  tradingOpportunities: string[];
}

export interface NewsAnalysis {
  highImpactNews: HighImpactNews[];
  marketContext: MarketContext;
  timestamp: string;
}

export interface CurrencyStrength {
  currency: string;
  strength: number;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  rationale: string;
}

export interface Correlation {
  pair1: string;
  pair2: string;
  strength: number;
  recommendation: string;
  rationale: string;
}