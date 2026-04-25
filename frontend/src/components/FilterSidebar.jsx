import { useState } from 'react';
import { Search, ChevronDown, ChevronUp, FilterX } from 'lucide-react';

export default function FilterSidebar() {
  const [sections, setSections] = useState({
    timePeriod: true,
    transactionType: true,
    paymentStatus: true,
    priority: true,
  });

  const toggleSection = (section) => {
    setSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const SectionHeader = ({ title, sectionKey }) => (
    <div 
      onClick={() => toggleSection(sectionKey)}
      className="flex items-center justify-between w-full py-3 cursor-pointer group text-sm font-semibold text-gray-700 hover:text-indigo-600 transition-colors"
    >
      <span className="uppercase tracking-wider text-[11px]">{title}</span>
      {sections[sectionKey] ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
    </div>
  );

  const CheckboxItem = ({ id, label, defaultChecked = false, badge }) => (
    <label htmlFor={id} className="flex items-center justify-between cursor-pointer group py-1.5">
      <div className="flex items-center gap-3">
        <div className="relative flex items-center">
          <input 
            type="checkbox" 
            id={id} 
            defaultChecked={defaultChecked}
            className="w-4 h-4 border-gray-300 rounded text-indigo-600 focus:ring-indigo-500/30 cursor-pointer transition-all"
          />
        </div>
        <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">{label}</span>
      </div>
      {badge && <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${badge}`}>{badge.label}</span>}
    </label>
  );

  return (
    <div className="bg-white border text-gray-800 border-gray-200 rounded-2xl shadow-sm p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2 text-sm">
          Filters
        </h3>
        <button className="text-gray-400 hover:text-gray-600 transition-colors">
          <FilterX className="w-4 h-4" />
        </button>
      </div>

      {/* Search */}
      <div className="relative pt-2">
        <div className="absolute inset-y-0 top-2 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search records..."
          className="w-full rounded-lg border border-gray-200 pl-9 pr-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all placeholder-gray-400"
        />
      </div>

      {/* Time Period */}
      <div className="pt-2">
        <SectionHeader title="Time Range" sectionKey="timePeriod" />
        {sections.timePeriod && (
          <div className="space-y-1">
            <div className="grid grid-cols-2 gap-2 mb-3">
              <button className="px-3 py-1.5 text-xs font-medium rounded border border-indigo-200 bg-indigo-50 text-indigo-700">Today</button>
              <button className="px-3 py-1.5 text-xs font-medium rounded border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 transition-colors">This Week</button>
            </div>
            <CheckboxItem id="t-month" label="This Month" defaultChecked />
            <CheckboxItem id="t-year" label="This Year" />
          </div>
        )}
      </div>

      <hr className="border-gray-100" />

      {/* Transaction Type */}
      <div>
        <SectionHeader title="Transaction Type" sectionKey="transactionType" />
        {sections.transactionType && (
          <div className="space-y-1">
            <CheckboxItem id="type-inc" label="Income" />
            <CheckboxItem id="type-exp" label="Expense" defaultChecked />
          </div>
        )}
      </div>

      <hr className="border-gray-100" />

      {/* Payment Status */}
      <div>
        <SectionHeader title="Status Filter" sectionKey="paymentStatus" />
        {sections.paymentStatus && (
          <div className="space-y-1">
            <CheckboxItem id="stat-paid" label="Completed" defaultChecked badge={{ label: '42', className: 'bg-gray-100 text-gray-600' }} />
            <CheckboxItem id="stat-pend" label="Pending" badge={{ label: '2', className: 'bg-amber-100 text-amber-700' }} />
            <CheckboxItem id="stat-fail" label="Failed" />
          </div>
        )}
      </div>

      <hr className="border-gray-100" />

      {/* Priority */}
      <div>
        <SectionHeader title="Priority" sectionKey="priority" />
        {sections.priority && (
          <div className="space-y-1">
            <CheckboxItem id="pri-high" label="High Priority" defaultChecked />
            <CheckboxItem id="pri-low" label="Low Priority" />
          </div>
        )}
      </div>

    </div>
  );
}
