export type AssetSymbol = 'NIFTY50' | 'BANKNIFTY' | 'RELIANCE' | 'TCS' | 'INFY' | 'HDFCBANK';

export type MarketRegimeType = 'Bullish Trending' | 'Bearish Trending' | 'Sideways / Neutral' | 'High Volatility';

export type SignalType = 'BUY' | 'SELL' | 'HOLD';

export interface AssetInfo {
  symbol: AssetSymbol;
  name: string;
  exchange: 'NSE' | 'BSE' | 'INDEX';
  sector: string;
  currentPrice: number;
  change: number;
  changePercent: number;
  open: number;
  high: number;
  low: number;
  volume: string;
  vwap: number;
  high52w: number;
  low52w: number;
  regime: MarketRegimeType;
  regimeConfidence: number;
  signal: SignalType;
  signalConfidence: number;
  xgboostScore: number; // e.g. 0.78
  sentimentScore: number; // -1 to +1
  volatilityAnnualized: number; // e.g. 14.8%
}

export interface PricePoint {
  date: string;
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  sma20?: number;
  ema50?: number;
  upperBand?: number;
  lowerBand?: number;
  signalMarker?: 'BUY' | 'SELL';
  regime?: MarketRegimeType;
}

export interface NewsSentimentItem {
  id: string;
  headline: string;
  source: string;
  timeAgo: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  sentimentScore: number; // -1 to 1
  impact: 'High' | 'Medium' | 'Low';
  relevantSymbols: string[];
  summary: string;
}

export interface FeatureImportance {
  feature: string;
  weight: number;
  category: 'Momentum' | 'Volatility' | 'Trend' | 'Sentiment' | 'Regime';
  description: string;
  currentValue: string;
}

export interface TradeRecord {
  id: string;
  symbol: AssetSymbol;
  entryDate: string;
  exitDate: string;
  type: 'BUY' | 'SELL';
  entryPrice: number;
  exitPrice: number;
  shares: number;
  pnl: number;
  pnlPercent: number;
  holdingPeriodDays: number;
  regimeAtEntry: MarketRegimeType;
  biasPrevented: string;
  status: 'CLOSED' | 'OPEN';
}

export interface EquityPoint {
  date: string;
  strategyEquity: number;
  benchmarkEquity: number;
  drawdownPercent: number;
  cash: number;
}

export interface BacktestParameters {
  symbol: AssetSymbol;
  startDate: string;
  endDate: string;
  initialCapital: number;
  positionSizingPct: number;
  stopLossPct: number;
  takeProfitPct: number;
  regimeFilterEnabled: boolean;
  sentimentFilterEnabled: boolean;
  biasSuppressionLevel: 'Aggressive' | 'Moderate' | 'Conservative';
}

export interface BacktestResults {
  totalReturnPct: number;
  benchmarkReturnPct: number;
  cagr: number;
  sharpeRatio: number;
  sortinoRatio: number;
  maxDrawdownPct: number;
  winRatePct: number;
  profitFactor: number;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  avgWinPct: number;
  avgLossPct: number;
  expectancy: number;
  var95Pct: number;
  calmarRatio: number;
}

export interface MonthlyReturn {
  year: number;
  months: (number | null)[]; // 12 months, null if future/missing
  ytd: number;
}

export interface BehavioralBiasInfo {
  biasName: string;
  psychologicalTrigger: string;
  systematicMitigationRule: string;
  riskReductionMetric: string;
  status: 'Active Protection' | 'Armed' | 'Monitored';
}

export type UserRole = 'admin' | 'user' | 'reviewer' | 'analyst' | 'student';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  lastActive: string;
  affiliation: string;
}

export interface SystemAuditLog {
  id: string;
  timestamp: string;
  event: string;
  category: 'BIAS_GUARD' | 'MODEL_ENGINE' | 'SECURITY' | 'EXECUTION';
  severity: 'INFO' | 'WARNING' | 'ALERT';
  user: string;
  details: string;
  biasBlocked?: string;
}

export interface BiasModuleConfig {
  id: string;
  name: string;
  biasType: string;
  enabled: boolean;
  sensitivity: 'Low' | 'Medium' | 'Strict';
  hurdlePercent: number;
  description: string;
}
