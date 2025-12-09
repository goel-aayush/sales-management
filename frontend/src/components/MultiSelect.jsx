import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

const MultiSelect = ({ label, options = [], value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);
  const selectedValues = value ? value.split(',') : [];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleOption = (option) => {
    let newValues;
    if (selectedValues.includes(option)) {
      newValues = selectedValues.filter(v => v !== option);
    } else {
      newValues = [...selectedValues, option];
    }
    onChange(newValues.join(','));
  };

  return (
    <div className="relative inline-block" ref={wrapperRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        // CHANGED: Removed 'min-w-[150px]', added 'whitespace-nowrap'
        className={`flex items-center justify-between gap-2 px-3 py-2 text-sm font-medium rounded-md border transition-colors whitespace-nowrap
          ${selectedValues.length > 0 
            ? 'bg-blue-50 border-blue-200 text-blue-700' 
            : 'bg-gray-100 border-transparent text-gray-700 hover:bg-gray-200'
          }`}
      >
        <span className="truncate max-w-[150px]">
          {selectedValues.length > 0 ? `${label} (${selectedValues.length})` : label}
        </span>
        <ChevronDown size={14} className={`transition-transform shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-100 rounded-lg shadow-xl z-50 overflow-hidden">
          <div className="max-h-60 overflow-y-auto py-1">
            {options.map((opt) => {
              const isSelected = selectedValues.includes(opt);
              return (
                <div
                  key={opt}
                  onClick={() => toggleOption(opt)}
                  className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer select-none"
                >
                  <div className={`w-4 h-4 rounded border flex items-center justify-center mr-3 shrink-0
                    ${isSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}
                  >
                    {isSelected && <Check size={10} className="text-white" />}
                  </div>
                  <span className={`text-sm ${isSelected ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                    {opt}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiSelect;