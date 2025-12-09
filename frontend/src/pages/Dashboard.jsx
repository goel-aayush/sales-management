import React, { useState, useEffect } from "react";
import { useSalesData } from "../hooks/useSalesData";
import { fetchFilterOptions } from "../services/api";
import StatsMetrics from "../components/StatsMetrics";
import FilterBar from "../components/FilterBar";
import SalesTable from "../components/SalesTable";
import Sidebar from "../components/SideBar";
import { Search } from "lucide-react";

const Dashboard = () => {
  // --- State Management ---
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({}); 
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("date_desc");

  
  const [options, setOptions] = useState({
    regions: [],
    categories: [],
    paymentMethods: [],
    tags: [],
  });

  
  // It automatically re-runs whenever filters, page, sort, or search changes.
  const { data, stats, loading, totalPages } = useSalesData(
    filters,
    page,
    sort,
    search
  );

  // Load the filter options (Regions, Categories, etc.) once when the page first mounts.
  // This allows the dropdowns to be dynamic based on actual DB data.
  useEffect(() => {
    const loadOptions = async () => {
      const result = await fetchFilterOptions();
      if (result && result.success) {
        setOptions(result.data);
      }
    };
    loadOptions();
  }, []);

  // Handler: Updates a specific filter.
  const handleFilterChange = (name, value) => {
    if (name === "sortBy") {
      setSort(value);
    } else {
      setFilters((prev) => ({ ...prev, [name]: value }));
      setPage(1); 
    }
  };

  // Reset Button: Clears everything back to the default state.
  const handleReset = () => {
    setFilters({});
    setSearch("");
    setSort("date_desc");
    setPage(1);
  };

  // --- Pagination Logic: Batch Method ---
  // This prevents the UI from "jumping" under the user's mouse when clicking Next.
  const getPageNumbers = () => {
    if (totalPages <= 1) return [1];

    
    const start = Math.floor((page - 1) / 5) * 5 + 1;
    
    
    const end = Math.min(totalPages, start + 4);

    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex min-h-screen bg-[#F9FAFB]">
      {/* Navigation Sidebar */}
      <Sidebar />

      {/* Main Layout Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Top Header with Search */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shrink-0">
          <h2 className="text-xl font-semibold text-gray-800">
            Sales Management System
          </h2>

          <div className="relative group">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors"
              size={18}
            />
            <input
              type="text"
              placeholder="Search Name, Phone no."
              className="pl-10 pr-4 py-2 bg-gray-100 border-none rounded-full w-80 text-sm focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </header>

        {/* Scrollable Content Container */}
        <main className="flex-1 p-8 overflow-y-auto">
          
          {/* 1. Filters (Top of Page) */}
          <FilterBar
            filters={filters}
            options={options}
            onFilterChange={handleFilterChange}
            onReset={handleReset}
          />

          {/* 2. Key Metrics Cards */}
          <StatsMetrics stats={stats} loading={loading} />

          {/* 3. Data Grid with Loading Skeleton */}
          <SalesTable data={data} loading={loading} />

          {/* 4. Pagination Controls */}
          {totalPages > 0 && (
            <div className="flex justify-center items-center mt-8 gap-4 pb-8">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-4 py-2 border border-gray-200 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>

              <div className="flex gap-2">
                {getPageNumbers().map((pNum) => (
                  <button
                    key={pNum}
                    onClick={() => setPage(pNum)}
                    className={`w-8 h-8 flex items-center justify-center rounded-md text-xs font-medium transition-colors ${
                      page === pNum
                        ? "bg-black text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {pNum}
                  </button>
                ))}
              </div>

              <button
                // Disable 'Next' if we are on the last page OR if the API returned 0 pages
                disabled={page >= totalPages || totalPages === 0}
                onClick={() => setPage((p) => p + 1)}
                className="px-4 py-2 border border-gray-200 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;