'use client';

import { Opportunity } from '@/types';
import { TrendingUp, TrendingDown, Clock, Target, DollarSign, Activity } from 'lucide-react';

interface OpportunityCardProps {
  opportunity: Opportunity;
  rank: number;
}

export default function OpportunityCard({ opportunity, rank }: OpportunityCardProps) {
  const isCall = opportunity.option_type === 'call';
  const isHighScore = opportunity.score >= 80;
  const isHighProbability = opportunity.probability_of_profit >= 70;
  const isPositiveEV = opportunity.expected_value > 0;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getProbabilityColor = (prob: number) => {
    if (prob >= 70) return 'text-green-600';
    if (prob >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatCurrency = (value: number) => {
    if (value >= 10000) return `$${(value / 1000).toFixed(1)}K`;
    return `$${value.toFixed(0)}`;
  };

  const formatPercent = (value: number) => `${value.toFixed(1)}%`;

  return (
    <div className={`bg-white rounded-lg shadow-md border-l-4 p-6 hover:shadow-lg transition-shadow duration-200 ${
      isHighScore ? 'border-l-green-500' : 'border-l-blue-500'
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
            rank <= 3 ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-600'
          }`}>
            #{rank}
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <span className="font-mono">{opportunity.underlying_symbol}</span>
              <span className="text-sm text-gray-500">@ ${opportunity.underlying_price}</span>
            </h3>
            <p className="text-sm text-gray-600 flex items-center gap-1">
              {isCall ? <TrendingUp className="h-4 w-4 text-green-500" /> : <TrendingDown className="h-4 w-4 text-red-500" />}
              {opportunity.strategy_type} ${opportunity.strike}
            </p>
          </div>
        </div>

        <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getScoreColor(opportunity.score)}`}>
          {opportunity.score.toFixed(1)}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <DollarSign className="h-4 w-4 text-gray-500 mr-1" />
            <span className="text-xs text-gray-500 uppercase tracking-wide">Premium</span>
          </div>
          <div className="text-lg font-semibold text-gray-900">
            ${opportunity.market_price.toFixed(2)}
          </div>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <Target className="h-4 w-4 text-gray-500 mr-1" />
            <span className="text-xs text-gray-500 uppercase tracking-wide">Win Rate</span>
          </div>
          <div className={`text-lg font-semibold ${getProbabilityColor(opportunity.probability_of_profit)}`}>
            {formatPercent(opportunity.probability_of_profit)}
          </div>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <Activity className="h-4 w-4 text-gray-500 mr-1" />
            <span className="text-xs text-gray-500 uppercase tracking-wide">Delta</span>
          </div>
          <div className="text-lg font-semibold text-gray-900">
            {opportunity.delta.toFixed(3)}
          </div>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <Clock className="h-4 w-4 text-gray-500 mr-1" />
            <span className="text-xs text-gray-500 uppercase tracking-wide">DTE</span>
          </div>
          <div className="text-lg font-semibold text-gray-900">
            {opportunity.days_to_expiry}
          </div>
        </div>
      </div>

      {/* Detailed Metrics */}
      <div className="border-t pt-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-gray-500 mb-1">Risk/Reward</div>
            <div className="flex justify-between">
              <span>Max Loss:</span>
              <span className="font-semibold text-red-600">{formatCurrency(opportunity.max_loss)}</span>
            </div>
            <div className="flex justify-between">
              <span>Max Profit:</span>
              <span className="font-semibold text-green-600">
                {opportunity.max_profit === 999999 ? '∞' : formatCurrency(opportunity.max_profit)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>R/R Ratio:</span>
              <span className="font-semibold">{opportunity.risk_reward_ratio.toFixed(2)}:1</span>
            </div>
          </div>

          <div>
            <div className="text-gray-500 mb-1">Greeks & IV</div>
            <div className="flex justify-between">
              <span>Implied Vol:</span>
              <span className="font-semibold">{formatPercent(opportunity.implied_volatility)}</span>
            </div>
            <div className="flex justify-between">
              <span>Theta:</span>
              <span className="font-semibold">${opportunity.theta.toFixed(2)}/day</span>
            </div>
            <div className="flex justify-between">
              <span>Vega:</span>
              <span className="font-semibold">${opportunity.vega.toFixed(2)}</span>
            </div>
          </div>

          <div>
            <div className="text-gray-500 mb-1">Liquidity & Value</div>
            <div className="flex justify-between">
              <span>Volume:</span>
              <span className="font-semibold">{opportunity.volume.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Open Interest:</span>
              <span className="font-semibold">{opportunity.open_interest.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Expected Value:</span>
              <span className={`font-semibold ${isPositiveEV ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(opportunity.expected_value)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Trade Details */}
      <div className="mt-4 pt-4 border-t bg-gray-50 -mx-6 -mb-6 px-6 py-4 rounded-b-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs text-gray-600">
            <span>Breakeven: <span className="font-semibold">${opportunity.breakeven.toFixed(2)}</span></span>
            <span>Expires: <span className="font-semibold">{new Date(opportunity.expiry_date).toLocaleDateString()}</span></span>
            <span>Spread: <span className="font-semibold">{formatPercent(opportunity.bid_ask_spread_pct)}</span></span>
          </div>
          
          <div className="flex gap-2">
            {isHighScore && (
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                High Score
              </span>
            )}
            {isHighProbability && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                High Probability
              </span>
            )}
            {isPositiveEV && (
              <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                Positive EV
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}