import React from 'react';
import { Info } from 'lucide-react';
import Skeleton from './Skeleton';

const StatCard = ({ label, value, subtext, loading }) => (
  <div className="bg-white border border-gray-200 rounded-lg p-4 min-w-[200px] shadow-sm">
    <div className="flex items-center gap-2 mb-2">
      <span className="text-gray-600 text-sm font-medium">{label}</span>
      <Info size={14} className="text-gray-400" />
    </div>
    
    {loading ? (
      <div className="flex flex-col gap-2 mt-1">
        <Skeleton className="h-7 w-24" />
        <Skeleton className="h-3 w-16" />
      </div>
    ) : (
      <div className="flex flex-col">
        <span className="text-xl font-bold text-gray-900">{value}</span>
        {subtext && <span className="text-xs text-gray-500 font-medium mt-0.5">{subtext}</span>}
      </div>
    )}
  </div>
);

const StatsMetrics = ({ stats, loading }) => {
  
  // --- CONFIGURATION OBJECT ---
  const metricsConfig = [
    {
      label: "Total units sold",
      value: stats?.total_units || 0,
      subtext: null
    },
    {
      label: "Total Amount",
      value: `₹${stats?.total_amount?.toLocaleString() || 0}`,
      subtext: "(19 SRs)" 
    },
    {
      label: "Total Discount",
      value: `₹${stats?.total_discount?.toLocaleString() || 0}`,
      subtext: "(45 SRs)"
    }
  ];

  return (
    <div className="flex gap-4 mb-6 flex-wrap">
      {metricsConfig.map((metric, index) => (
        <StatCard 
          key={index}
          label={metric.label}
          value={metric.value}
          subtext={metric.subtext}
          loading={loading}
        />
      ))}
    </div>
  );
};

export default StatsMetrics;