import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';

const DateRangeFilter = ({ startDate, endDate, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  const [localStart, setLocalStart] = useState(startDate || '');
  const [localEnd, setLocalEnd] = useState(endDate || '');

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleApply = () => {
    onChange(localStart, localEnd);
    setIsOpen(false);
  };

  const handleClear = () => {
    setLocalStart('');
    setLocalEnd('');
    onChange('', '');
    setIsOpen(false);
  };

  const hasSelection = startDate && endDate;

  // --- CONFIGURATION OBJECT ---
  // This makes the UI scalable. Need a 3rd date? Just add it here.
  const inputFields = [
    {
      label: 'From',
      value: localStart,
      onChange: (e) => setLocalStart(e.target.value),
      min: undefined // No constraint for start date
    },
    {
      label: 'To',
      value: localEnd,
      onChange: (e) => setLocalEnd(e.target.value),
      min: localStart // Constraint: cannot be before start date
    }
  ];

  return (
    <div className="relative inline-block" ref={wrapperRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md border transition-colors min-w-[150px]
          ${hasSelection 
            ? 'bg-blue-50 border-blue-200 text-blue-700' 
            : 'bg-gray-100 border-transparent text-gray-700 hover:bg-gray-200'
          }`}
      >
        <Calendar size={14} />
        <span className="truncate">
          {hasSelection ? `${startDate} - ${endDate}` : 'Select Dates'}
        </span>
        <ChevronDown size={14} />
      </button>

      {/* Dropdown Popover */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 p-4 bg-white border border-gray-100 rounded-lg shadow-xl z-50 w-72">
          <div className="flex flex-col gap-3">
            
            {/* Dynamic Input Rendering */}
            {inputFields.map((field) => (
              <div key={field.label}>
                <label className="block text-xs font-semibold text-gray-500 mb-1">
                  {field.label}
                </label>
                <input 
                  type="date" 
                  value={field.value}
                  min={field.min}
                  onChange={field.onChange}
                  className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            ))}

            {/* Actions Footer */}
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50">
              <button 
                onClick={handleClear}
                className="text-xs text-red-500 hover:text-red-700 font-medium"
              >
                Clear
              </button>
              <button 
                onClick={handleApply}
                disabled={!localStart || !localEnd}
                className="bg-black text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
              >
                Apply Range
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangeFilter;