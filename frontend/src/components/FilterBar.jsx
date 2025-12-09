import React from "react";
import { RefreshCw, ChevronDown } from "lucide-react";
import MultiSelect from "./MultiSelect";
import DateRangeFilter from "./DateRangeFilter";

const FilterBar = ({ filters, options, onFilterChange, onReset }) => {
  
  const handleMultiChange = (name, newValue) => {
    onFilterChange(name, newValue);
  };

  const handleDateRangeChange = (start, end) => {
    onFilterChange("startDate", start);
    onFilterChange("endDate", end);
    if (start || end) onFilterChange("date", "");
  };

  // --- CONFIGURATION OBJECT ---
  // This makes the code Scalable & DRY (Don't Repeat Yourself).
  // To add a new filter, just add one line here.
  const filterConfig = [
    { 
      name: "region", 
      label: "Region", 
      options: options?.regions 
    },
    { 
      name: "gender", 
      label: "Gender", 
      options: ["Male", "Female"] 
    },
    { 
      name: "age", 
      label: "Age Range", 
      options: ["18-25", "26-35", "36-45", "46+"] 
    },
    { 
      name: "category", 
      label: "Category", 
      options: options?.categories 
    },
    { 
      name: "tags", 
      label: "Tags", 
      options: options?.tags 
    },
    { 
      name: "paymentMethod", 
      label: "Payment", 
      options: options?.paymentMethods 
    }
  ];

  return (
    <div className="flex flex-wrap items-center gap-3 mb-6">
      {/* Reset Button */}
      <button
        onClick={onReset}
        className="p-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors shrink-0"
        title="Reset Filters"
      >
        <RefreshCw size={16} />
      </button>

      {/* --- DYNAMIC RENDER LOOP --- */}
      {filterConfig.map((field) => (
        <MultiSelect
          key={field.name}
          label={field.label}
          options={field.options}
          value={filters[field.name]}
          onChange={(val) => handleMultiChange(field.name, val)}
        />
      ))}

      {/* Date Range & Sort are structurally different, so we keep them separate */}
      <DateRangeFilter
        startDate={filters.startDate}
        endDate={filters.endDate}
        onChange={handleDateRangeChange}
      />

      {/* Sort Dropdown */}
      <div className="ml-auto flex items-center gap-2 shrink-0">
        <span className="text-gray-500 text-sm whitespace-nowrap">Sort by:</span>
        <div className="relative">
          <select
            className="appearance-none bg-transparent font-semibold text-gray-700 text-sm pr-6 focus:outline-none cursor-pointer whitespace-nowrap"
            onChange={(e) => onFilterChange("sortBy", e.target.value)}
          >
            <option value="name_asc">Customer Name (A-Z)</option>
            <option value="date_desc">Date (Newest)</option>
            <option value="quantity_desc">Quantity (High-Low)</option>
          </select>
          <ChevronDown
            className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
            size={14}
          />
        </div>
      </div>
    </div>
  );
};

export default FilterBar;