import React from 'react';
import { Copy } from 'lucide-react';
import Skeleton from './Skeleton';

const SalesTable = ({ data, loading }) => {
  // Check if we have no data AND we are not loading
  const showNoResults = !loading && (!data || data.length === 0);

  // Helper to render Skeleton Rows
  const renderSkeletonRows = () => {
    return [...Array(10)].map((_, i) => (
      <tr key={i} className="border-b border-gray-50 last:border-none">
        <td className="py-4 px-4"><Skeleton className="h-4 w-12" /></td>
        <td className="py-4 px-4"><Skeleton className="h-4 w-24" /></td>
        <td className="py-4 px-4"><Skeleton className="h-4 w-20" /></td>
        <td className="py-4 px-4"><Skeleton className="h-4 w-32" /></td>
        <td className="py-4 px-4"><Skeleton className="h-4 w-28" /></td>
        <td className="py-4 px-4"><Skeleton className="h-4 w-16" /></td>
        <td className="py-4 px-4"><Skeleton className="h-4 w-8" /></td>
        <td className="py-4 px-4"><Skeleton className="h-4 w-24" /></td>
        <td className="py-4 px-4"><Skeleton className="h-4 w-10" /></td>
      </tr>
    ));
  };

  return (
    <div className="bg-white border-t border-gray-200 relative min-h-[400px]">
      
      {showNoResults && (
        <div className="p-10 text-center text-gray-500">
           No results found.
        </div>
      )}

      {/* Only render table if we have results OR if we are loading */}
      {(!showNoResults) && (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="py-4 px-4 text-xs font-semibold text-gray-500 uppercase">Transaction ID</th>
                <th className="py-4 px-4 text-xs font-semibold text-gray-500 uppercase">Date</th>
                <th className="py-4 px-4 text-xs font-semibold text-gray-500 uppercase">Customer ID</th>
                <th className="py-4 px-4 text-xs font-semibold text-gray-500 uppercase">Customer name</th>
                <th className="py-4 px-4 text-xs font-semibold text-gray-500 uppercase">Phone Number</th>
                <th className="py-4 px-4 text-xs font-semibold text-gray-500 uppercase">Gender</th>
                <th className="py-4 px-4 text-xs font-semibold text-gray-500 uppercase">Age</th>
                <th className="py-4 px-4 text-xs font-semibold text-gray-500 uppercase">Category</th>
                <th className="py-4 px-4 text-xs font-semibold text-gray-500 uppercase">Quantity</th>
              </tr>
            </thead>
            <tbody>
              {loading 
                ? renderSkeletonRows() 
                : (data || []).map((row, i) => (
                    <tr key={i} className="hover:bg-gray-50 border-b border-gray-50 transition-colors last:border-none">
                      <td className="py-4 px-4 text-gray-500 text-sm">{row.transaction_id}</td>
                      <td className="py-4 px-4 text-gray-500 text-sm">{new Date(row.date).toLocaleDateString()}</td>
                      <td className="py-4 px-4 text-gray-900 font-medium text-sm">{row.cust_id}</td>
                      <td className="py-4 px-4 text-gray-900 font-medium text-sm">{row.customer_name}</td>
                      <td className="py-4 px-4 text-gray-500 text-sm flex items-center gap-2">
                        {row.phone}
                        <Copy size={14} className="text-gray-400 cursor-pointer hover:text-gray-600" />
                      </td>
                      <td className="py-4 px-4 text-gray-900 text-sm font-medium">{row.gender}</td>
                      <td className="py-4 px-4 text-gray-900 text-sm">{row.age}</td>
                      <td className="py-4 px-4 text-gray-900 font-bold text-sm">{row.category}</td>
                      <td className="py-4 px-4 text-gray-900 font-bold text-sm">
                         {String(row.quantity).padStart(2, '0')}
                      </td>
                    </tr>
                  ))
              }
            </tbody>
          </table>
      )}
    </div>
  );
};

export default SalesTable;