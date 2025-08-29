'use client';

import { FilterState, Opportunity } from '@/types';
import { Filter, RotateCcw } from 'lucide-react';

interface FiltersProps {
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  opportunities: Opportunity[];
}

export default function Filters({ filters, setFilters, opportunities }: FiltersProps) {
  const uniqueSymbols = Array.from(new Set(opportunities.map(o => o.underlying_symbol))).sort();
  const uniqueStrategies = Array.from(new Set(opportunities.map(o => o.strategy_type))).sort();

  const resetFilters = () => {
    setFilters({
      strategy_type: '',
      min_score: 0,
      min_probability: 0,
      max_days_to_expiry: 365,
      option_type: '',
      underlying_symbol: '',
    });
  };

  const updateFilter = (key: keyof FilterState, value: any) => {
    setFilters({ ...filters, [key]: value });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-gray-500" />
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        </div>
        <button
          onClick={resetFilters}
          className="flex items-center gap-2 px-3 py-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        {/* Underlying Symbol */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Underlying
          </label>
          <select
            value={filters.underlying_symbol}
            onChange={(e) => updateFilter('underlying_symbol', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">All Symbols</option>
            {uniqueSymbols.map(symbol => (
              <option key={symbol} value={symbol}>{symbol}</option>
            ))}
          </select>
        </div>

        {/* Strategy Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Strategy
          </label>
          <select
            value={filters.strategy_type}
            onChange={(e) => updateFilter('strategy_type', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">All Strategies</option>
            {uniqueStrategies.map(strategy => (
              <option key={strategy} value={strategy}>{strategy}</option>
            ))}
          </select>
        </div>

        {/* Option Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Option Type
          </label>
          <select
            value={filters.option_type}
            onChange={(e) => updateFilter('option_type', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Calls & Puts</option>
            <option value="call">Calls Only</option>
            <option value="put">Puts Only</option>
          </select>
        </div>

        {/* Min Score */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Min Score ({filters.min_score})
          </label>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={filters.min_score}
            onChange={(e) => updateFilter('min_score', Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>

        {/* Min Probability */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Min Win Rate ({filters.min_probability}%)
          </label>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={filters.min_probability}
            onChange={(e) => updateFilter('min_probability', Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>

        {/* Max Days to Expiry */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Max DTE ({filters.max_days_to_expiry})
          </label>
          <input
            type="range"
            min="7"
            max="365"
            step="7"
            value={filters.max_days_to_expiry}
            onChange={(e) => updateFilter('max_days_to_expiry', Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>
      </div>
    </div>
  );
}