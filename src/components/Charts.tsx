'use client';

import { Opportunity, MarketOverview } from '@/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, ScatterChart, Scatter } from 'recharts';

interface ChartsProps {
  opportunities: Opportunity[];
  marketOverview: MarketOverview;
}

const COLORS = ['#0ea5e9', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16'];

export default function Charts({ opportunities, marketOverview }: ChartsProps) {
  // Strategy distribution data
  const strategyData = Object.entries(marketOverview.strategy_distribution).map(([name, value]) => ({
    name: name.replace('Long ', ''),
    value,
    fullName: name
  }));

  // Score distribution data
  const scoreRanges = [
    { range: '0-20', min: 0, max: 20 },
    { range: '21-40', min: 21, max: 40 },
    { range: '41-60', min: 41, max: 60 },
    { range: '61-80', min: 61, max: 80 },
    { range: '81-100', min: 81, max: 100 }
  ];

  const scoreDistribution = scoreRanges.map(({ range, min, max }) => ({
    range,
    count: opportunities.filter(opp => opp.score >= min && opp.score <= max).length
  }));

  // Risk vs Reward scatter data
  const riskRewardData = opportunities.slice(0, 20).map(opp => ({
    name: `${opp.underlying_symbol} ${opp.strike}`,
    risk: opp.max_loss,
    reward: opp.max_profit === 999999 ? opp.max_loss * 3 : opp.max_profit,
    score: opp.score,
    probability: opp.probability_of_profit
  }));

  // Underlying distribution
  const underlyingCounts = opportunities.reduce((acc, opp) => {
    acc[opp.underlying_symbol] = (acc[opp.underlying_symbol] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const underlyingData = Object.entries(underlyingCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 8)
    .map(([symbol, count]) => ({ symbol, count }));

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

    if (percent < 0.05) return null;

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={12} fontWeight="bold">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Strategy Distribution */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Strategy Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={strategyData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {strategyData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value, name, props) => [
                `${value} opportunities`,
                props.payload.fullName
              ]}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="mt-4 flex flex-wrap gap-2">
          {strategyData.map((item, index) => (
            <div key={item.name} className="flex items-center gap-2 text-sm">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span>{item.name}: {item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Score Distribution */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Score Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={scoreDistribution} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="range" />
            <YAxis />
            <Tooltip 
              formatter={(value) => [`${value} opportunities`, 'Count']}
              labelFormatter={(label) => `Score Range: ${label}`}
            />
            <Bar dataKey="count" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top Underlyings */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Underlyings</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={underlyingData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="symbol" />
            <YAxis />
            <Tooltip 
              formatter={(value) => [`${value} opportunities`, 'Count']}
              labelFormatter={(label) => `Symbol: ${label}`}
            />
            <Bar dataKey="count" fill="#22c55e" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Risk vs Reward Scatter */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk vs Reward (Top 20)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid />
            <XAxis 
              type="number" 
              dataKey="risk" 
              name="Max Loss" 
              unit="$"
              tickFormatter={(value) => `$${(value/1000).toFixed(0)}K`}
            />
            <YAxis 
              type="number" 
              dataKey="reward" 
              name="Max Profit" 
              unit="$"
              tickFormatter={(value) => `$${(value/1000).toFixed(0)}K`}
            />
            <Tooltip 
              cursor={{ strokeDasharray: '3 3' }}
              formatter={(value, name) => [
                name === 'risk' ? `$${value?.toLocaleString()}` : 
                name === 'reward' ? `$${value?.toLocaleString()}` : value,
                name === 'risk' ? 'Max Loss' : 
                name === 'reward' ? 'Max Profit' : name
              ]}
              labelFormatter={(label, payload) => {
                if (payload && payload[0]) {
                  return payload[0].payload.name;
                }
                return label;
              }}
            />
            <Scatter 
              data={riskRewardData} 
              fill="#8b5cf6"
              stroke="#7c3aed"
              strokeWidth={2}
            />
          </ScatterChart>
        </ResponsiveContainer>
        <p className="text-xs text-gray-500 mt-2">
          Each point represents an opportunity. Ideal opportunities are in the bottom-right (low risk, high reward).
        </p>
      </div>
    </div>
  );
}