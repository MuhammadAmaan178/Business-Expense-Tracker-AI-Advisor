import { PieChart } from 'lucide-react';

export default function RealTimeSummary({ baseAmount, taxAmount, totalAmount, isIncome }) {
  const isHighPriority = totalAmount > 50000;

  return (
    <div className="bg-[#111827] rounded-2xl shadow-xl flex flex-col overflow-hidden text-gray-300 font-sans border border-gray-800">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800 bg-gray-900/50">
        <div className="flex items-center gap-3 text-white">
          <PieChart className="w-5 h-5 text-indigo-400" />
          <h3 className="font-medium text-sm tracking-wide">Real-time Summary</h3>
        </div>
        <div className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
          isHighPriority
            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
        }`}>
          {isHighPriority ? 'High' : 'Low'} Priority
        </div>
      </div>

      {/* Breakdown */}
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-400">Base Amount</span>
          <span className="font-mono text-white">
            PKR {baseAmount.toLocaleString('en-PK', { minimumFractionDigits: 2 })}
          </span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-400">Tax (18% GST)</span>
          <span className={`font-mono ${isIncome ? 'text-emerald-400' : 'text-rose-400'}`}>
            + PKR {taxAmount.toLocaleString('en-PK', { minimumFractionDigits: 2 })}
          </span>
        </div>

        <hr className="border-gray-800 my-2" />

        <div className="flex justify-between items-end">
          <span className="text-base font-medium text-white mb-1">Total Amount</span>
          <span className={`text-2xl font-bold font-mono tracking-tight ${isIncome ? 'text-emerald-400' : 'text-rose-400'}`}>
            PKR {totalAmount.toLocaleString('en-PK', { minimumFractionDigits: 2 })}
          </span>
        </div>

        {/* Priority info */}
        <div className={`mt-4 rounded-xl px-4 py-3 text-xs ${
          isHighPriority
            ? 'bg-rose-500/10 border border-rose-500/20 text-rose-300'
            : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-300'
        }`}>
          {isHighPriority
            ? '⚠ This transaction exceeds PKR 50,000 and will be marked High Priority.'
            : '✓ This transaction will be auto-categorized by the backend.'}
        </div>
      </div>
    </div>
  );
}
