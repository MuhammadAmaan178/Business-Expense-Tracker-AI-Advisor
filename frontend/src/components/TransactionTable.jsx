import { useState } from 'react';
import { ArrowUpDown, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

const PER_PAGE = 15;

export default function TransactionTable({ records, loading }) {
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(records.length / PER_PAGE);
  const start = (page - 1) * PER_PAGE;
  const pageRecords = records.slice(start, start + PER_PAGE);

  const HeaderCell = ({ label }) => (
    <th className="px-6 py-4 border-b border-gray-200 bg-gray-50 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider group cursor-pointer hover:bg-gray-100 transition-colors">
      <div className="flex items-center gap-2">
        {label}
        <ArrowUpDown className="w-3 h-3 text-gray-400 group-hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </th>
  );

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center py-24 text-gray-400">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        <span className="text-sm">Loading records...</span>
      </div>
    );
  }

  if (!records.length) {
    return (
      <div className="flex-1 flex items-center justify-center py-24 text-gray-400">
        <span className="text-sm">No records found.</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white text-gray-800">
      <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead>
            <tr>
              <HeaderCell label="Date" />
              <HeaderCell label="Type" />
              <HeaderCell label="Category" />
              <HeaderCell label="Vendor" />
              <HeaderCell label="Amount (PKR)" />
              <HeaderCell label="Priority" />
              <HeaderCell label="Status" />
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {pageRecords.map((record, i) => (
              <tr key={i} className="hover:bg-gray-50/50 transition-colors group" style={{ height: '44px' }}>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600 font-medium font-sans">
                  {record.Date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                    record.Transaction_Type === 'Income'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : record.Transaction_Type === 'Refund'
                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                      : 'bg-rose-50 text-rose-700 border-rose-200'
                  }`}>
                    {record.Transaction_Type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">{record.Category}</div>
                  <div className="text-xs text-gray-500 truncate max-w-[150px]">{record.Item_Description}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                  {record.Vendor_Supplier}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`font-mono font-semibold ${record.Transaction_Type === 'Income' ? 'text-emerald-600' : 'text-gray-900'}`}>
                    {record.Transaction_Type === 'Income' ? '+' : ''}
                    Rs {Number(record.Total_Amount).toLocaleString()}
                  </div>
                  <div className="text-[10px] text-gray-400">Tax: Rs {Number(record.Tax_Amount).toLocaleString()}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    record.Priority_Level === 'High'
                      ? 'bg-red-50 text-red-600 border border-red-200'
                      : record.Priority_Level === 'Medium'
                      ? 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                      : 'bg-gray-100 text-gray-600 border border-gray-200'
                  }`}>
                    {record.Priority_Level}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                    record.Payment_Status === 'Paid'
                      ? 'bg-gray-100 text-gray-700'
                      : 'bg-amber-50 text-amber-700 border-amber-200 border'
                  }`}>
                    {record.Payment_Status === 'Paid' ? (
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                    )}
                    {record.Payment_Status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer — pinned at bottom */}
      <div
        className="flex items-center justify-between px-6 border-t border-gray-200 bg-white"
        style={{ flexShrink: 0, padding: '8px 16px' }}
      >
        <div className="text-sm text-gray-500">
          Showing <span className="font-medium text-gray-900">{start + 1}</span> to{' '}
          <span className="font-medium text-gray-900">{Math.min(start + PER_PAGE, records.length)}</span> of{' '}
          <span className="font-medium text-gray-900">{records.length}</span> entries
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-1 border border-gray-200 rounded text-gray-400 hover:bg-gray-50 disabled:opacity-40"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`px-3 py-1 text-sm font-medium rounded border ${
                page === p
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {p}
            </button>
          ))}
          {totalPages > 5 && <span className="px-2 text-gray-400">...</span>}
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-1 border border-gray-200 rounded text-gray-600 hover:bg-gray-50 disabled:opacity-40"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
