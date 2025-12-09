import React from 'react';
import { 
  LayoutGrid, 
  Users, 
  FileText, 
  PlayCircle, 
  Columns, 
  XCircle, 
  CheckCircle, 
  FileCheck, 
  ChevronDown, 
  ChevronUp 
} from 'lucide-react';

const Sidebar = () => {
  return (
    <div className="w-64 bg-[#F3F4F6] text-gray-600 flex flex-col h-screen font-sans border-r border-gray-200 shrink-0 p-4">
      
      {/* 1. HEADER */}
      <div className="bg-white border border-gray-200 rounded-xl p-3 flex items-center justify-between mb-6 shadow-sm cursor-pointer">
        <div className="flex items-center gap-3">
          
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
           
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
               <path d="M3 3L10 21L17 3" stroke="#3B82F6" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
               <path d="M14 3L21 21" stroke="#1D4ED8" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-900 font-bold text-sm leading-tight">Vault</span>
            <span className="text-gray-500 text-xs">Anurag Yadav</span>
          </div>
        </div>
        <ChevronDown size={16} className="text-gray-400" />
      </div>

      {/* 2. MAIN NAV ITEMS (Dashboard, Nexus, Intake) */}
      <div className="space-y-1 mb-6 px-2">
        <div className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors">
          <LayoutGrid size={20} />
          <span className="font-medium text-sm">Dashboard</span>
        </div>
        <div className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors">
          <Users size={20} />
          <span className="font-medium text-sm">Nexus</span>
        </div>
        <div className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors">
          <PlayCircle size={20} />
          <span className="font-medium text-sm">Intake</span>
        </div>
      </div>

      {/* 3. SERVICES CARD (White Box) */}
      <div className="bg-white rounded-xl p-2 shadow-sm border border-gray-100 mb-4">
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-2 text-gray-500 mb-1 cursor-pointer">
           <div className="flex items-center gap-2">
             <FileText size={18} />
             <span className="font-semibold text-sm">Services</span>
           </div>
           <ChevronUp size={16} />
        </div>

        {/* List */}
        <div className="space-y-0.5">
           <div className="flex items-center gap-3 px-3 py-2 text-gray-500 hover:bg-gray-50 rounded-lg cursor-pointer pl-9">
              <PlayCircle size={16} />
              <span className="text-sm">Pre-active</span>
           </div>
           <div className="flex items-center gap-3 px-3 py-2 text-gray-500 hover:bg-gray-50 rounded-lg cursor-pointer pl-9">
              <Columns size={16} />
              <span className="text-sm">Active</span>
           </div>
           <div className="flex items-center gap-3 px-3 py-2 text-gray-500 hover:bg-gray-50 rounded-lg cursor-pointer pl-9">
              <XCircle size={16} />
              <span className="text-sm">Blocked</span>
           </div>
           <div className="flex items-center gap-3 px-3 py-2 text-gray-500 hover:bg-gray-50 rounded-lg cursor-pointer pl-9">
              <CheckCircle size={16} />
              <span className="text-sm">Closed</span>
           </div>
        </div>
      </div>

      {/* 4. INVOICES CARD (White Box) */}
      <div className="bg-white rounded-xl p-2 shadow-sm border border-gray-100 flex-1">
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-2 text-gray-500 mb-1 cursor-pointer">
           <div className="flex items-center gap-2">
             <FileCheck size={18} />
             <span className="font-semibold text-sm">Invoices</span>
           </div>
           <ChevronUp size={16} />
        </div>

        {/* List */}
        <div className="space-y-0.5">
           {/* Active State Example: Proforma Invoices */}
           <div className="flex items-center gap-3 px-3 py-2 bg-gray-50 text-black rounded-lg cursor-pointer pl-9">
              <FileText size={16} />
              <span className="text-sm font-bold">Proforma Invoices</span>
           </div>
           <div className="flex items-center gap-3 px-3 py-2 text-gray-500 hover:bg-gray-50 rounded-lg cursor-pointer pl-9">
              <FileCheck size={16} />
              <span className="text-sm">Final Invoices</span>
           </div>
        </div>
      </div>

    </div>
  );
};

export default Sidebar;