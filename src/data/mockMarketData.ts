import {
  AssetInfo,
  AssetSymbol,
  PricePoint,
  NewsSentimentItem,
  FeatureImportance,
  TradeRecord,
  EquityPoint,
  BacktestResults,
  MonthlyReturn,
  BehavioralBiasInfo,
  MarketRegimeType
} from '../types';

export const ASSETS_DATA: Record<AssetSymbol, AssetInfo> = {
  NIFTY50: {
    symbol: 'NIFTY50',
    name: 'NIFTY 50 Index',
    exchange: 'INDEX',
    sector: 'Broad Market Benchmark',
    currentPrice: 24835.40,
    change: 182.65,
    changePercent: 0.74,
    open: 24690.20,
    high: 24870.50,
    low: 24650.15,
    volume: '284.5M',
    vwap: 24780.10,
    high52w: 26277.35,
    low52w: 18837.85,
    regime: 'Bullish Trending',
    regimeConfidence: 84.5,
    signal: 'BUY',
    signalConfidence: 86.2,
    xgboostScore: 0.82,
    sentimentScore: 0.68,
    volatilityAnnualized: 13.4,
  },
  BANKNIFTY: {
    symbol: 'BANKNIFTY',
    name: 'NIFTY Bank Index',
    exchange: 'INDEX',
    sector: 'Banking & Financials',
    currentPrice: 51740.80,
    change: -115.30,
    changePercent: -0.22,
    open: 51920.00,
    high: 52050.40,
    low: 51610.20,
    volume: '142.1M',
    vwap: 51785.60,
    high52w: 54467.35,
    low52w: 42105.40,
    regime: 'Sideways / Neutral',
    regimeConfidence: 71.0,
    signal: 'HOLD',
    signalConfidence: 68.4,
    xgboostScore: 0.52,
    sentimentScore: 0.12,
    volatilityAnnualized: 18.2,
  },
  RELIANCE: {
    symbol: 'RELIANCE',
    name: 'Reliance Industries Ltd.',
    exchange: 'NSE',
    sector: 'Energy & Conglomerate',
    currentPrice: 2984.70,
    change: 41.25,
    changePercent: 1.40,
    open: 2948.00,
    high: 2995.00,
    low: 2940.10,
    volume: '7.85M',
    vwap: 2972.40,
    high52w: 3217.90,
    low52w: 2221.05,
    regime: 'Bullish Trending',
    regimeConfidence: 88.0,
    signal: 'BUY',
    signalConfidence: 89.5,
    xgboostScore: 0.87,
    sentimentScore: 0.74,
    volatilityAnnualized: 16.5,
  },
  TCS: {
    symbol: 'TCS',
    name: 'Tata Consultancy Services',
    exchange: 'NSE',
    sector: 'Information Technology',
    currentPrice: 4215.30,
    change: -28.90,
    changePercent: -0.68,
    open: 4245.00,
    high: 4260.00,
    low: 4198.50,
    volume: '2.14M',
    vwap: 4220.15,
    high52w: 4592.25,
    low52w: 3313.00,
    regime: 'Sideways / Neutral',
    regimeConfidence: 65.2,
    signal: 'HOLD',
    signalConfidence: 72.1,
    xgboostScore: 0.48,
    sentimentScore: 0.05,
    volatilityAnnualized: 15.1,
  },
  INFY: {
    symbol: 'INFY',
    name: 'Infosys Limited',
    exchange: 'NSE',
    sector: 'Information Technology',
    currentPrice: 1890.65,
    change: -34.80,
    changePercent: -1.81,
    open: 1930.00,
    high: 1935.50,
    low: 1882.00,
    volume: '8.42M',
    vwap: 1899.30,
    high52w: 1991.45,
    low52w: 1358.35,
    regime: 'Bearish Trending',
    regimeConfidence: 79.4,
    signal: 'SELL',
    signalConfidence: 81.3,
    xgboostScore: 0.23,
    sentimentScore: -0.42,
    volatilityAnnualized: 21.6,
  },
  HDFCBANK: {
    symbol: 'HDFCBANK',
    name: 'HDFC Bank Ltd.',
    exchange: 'NSE',
    sector: 'Private Banking',
    currentPrice: 1675.20,
    change: 12.80,
    changePercent: 0.77,
    open: 1665.00,
    high: 1682.40,
    low: 1658.00,
    volume: '15.6M',
    vwap: 1671.50,
    high52w: 1794.00,
    low52w: 1363.55,
    regime: 'Bullish Trending',
    regimeConfidence: 74.8,
    signal: 'BUY',
    signalConfidence: 76.9,
    xgboostScore: 0.71,
    sentimentScore: 0.38,
    volatilityAnnualized: 17.3,
  },
};

// Generate realistic daily historical price series (90 trading days)
export const generatePriceHistory = (symbol: AssetSymbol): PricePoint[] => {
  const asset = ASSETS_DATA[symbol];
  const points: PricePoint[] = [];
  const basePrice = asset.currentPrice;
  const numDays = 90;
  
  // Starting reference price based on current
  let currentVal = basePrice * 0.88;
  const now = new Date('2026-10-04T15:30:00');

  for (let i = numDays; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    // skip weekends roughly
    if (d.getDay() === 0 || d.getDay() === 6) continue;

    const dateStr = d.toISOString().split('T')[0];
    const trendFactor = (numDays - i) / numDays;
    
    // Add realistic noise & trend
    const dailyChangePct = (Math.sin(i * 0.25) * 0.012) + (Math.cos(i * 0.1) * 0.008) + ((trendFactor - 0.5) * 0.005);
    const close = Math.round((currentVal * (1 + dailyChangePct)) * 100) / 100;
    const high = Math.round((close * (1 + Math.abs(Math.sin(i * 0.5)) * 0.012 + 0.004)) * 100) / 100;
    const low = Math.round((close * (1 - Math.abs(Math.cos(i * 0.5)) * 0.011 - 0.003)) * 100) / 100;
    const open = Math.round(((low + high) / 2 + (Math.sin(i) * (high - low) * 0.3)) * 100) / 100;
    const volume = Math.round(500000 + Math.abs(Math.sin(i * 0.7)) * 1500000);

    // Regime classification
    let regime: MarketRegimeType = 'Bullish Trending';
    if (i > 65) regime = 'Sideways / Neutral';
    else if (i > 45) regime = 'High Volatility';
    else if (i > 25) regime = 'Bullish Trending';
    else if (symbol === 'INFY') regime = 'Bearish Trending';
    else regime = asset.regime;

    // Signal markers for educational evaluation
    let signalMarker: 'BUY' | 'SELL' | undefined = undefined;
    if (i === 60) signalMarker = 'BUY';
    if (i === 38) signalMarker = 'SELL';
    if (i === 12) signalMarker = 'BUY';

    points.push({
      date: dateStr,
      timestamp: d.getTime(),
      open,
      high,
      low,
      close,
      volume,
      regime,
      signalMarker,
    });

    currentVal = close;
  }

  // Adjust last item to match current market price
  if (points.length > 0) {
    points[points.length - 1].close = asset.currentPrice;
    points[points.length - 1].high = Math.max(points[points.length - 1].high, asset.high);
    points[points.length - 1].low = Math.min(points[points.length - 1].low, asset.low);
    points[points.length - 1].regime = asset.regime;
  }

  // Compute moving averages and bollinger bands
  for (let idx = 0; idx < points.length; idx++) {
    if (idx >= 19) {
      const slice20 = points.slice(idx - 19, idx + 1);
      const sma = slice20.reduce((acc, p) => acc + p.close, 0) / 20;
      points[idx].sma20 = Math.round(sma * 100) / 100;

      // Standard deviation for Bollinger Bands
      const variance = slice20.reduce((acc, p) => acc + Math.pow(p.close - sma, 2), 0) / 20;
      const stdDev = Math.sqrt(variance);
      points[idx].upperBand = Math.round((sma + 2 * stdDev) * 100) / 100;
      points[idx].lowerBand = Math.round((sma - 2 * stdDev) * 100) / 100;
    }
    if (idx >= 49) {
      const slice50 = points.slice(idx - 49, idx + 1);
      const ema = slice50.reduce((acc, p) => acc + p.close, 0) / 50;
      points[idx].ema50 = Math.round(ema * 100) / 100;
    }
  }

  return points;
};

// Feature importances for XGBoost model
export const FEATURE_IMPORTANCES: FeatureImportance[] = [
  {
    feature: 'RSI_14 (Relative Strength)',
    weight: 0.24,
    category: 'Momentum',
    description: 'Mitigates FOMO buying at overbought extremes (>70) and panic selling at oversold levels (<30).',
    currentValue: '61.4 (Neutral-Bullish)',
  },
  {
    feature: 'HMM_Regime_Prob (State Filter)',
    weight: 0.21,
    category: 'Regime',
    description: 'Prevents trend-following strategies during whipsawing chop and sideways false breakouts.',
    currentValue: 'State 1 (P=0.845)',
  },
  {
    feature: 'FinBERT_Sentiment_MA (NLP)',
    weight: 0.18,
    category: 'Sentiment',
    description: 'Filters noise from social media panic, tracking institutional financial sentiment consensus.',
    currentValue: '+0.68 (Positive Consensus)',
  },
  {
    feature: 'MACD_Histogram (Trend Velocity)',
    weight: 0.15,
    category: 'Trend',
    description: 'Identifies genuine momentum acceleration while rejecting emotional late-entry impulses.',
    currentValue: '+14.20 (Expanding)',
  },
  {
    feature: 'Realized_Vol_20d (Risk Filter)',
    weight: 0.12,
    category: 'Volatility',
    description: 'Auto-scales position sizing down when market turbulence spikes, curbing revenge trades.',
    currentValue: '13.4% Annualized',
  },
  {
    feature: 'Bollinger_%B (Mean Reversion)',
    weight: 0.10,
    category: 'Volatility',
    description: 'Quantifies relative price location against statistical volatility envelopes.',
    currentValue: '0.74 (Upper Boundary Test)',
  },
];

// Financial news articles with FinBERT sentiment scores
export const FINANCIAL_NEWS: NewsSentimentItem[] = [
  {
    id: 'n1',
    headline: 'RBI Policy Review: Liquidity Measures and Stable Repo Rate Boost Capital Inflows',
    source: 'The Economic Times',
    timeAgo: '42m ago',
    sentiment: 'positive',
    sentimentScore: 0.81,
    impact: 'High',
    relevantSymbols: ['NIFTY50', 'BANKNIFTY', 'HDFCBANK'],
    summary: 'Reserve Bank of India maintained liquidity stance while projecting resilient GDP growth, bolstering institutional investor risk appetite across primary indices.',
  },
  {
    id: 'n2',
    headline: 'Reliance Expands Green Hydrogen & Retail Footprint Ahead of Annual Analyst Meet',
    source: 'LiveMint',
    timeAgo: '1h 15m ago',
    sentiment: 'positive',
    sentimentScore: 0.76,
    impact: 'High',
    relevantSymbols: ['RELIANCE', 'NIFTY50'],
    summary: 'Strategic capacity expansion in clean energy and sustained telecom ARPU gains drive positive broker revisions and strong quantitative momentum readings.',
  },
  {
    id: 'n3',
    headline: 'Global IT Spending Guidance Muted as Enterprise Cloud Budgets Face Scrutiny',
    source: 'Bloomberg Markets',
    timeAgo: '2h 40m ago',
    sentiment: 'negative',
    sentimentScore: -0.62,
    impact: 'Medium',
    relevantSymbols: ['INFY', 'TCS'],
    summary: 'Cautious client discretionary spending in North America dampens BFSI vertical pipeline conversion for tier-1 Indian software exporters.',
  },
  {
    id: 'n4',
    headline: 'Foreign Institutional Investors (FII) Turn Net Buyers in Cash Segment for 4th Consecutive Session',
    source: 'Reuters Financial',
    timeAgo: '3h 10m ago',
    sentiment: 'positive',
    sentimentScore: 0.65,
    impact: 'High',
    relevantSymbols: ['NIFTY50', 'BANKNIFTY', 'RELIANCE'],
    summary: 'NSE provisional data showed net foreign inflows of ₹2,140 Crore, systematically reducing volatility risk metrics across high-beta bluechips.',
  },
  {
    id: 'n5',
    headline: 'Banking Sector Credit Growth Remains Robust at 14.2% YoY Led by Retail & MSME',
    source: 'Business Standard',
    timeAgo: '4h 55m ago',
    sentiment: 'positive',
    sentimentScore: 0.58,
    impact: 'Medium',
    relevantSymbols: ['BANKNIFTY', 'HDFCBANK'],
    summary: 'Asset quality indicators across commercial banks sustain decade-low gross NPAs, supporting steady systematic hold allocations.',
  },
  {
    id: 'n6',
    headline: 'Crude Oil Prices Stabilize Around $76 as Geopolitical Risk Premium Subsides',
    source: 'Financial Express',
    timeAgo: '6h 20m ago',
    sentiment: 'neutral',
    sentimentScore: 0.12,
    impact: 'Low',
    relevantSymbols: ['NIFTY50', 'RELIANCE'],
    summary: 'OPEC+ supply discipline balanced against non-OPEC output keeps energy input costs stable for domestic manufacturing sectors.',
  },
];

// Backtest execution history
export const MOCK_TRADES: TradeRecord[] = [
  {
    id: 'TRD-9041',
    symbol: 'NIFTY50',
    entryDate: '2026-08-14',
    exitDate: '2026-09-22',
    type: 'BUY',
    entryPrice: 24120.50,
    exitPrice: 24980.20,
    shares: 40,
    pnl: 34388,
    pnlPercent: 3.56,
    holdingPeriodDays: 39,
    regimeAtEntry: 'Bullish Trending',
    biasPrevented: 'Prevented premature exit driven by market noise/fear during minor 1.2% pullback.',
    status: 'CLOSED',
  },
  {
    id: 'TRD-8820',
    symbol: 'RELIANCE',
    entryDate: '2026-07-02',
    exitDate: '2026-08-08',
    type: 'BUY',
    entryPrice: 2780.00,
    exitPrice: 2940.50,
    shares: 180,
    pnl: 28890,
    pnlPercent: 5.77,
    holdingPeriodDays: 37,
    regimeAtEntry: 'Bullish Trending',
    biasPrevented: 'Eliminated Greed-driven leverage: strict position sizing preserved capital allocation.',
    status: 'CLOSED',
  },
  {
    id: 'TRD-8705',
    symbol: 'INFY',
    entryDate: '2026-05-18',
    exitDate: '2026-06-04',
    type: 'SELL',
    entryPrice: 1940.20,
    exitPrice: 1875.00,
    shares: 250,
    pnl: 16300,
    pnlPercent: 3.36,
    holdingPeriodDays: 17,
    regimeAtEntry: 'Bearish Trending',
    biasPrevented: 'Mitigated Disposition Effect (holding onto losing stock hoping it bounces back).',
    status: 'CLOSED',
  },
  {
    id: 'TRD-8512',
    symbol: 'BANKNIFTY',
    entryDate: '2026-03-10',
    exitDate: '2026-04-15',
    type: 'BUY',
    entryPrice: 49850.00,
    exitPrice: 51200.00,
    shares: 20,
    pnl: 27000,
    pnlPercent: 2.71,
    holdingPeriodDays: 36,
    regimeAtEntry: 'Bullish Trending',
    biasPrevented: 'Prevented FOMO entry at peak: waited for HMM regime confirmation & positive sentiment.',
    status: 'CLOSED',
  },
  {
    id: 'TRD-8320',
    symbol: 'TCS',
    entryDate: '2026-01-22',
    exitDate: '2026-02-14',
    type: 'BUY',
    entryPrice: 4120.00,
    exitPrice: 4070.00,
    shares: 120,
    pnl: -6000,
    pnlPercent: -1.21,
    holdingPeriodDays: 23,
    regimeAtEntry: 'High Volatility',
    biasPrevented: 'Strict Stop-Loss executed systematically; averted emotional loss aversion and deep drawdown.',
    status: 'CLOSED',
  },
  {
    id: 'TRD-8199',
    symbol: 'NIFTY50',
    entryDate: '2025-11-05',
    exitDate: '2025-12-28',
    type: 'BUY',
    entryPrice: 23450.00,
    exitPrice: 24320.00,
    shares: 40,
    pnl: 34800,
    pnlPercent: 3.71,
    holdingPeriodDays: 53,
    regimeAtEntry: 'Bullish Trending',
    biasPrevented: 'Suppressed Overtrading impulse: held position patiently through sideways consolidation.',
    status: 'CLOSED',
  },
];

// Equity curve points comparison (Strategy vs Benchmark Buy & Hold)
export const generateEquityCurve = (initialCapital: number): EquityPoint[] => {
  const points: EquityPoint[] = [];
  const totalMonths = 18;
  const startDate = new Date('2025-04-01');

  let stratEq = initialCapital;
  let benchEq = initialCapital;
  let peakStrat = stratEq;

  for (let i = 0; i <= totalMonths * 4; i++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i * 7);
    const dateStr = d.toISOString().split('T')[0];

    // Systematic strategy gains steadier returns with lower drawdowns
    const stratWeeklyReturn = 0.0042 + (Math.sin(i * 0.4) * 0.006) + (Math.random() * 0.003 - 0.001);
    stratEq = Math.round(stratEq * (1 + stratWeeklyReturn));
    
    if (stratEq > peakStrat) peakStrat = stratEq;
    const drawdown = Math.round(((stratEq - peakStrat) / peakStrat) * 1000) / 10;

    // Benchmark has higher volatility and sharper drawdowns
    const benchWeeklyReturn = 0.0028 + (Math.sin(i * 0.35) * 0.016) + (Math.random() * 0.008 - 0.004);
    benchEq = Math.round(benchEq * (1 + benchWeeklyReturn));

    points.push({
      date: dateStr,
      strategyEquity: stratEq,
      benchmarkEquity: benchEq,
      drawdownPercent: drawdown,
      cash: Math.round(stratEq * 0.15),
    });
  }

  return points;
};

// Backtest summary statistics
export const MOCK_BACKTEST_RESULTS: BacktestResults = {
  totalReturnPct: 34.8,
  benchmarkReturnPct: 18.2,
  cagr: 22.4,
  sharpeRatio: 2.14,
  sortinoRatio: 3.08,
  maxDrawdownPct: -6.4,
  winRatePct: 71.4,
  profitFactor: 2.65,
  totalTrades: 42,
  winningTrades: 30,
  losingTrades: 12,
  avgWinPct: 3.42,
  avgLossPct: -1.38,
  expectancy: 2.05,
  var95Pct: 1.18,
  calmarRatio: 3.50,
};

// Monthly performance breakdown table (Jan - Dec)
export const MONTHLY_RETURNS: MonthlyReturn[] = [
  {
    year: 2026,
    months: [2.8, 1.4, 3.1, -0.6, 2.2, 1.9, 3.4, 1.8, 2.1, null, null, null],
    ytd: 19.3,
  },
  {
    year: 2025,
    months: [1.2, -1.1, 2.4, 1.9, 3.2, 0.8, -0.5, 2.6, 1.7, 3.0, -0.8, 2.5],
    ytd: 17.8,
  },
  {
    year: 2024,
    months: [0.9, 1.5, -0.8, 2.1, 1.4, 2.9, 1.1, -0.4, 2.8, 1.6, 2.2, 1.0],
    ytd: 17.2,
  },
];

// Core Behavioral Biases Mitigated by the Systematic Framework
export const BEHAVIORAL_BIASES: BehavioralBiasInfo[] = [
  {
    biasName: 'Loss Aversion & Panic Selling',
    psychologicalTrigger: 'Extreme emotional pain felt during sharp intraday drops causing premature dumping at bottoms.',
    systematicMitigationRule: 'Dynamic volatility-scaled stop-loss algorithm & HMM noise filter prevent panic exits.',
    riskReductionMetric: 'Drawdown duration cut by 48%',
    status: 'Active Protection',
  },
  {
    biasName: 'Fear Of Missing Out (FOMO)',
    psychologicalTrigger: 'Entering extended rallies at parabolic peaks due to social proof and speculative greed.',
    systematicMitigationRule: 'RSI overextension hurdle + XGBoost threshold inhibits chasing overbought assets.',
    riskReductionMetric: 'Zero top-quartile false breakouts entered',
    status: 'Active Protection',
  },
  {
    biasName: 'Disposition Effect',
    psychologicalTrigger: 'Tendency to sell winning trades too quickly while holding losing trades indefinitely.',
    systematicMitigationRule: 'Symmetric profit targets & automated trailing stops enforce programmatic exit discipline.',
    riskReductionMetric: 'Win/Loss Ratio boosted to 2.48:1',
    status: 'Active Protection',
  },
  {
    biasName: 'Overconfidence & Revenge Trading',
    psychologicalTrigger: 'Doubling trade size after a loss or series of wins, discarding risk boundaries.',
    systematicMitigationRule: 'Fixed Kelly fractional position sizing cap (max 10% capital per trade) with cool-off locks.',
    riskReductionMetric: 'Capital preservation rate: 100%',
    status: 'Active Protection',
  },
  {
    biasName: 'Recency Bias & Noise Overreaction',
    psychologicalTrigger: 'Overweighting sensational financial headlines or short-term tick volatility.',
    systematicMitigationRule: 'FinBERT institutional NLP scoring with decay weighting normalizes emotional news spikes.',
    riskReductionMetric: 'False alarm trade reduction: 64%',
    status: 'Active Protection',
  },
];

// HMM Regime State Transition Matrix
export const HMM_TRANSITION_MATRIX = [
  { fromState: 'Bullish Trending', toBullish: 0.82, toSideways: 0.12, toBearish: 0.04, toHighVol: 0.02 },
  { fromState: 'Sideways / Neutral', toBullish: 0.22, toSideways: 0.64, toBearish: 0.10, toHighVol: 0.04 },
  { fromState: 'Bearish Trending', toBullish: 0.06, toSideways: 0.18, toBearish: 0.72, toHighVol: 0.04 },
  { fromState: 'High Volatility', toBullish: 0.14, toSideways: 0.28, toBearish: 0.22, toHighVol: 0.36 },
];

// Mock Users for Auth & RBAC
export const MOCK_USERS = [
  {
    id: 'usr-user-01',
    name: 'Dr. Rajesh Sharma',
    email: 'user@quantmind.io',
    role: 'user' as const,
    affiliation: 'Standard Trading & Analysis User Module',
    lastActive: 'Active now',
    passwordHint: 'user123',
  },
  {
    id: 'usr-admin-01',
    name: 'Pradeep Barik',
    email: 'admin@quantmind.io',
    role: 'admin' as const,
    affiliation: 'Project Lead / System Administrator Module',
    lastActive: 'Active now',
    passwordHint: 'admin123',
  },
  {
    id: 'usr-an-03',
    name: 'Arjun Mehta',
    email: 'arjun.quant@research.edu',
    role: 'analyst' as const,
    affiliation: 'Quantitative Finance Researcher',
    lastActive: '2h ago',
    passwordHint: 'quant123',
  },
  {
    id: 'usr-st-04',
    name: 'Ananya Sen',
    email: 'ananya.s@univ.ac.in',
    role: 'student' as const,
    affiliation: 'Final-Year Student Researcher',
    lastActive: '1d ago',
    passwordHint: 'student123',
  },
];

// Mock System Audit Logs (Focusing on Systematic Bias Interventions)
export const MOCK_AUDIT_LOGS = [
  {
    id: 'LOG-9402',
    timestamp: '15:28:44 IST',
    event: 'Manual Buy Order Blocked: Parabolic Overextension',
    category: 'BIAS_GUARD' as const,
    severity: 'ALERT' as const,
    user: 'arjun.quant@research.edu',
    details: 'Asset INFY triggered FOMO lock. Price exceeded Bollinger Upper Band (+2.4σ) with RSI=74.2. Systematic engine vetoed manual entry.',
    biasBlocked: 'FOMO & Parabolic Chasing',
  },
  {
    id: 'LOG-9388',
    timestamp: '14:45:12 IST',
    event: 'Panic Exit Suppression: Intraday Noise Filtered',
    category: 'BIAS_GUARD' as const,
    severity: 'WARNING' as const,
    user: 'SYSTEM_AUTONOMIC',
    details: 'NIFTY50 dip (-0.8%) identified as transitory noise by HMM regime detector. Prevented premature emotional liquidation.',
    biasBlocked: 'Loss Aversion & Panic Selling',
  },
  {
    id: 'LOG-9340',
    timestamp: '13:12:05 IST',
    event: 'Kelly Fractional Sizing Constraint Enforced',
    category: 'EXECUTION' as const,
    severity: 'INFO' as const,
    user: 'SYSTEM_AUTONOMIC',
    details: 'Trade sizing on RELIANCE capped at 10.0% capital allocation (₹1,00,000 max), preventing overleveraged conviction impulse.',
    biasBlocked: 'Overconfidence / Revenge Trading',
  },
  {
    id: 'LOG-9290',
    timestamp: '11:30:19 IST',
    event: 'HMM Model Check: State Transition Matrix Synced',
    category: 'MODEL_ENGINE' as const,
    severity: 'INFO' as const,
    user: 'pradeepbarik2002@gmail.com',
    details: 'hmmlearn Baum-Welch 4-state convergence achieved at log-likelihood -412.8.',
  },
  {
    id: 'LOG-9180',
    timestamp: '09:16:00 IST',
    event: 'Trading Session Initialization & Circuit Breakers Armed',
    category: 'SECURITY' as const,
    severity: 'INFO' as const,
    user: 'SYSTEM_DAEMON',
    details: 'Pre-market tick pipeline connected via yFinance stream; market volatility filters set to active baseline.',
  },
];

// Bias Mitigation Config Modules for Admin Screen
export const MOCK_BIAS_MODULES = [
  {
    id: 'mod-fomo',
    name: 'FOMO Parabolic Breakout Inhibitor',
    biasType: 'Fear Of Missing Out (FOMO)',
    enabled: true,
    sensitivity: 'Strict' as const,
    hurdlePercent: 80,
    description: 'Vetoes BUY orders when asset is >2.0 standard deviations above 20-day mean or RSI-14 exceeds 70.',
  },
  {
    id: 'mod-panic',
    name: 'Panic Liquidation Noise Absorber',
    biasType: 'Loss Aversion / Panic Selling',
    enabled: true,
    sensitivity: 'Strict' as const,
    hurdlePercent: 75,
    description: 'Forces dynamic volatility-adjusted trailing stop rather than emotional market order dumps during flash pullbacks.',
  },
  {
    id: 'mod-disposition',
    name: 'Disposition Guard (Programmatic Exits)',
    biasType: 'Disposition Effect',
    enabled: true,
    sensitivity: 'Medium' as const,
    hurdlePercent: 75,
    description: 'Enforces symmetric profit realization and automatic stop-loss execution to eliminate holding onto losing trades.',
  },
  {
    id: 'mod-revenge',
    name: 'Anti-Revenge Trading Cool-Off Lock',
    biasType: 'Overconfidence & Revenge Trading',
    enabled: true,
    sensitivity: 'Strict' as const,
    hurdlePercent: 85,
    description: 'Imposes mandatory 30-minute cool-off period and maximum 10% Kelly capital allocation cap following losing trades.',
  },
  {
    id: 'mod-recency',
    name: 'FinBERT Sentiment Noise Normalizer',
    biasType: 'Recency & Sensationalism Bias',
    enabled: true,
    sensitivity: 'Medium' as const,
    hurdlePercent: 70,
    description: 'Applies exponential time-decay weighting to breaking media headlines to suppress knee-jerk speculative reactions.',
  },
];

