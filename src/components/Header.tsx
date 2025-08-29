'use client';

import { TrendingUp, BarChart3, Target, Clock } from 'lucide-react';
import { MarketOverview } from '@/types';

interface HeaderProps {
  marketOverview: MarketOverview;
  lastUpdated: string;
}

export default function Header({ marketOverview, lastUpdated }: HeaderProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <div className="p-2 bg-primary-500 rounded-lg">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
              Options Trading Dashboard
            </h1>
            <p className="text-gray-600 mt-2">
              AI-powered opportunities ranked by risk-adjusted returns
            </p>
          </div>
          
          <div className="text-right">
            <div className="flex items-center text-sm text-gray-500 mb-1">
              <Clock className="h-4 w-4 mr-1" />
              Last updated: {formatDate(lastUpdated)}
            </div>
            <div className="text-xs text-gray-400">
              Canadian ETF Options Analysis
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary-100 text-sm font-medium">Total Opportunities</p>
                <p className="text-2xl font-bold">{marketOverview.total_opportunities}</p>
              </div>
              <Target className="h-8 w-8 text-primary-200" />
            </div>
            <p className="text-xs text-primary-100 mt-2">
              Across {marketOverview.total_underlyings} underlyings
            </p>
          </div>

          <div className="bg-gradient-to-r from-success-500 to-success-600 rounded-lg p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-success-100 text-sm font-medium">Avg Score</p>
                <p className="text-2xl font-bold">{marketOverview.avg_score.toFixed(1)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-success-200" />
            </div>
            <p className="text-xs text-success-100 mt-2">
              Algorithm rating 0-100
            </p>
          </div>

          <div className="bg-gradient-to-r from-warning-500 to-warning-600 rounded-lg p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-warning-100 text-sm font-medium">Avg Win Rate</p>
                <p className="text-2xl font-bold">{marketOverview.avg_probability_of_profit.toFixed(1)}%</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-warning-200 flex items-center justify-center">
                <span className="text-warning-700 font-bold text-sm">%</span>
              </div>
            </div>
            <p className="text-xs text-warning-100 mt-2">
              Probability of profit
            </p>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Positive EV</p>
                <p className="text-2xl font-bold">{marketOverview.positive_ev_count}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-purple-200 flex items-center justify-center">
                <span className="text-purple-700 font-bold text-sm">+</span>
              </div>
            </div>
            <p className="text-xs text-purple-100 mt-2">
              Expected value &gt; $0
            </p>
          </div>
        </div>

        {/* Top Opportunity Highlight */}
        {marketOverview.top_scoring_opportunity && (
          <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-green-800">🏆 Top Opportunity</h3>
                <p className="text-green-700 mt-1">
                  <span className="font-medium">{marketOverview.top_scoring_opportunity.underlying_symbol}</span> - 
                  {marketOverview.top_scoring_opportunity.strategy_type} ${marketOverview.top_scoring_opportunity.strike} 
                  ({marketOverview.top_scoring_opportunity.days_to_expiry} DTE)
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-800">
                  {marketOverview.top_scoring_opportunity.score.toFixed(1)}
                </div>
                <div className="text-sm text-green-600">Algorithm Score</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}