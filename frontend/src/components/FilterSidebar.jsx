import { useState, useCallback } from 'react';
import { Search, ChevronDown, ChevronUp, FilterX, Loader2 } from 'lucide-react';
import { filterTransactions, searchTransactions } from '../api';

export default function FilterSidebar({ onFilteredRecords, onLoading, onFilterChange }) {
  const [sections, setSections] = useState({
    timePeriod: true,
    transactionType: true,
    paymentStatus: true,
    priority: true,
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    transaction_type: '',
    payment_status: '',
    priority: '',
    date_from: '',
    date_to: '',
  });
  const [loading, setLoading] = useState(false);

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

  const applyFilters = useCallback(async (newFilters, query) => {
    setLoading(true);
    onLoading && onLoading(true);
    try {
      let result;
      if (query && query.trim()) {
        const res = await searchTransactions(query.trim());
        result = res.data || [];
      } else {
        // Remove empty keys before sending
        const cleanFilters = Object.fromEntries(
          Object.entries(newFilters).filter(([_, v]) => v !== '')
        );
        const res = await filterTransactions(cleanFilters);
        result = res.data || [];
      }
      onFilteredRecords(result);
      onFilterChange && onFilterChange(query ? {} : newFilters, query || '');
    } catch (err) {
      console.error('Filter error:', err);
    } finally {
      setLoading(false);
      onLoading && onLoading(false);
    }
  }, [onFilteredRecords, onLoading]);

  const handleSearchChange = (e) => {
    const q = e.target.value;
    setSearchQuery(q);
    if (q.trim().length > 1 || q.trim().length === 0) {
      applyFilters(filters, q);
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    applyFilters(newFilters, searchQuery);
  };

  const handleReset = () => {
    const empty = { transaction_type: '', payment_status: '', priority: '', date_from: '', date_to: '' };
    setFilters(empty);
    setSearchQuery('');
    applyFilters(empty, '');
    onFilterChange && onFilterChange({}, '');
  };

  const RadioItem = ({ id, label, filterKey, value }) => (
    <label htmlFor={id} className="flex items-center gap-3 cursor-pointer group py-1.5">
      <input
        type="radio"
        id={id}
        name={filterKey}
        checked={filters[filterKey] === value}
        onChange={() => handleFilterChange(filterKey, filters[filterKey] === value ? '' : value)}
        className="w-4 h-4 border-gray-300 text-indigo-600 focus:ring-indigo-500/30 cursor-pointer"
      />
      <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">{label}</span>
    </label>
  );

  return (
    <div className="bg-white border text-gray-800 border-gray-200 rounded-2xl shadow-sm p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2 text-sm">
          Filters {loading && <Loader2 className="w-3 h-3 animate-spin text-indigo-500" />}
        </h3>
        <button onClick={handleReset} title="Reset Filters" className="text-gray-400 hover:text-red-500 transition-colors">
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
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search records..."
          className="w-full rounded-lg border border-gray-200 pl-9 pr-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all placeholder-gray-400"
        />
      </div>

      {/* Time Range */}
      <div className="pt-2">
        <SectionHeader title="Time Range" sectionKey="timePeriod" />
        {sections.timePeriod && (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <input
                type="date"
                value={filters.date_from}
                onChange={e => handleFilterChange('date_from', e.target.value)}
                className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 text-gray-700"
                placeholder="From"
              />
              <input
                type="date"
                value={filters.date_to}
                onChange={e => handleFilterChange('date_to', e.target.value)}
                className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 text-gray-700"
                placeholder="To"
              />
            </div>
          </div>
        )}
      </div>

      <hr className="border-gray-100" />

      {/* Transaction Type */}
      <div>
        <SectionHeader title="Transaction Type" sectionKey="transactionType" />
        {sections.transactionType && (
          <div className="space-y-1">
            <RadioItem id="type-inc" label="Income" filterKey="transaction_type" value="Income" />
            <RadioItem id="type-exp" label="Expense" filterKey="transaction_type" value="Expense" />
            <RadioItem id="type-ref" label="Refund" filterKey="transaction_type" value="Refund" />
          </div>
        )}
      </div>

      <hr className="border-gray-100" />

      {/* Payment Status */}
      <div>
        <SectionHeader title="Status Filter" sectionKey="paymentStatus" />
        {sections.paymentStatus && (
          <div className="space-y-1">
            <RadioItem id="stat-paid" label="Paid" filterKey="payment_status" value="Paid" />
            <RadioItem id="stat-pend" label="Pending" filterKey="payment_status" value="Pending" />
          </div>
        )}
      </div>

      <hr className="border-gray-100" />

      {/* Priority */}
      <div>
        <SectionHeader title="Priority" sectionKey="priority" />
        {sections.priority && (
          <div className="space-y-1">
            <RadioItem id="pri-high" label="High Priority" filterKey="priority" value="High" />
            <RadioItem id="pri-med"  label="Medium Priority" filterKey="priority" value="Medium" />
            <RadioItem id="pri-low"  label="Low Priority" filterKey="priority" value="Low" />
          </div>
        )}
      </div>
    </div>
  );
}
