import { Download, Plus } from 'lucide-react';
import FilterSidebar from './FilterSidebar';
import TransactionTable from './TransactionTable';

export default function RecordsView({ activeRecords, analysis }) {
  const safeAnalysis = analysis || {
    total_turnover: 0,
    total_tax_collected: 0,
    paid_count: 0,
    pending_count: 0
  };

  return (
    <div className="flex flex-col h-full w-full max-w-7xl mx-auto font-sans text-slate-800">
      
      {/* Top Header & Actions */}
      <div className="flex items-center justify-between px-8 py-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Financial Records</h2>
          <p className="text-sm text-gray-500 mt-1">Managing {activeRecords.length} total transactions</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors text-gray-700 shadow-sm">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm focus:ring-4 focus:ring-emerald-500/20">
            <Plus className="w-4 h-4" />
            Add Transaction
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-8 mb-6">
        <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-5 shadow-sm">
          <p className="text-xs font-bold text-emerald-800 uppercase tracking-widest mb-1.5 opacity-80">Total Turnover</p>
          <h3 className="text-2xl font-bold text-emerald-600">Rs {safeAnalysis.total_turnover.toLocaleString()}</h3>
        </div>
        <div className="bg-rose-50/50 border border-rose-100 rounded-xl p-5 shadow-sm">
          <p className="text-xs font-bold text-rose-800 uppercase tracking-widest mb-1.5 opacity-80">Total Tax Collected</p>
          <h3 className="text-2xl font-bold text-rose-500">Rs {safeAnalysis.total_tax_collected.toLocaleString()}</h3>
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
      <div className="flex flex-1 overflow-hidden px-8 pb-8 gap-6">
        <div className="w-64 shrink-0 overflow-y-auto pr-2 pb-4">
          <FilterSidebar />
        </div>
        <div className="flex-1 overflow-hidden bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col">
          <TransactionTable records={activeRecords} />
        </div>
      </div>

    </div>
  );
}
