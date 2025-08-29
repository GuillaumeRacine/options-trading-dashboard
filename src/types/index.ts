export interface Opportunity {
  id: string;
  underlying_symbol: string;
  underlying_price: number;
  strategy_type: string;
  option_type: 'call' | 'put';
  strike: number;
  days_to_expiry: number;
  expiry_date: string;
  market_price: number;
  bid: number;
  ask: number;
  volume: number;
  open_interest: number;
  implied_volatility: number;
  delta: number;
  gamma: number;
  theta: number;
  vega: number;
  moneyness: number;
  bid_ask_spread_pct: number;
  breakeven: number;
  max_loss: number;
  max_profit: number;
  probability_of_profit: number;
  expected_value: number;
  score: number;
  risk_reward_ratio: number;
  liquidity_score: number;
  time_decay: number;
  intrinsic_value: number;
  time_value: number;
}

export interface Underlying {
  symbol: string;
  current_price: number;
  total_options: number;
  total_volume: number;
  total_open_interest: number;
  avg_iv: number;
  options_expiring_soon: number;
  call_put_ratio: number;
}

export interface MarketOverview {
  total_opportunities: number;
  avg_score: number;
  avg_probability_of_profit: number;
  avg_expected_value: number;
  total_underlyings: number;
  strategy_distribution: { [key: string]: number };
  top_scoring_opportunity: Opportunity | null;
  high_probability_count: number;
  positive_ev_count: number;
}

export interface DashboardData {
  opportunities: Opportunity[];
  market_overview: MarketOverview;
  underlyings: Underlying[];
  generated_at: string;
}

export interface FilterState {
  strategy_type: string;
  min_score: number;
  min_probability: number;
  max_days_to_expiry: number;
  option_type: string;
  underlying_symbol: string;
}

export interface SortState {
  field: keyof Opportunity;
  direction: 'asc' | 'desc';
}