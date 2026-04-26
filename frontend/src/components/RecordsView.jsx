import { useState } from 'react';
import { Download, Plus } from 'lucide-react';
import FilterSidebar from './FilterSidebar';
import TransactionTable from './TransactionTable';
import AIInsightPanel from './AIInsightPanel';

export default function RecordsView({ activeRecords, analysis, setRecords, onAddClick }) {
  const [tableLoading, setTableLoading] = useState(false);
  const [displayRecords, setDisplayRecords] = useState(null);

  // Track current active filters for AI panel
  const [activeFilters, setActiveFilters] = useState({});
  const [activeSearch, setActiveSearch] = useState('');

  const safeAnalysis = analysis || {
    total_turnover: 0,
    total_tax_collected: 0,
    paid_count: 0,
    pending_count: 0
  };

  const handleFilteredRecords = (records) => setDisplayRecords(records);
  const handleLoading = (val) => setTableLoading(val);
  const handleFilterChange = (filters, search) => {
    setActiveFilters(filters);
    setActiveSearch(search);
  };

  // Build human-readable context label for AI
  const buildFilterContext = () => {
    if (activeSearch) return `Search: "${activeSearch}"`;
    const parts = Object.entries(activeFilters)
      .filter(([_, v]) => v !== '')
      .map(([k, v]) => `${k.replace(/_/g, ' ')}: ${v}`);
    return parts.length > 0 ? parts.join(' | ') : 'All Data';
  };

  const handleExport = () => {
    const records = displayRecords ?? activeRecords;
    if (!records.length) return;
    const headers = Object.keys(records[0]).join(',');
    const rows = records.map(r => Object.values(r).join(',')).join('\n');
    const blob = new Blob([headers + '\n' + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transactions.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const shownRecords = displayRecords !== null ? displayRecords : activeRecords;

  return (
    <div className="flex flex-col h-full w-full max-w-7xl mx-auto font-sans text-slate-800">

      {/* Top Header & Actions */}
      <div className="flex items-center justify-between px-8 py-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Financial Records</h2>
          <p className="text-sm text-gray-500 mt-1">
            {tableLoading
              ? 'Filtering...'
              : `Showing ${shownRecords.length} of ${activeRecords.length} total transactions`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors text-gray-700 shadow-sm"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button
            onClick={onAddClick}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm focus:ring-4 focus:ring-emerald-500/20"
          >
            <Plus className="w-4 h-4" />
            Add Transaction
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-8 mb-6">
        <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-5 shadow-sm">
          <p className="text-xs font-bold text-emerald-800 uppercase tracking-widest mb-1.5 opacity-80">Total Turnover</p>
          <h3 className="text-2xl font-bold text-emerald-600">
            Rs {Number(safeAnalysis.total_turnover).toLocaleString()}
          </h3>
        </div>
        <div className="bg-rose-50/50 border border-rose-100 rounded-xl p-5 shadow-sm">
          <p className="text-xs font-bold text-rose-800 uppercase tracking-widest mb-1.5 opacity-80">Total Tax Collected</p>
          <h3 className="text-2xl font-bold text-rose-500">
            Rs {Number(safeAnalysis.total_tax_collected).toLocaleString()}
          </h3>
        </div>
        <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-5 shadow-sm">
          <p className="text-xs font-bold text-blue-800 uppercase tracking-widest mb-1.5 opacity-80">Paid Transactions</p>
          <h3 className="text-2xl font-bold text-blue-600">{safeAnalysis.paid_count}</h3>
        </div>
        <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-5 shadow-sm">
          <p className="text-xs font-bold text-amber-800 uppercase tracking-widest mb-1.5 opacity-80">Pending Payments</p>
          <h3 className="text-2xl font-bold text-amber-500">{safeAnalysis.pending_count}</h3>
        </div>
      </div>

      {/* Main Content Layout (Sidebar + Table) */}
      <div
        className="px-8 gap-6"
        style={{ height: 'calc(100vh - 280px)', display: 'flex' }}
      >
        <div style={{ width: '220px', minWidth: '220px', overflowY: 'auto', height: '100%' }}>
          <FilterSidebar
            onFilteredRecords={handleFilteredRecords}
            onLoading={handleLoading}
            onFilterChange={handleFilterChange}
          />
        </div>
        <div
          className="bg-white border border-gray-200 rounded-2xl shadow-sm"
          style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}
        >
          <TransactionTable records={shownRecords} loading={tableLoading} />
        </div>
      </div>

      {/* AI Insight Panel — below the table */}
      <div className="px-8 pb-8">
        <AIInsightPanel
          filterParams={activeFilters}
          filterContext={buildFilterContext()}
        />
      </div>

    </div>
  );
}
