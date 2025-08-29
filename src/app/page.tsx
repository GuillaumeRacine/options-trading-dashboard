'use client';

import { useState, useMemo } from 'react';
import { DashboardData, FilterState, SortState, Opportunity } from '@/types';
import Header from '@/components/Header';
import Filters from '@/components/Filters';
import OpportunityCard from '@/components/OpportunityCard';
import Charts from '@/components/Charts';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

// Import the dashboard data
import dashboardData from '@/lib/dashboard-data.json';

const typedDashboardData = dashboardData as DashboardData;

export default function Dashboard() {
  const [filters, setFilters] = useState<FilterState>({
    strategy_type: '',
    min_score: 0,
    min_probability: 0,
    max_days_to_expiry: 365,
    option_type: '',
    underlying_symbol: '',
  });

  const [sort, setSort] = useState<SortState>({
    field: 'score',
    direction: 'desc',
  });

  const [showCharts, setShowCharts] = useState(true);

  // Filter and sort opportunities
  const filteredAndSortedOpportunities = useMemo(() => {
    let filtered = typedDashboardData.opportunities.filter((opp) => {
      if (filters.strategy_type && opp.strategy_type !== filters.strategy_type) return false;
      if (filters.underlying_symbol && opp.underlying_symbol !== filters.underlying_symbol) return false;
      if (filters.option_type && opp.option_type !== filters.option_type) return false;
      if (opp.score < filters.min_score) return false;
      if (opp.probability_of_profit < filters.min_probability) return false;
      if (opp.days_to_expiry > filters.max_days_to_expiry) return false;
      return true;
    });

    // Sort
    filtered.sort((a, b) => {
      const aVal = a[sort.field];
      const bVal = b[sort.field];
      
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sort.direction === 'asc' ? aVal - bVal : bVal - aVal;
      }
      
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sort.direction === 'asc' 
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      
      return 0;
    });

    return filtered;
  }, [filters, sort]);

  const handleSort = (field: keyof Opportunity) => {
    if (sort.field === field) {
      setSort({
        ...sort,
        direction: sort.direction === 'asc' ? 'desc' : 'asc',
      });
    } else {
      setSort({
        field,
        direction: 'desc',
      });
    }
  };

  const getSortIcon = (field: keyof Opportunity) => {
    if (sort.field !== field) return <ArrowUpDown className="h-4 w-4" />;
    return sort.direction === 'asc' 
      ? <ArrowUp className="h-4 w-4" /> 
      : <ArrowDown className="h-4 w-4" />;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        marketOverview={typedDashboardData.market_overview} 
        lastUpdated={typedDashboardData.generated_at}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Charts Toggle */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Market Analysis & Opportunities
          </h2>
          <button
            onClick={() => setShowCharts(!showCharts)}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            {showCharts ? 'Hide Charts' : 'Show Charts'}
          </button>
        </div>

        {/* Charts */}
        {showCharts && (
          <Charts 
            opportunities={typedDashboardData.opportunities} 
            marketOverview={typedDashboardData.market_overview}
          />
        )}

        {/* Filters */}
        <Filters 
          filters={filters}
          setFilters={setFilters}
          opportunities={typedDashboardData.opportunities}
        />

        {/* Results Summary */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Showing {filteredAndSortedOpportunities.length} opportunities
              </h3>
              <p className="text-sm text-gray-600">
                Sorted by {sort.field.replace('_', ' ')} ({sort.direction === 'desc' ? 'highest first' : 'lowest first'})
              </p>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => handleSort('score')}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                  sort.field === 'score' 
                    ? 'bg-primary-100 text-primary-700' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Score {getSortIcon('score')}
              </button>
              <button
                onClick={() => handleSort('probability_of_profit')}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                  sort.field === 'probability_of_profit' 
                    ? 'bg-primary-100 text-primary-700' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Win Rate {getSortIcon('probability_of_profit')}
              </button>
              <button
                onClick={() => handleSort('expected_value')}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                  sort.field === 'expected_value' 
                    ? 'bg-primary-100 text-primary-700' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Expected Value {getSortIcon('expected_value')}
              </button>
              <button
                onClick={() => handleSort('days_to_expiry')}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                  sort.field === 'days_to_expiry' 
                    ? 'bg-primary-100 text-primary-700' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                DTE {getSortIcon('days_to_expiry')}
              </button>
            </div>
          </div>
        </div>

        {/* Opportunities Grid */}
        {filteredAndSortedOpportunities.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="text-gray-400 text-6xl mb-4">📊</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No opportunities found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your filters to see more results.</p>
            <button
              onClick={() => setFilters({
                strategy_type: '',
                min_score: 0,
                min_probability: 0,
                max_days_to_expiry: 365,
                option_type: '',
                underlying_symbol: '',
              })}
              className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAndSortedOpportunities.map((opportunity, index) => (
              <div key={opportunity.id} className="fade-in">
                <OpportunityCard 
                  opportunity={opportunity} 
                  rank={index + 1}
                />
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
          <p>
            Data generated by Advanced Options Trading Algorithm using Black-Scholes mathematics
          </p>
          <p className="mt-1">
            Last updated: {new Date(typedDashboardData.generated_at).toLocaleString()}
          </p>
        </div>
      </main>
    </div>
  );
}