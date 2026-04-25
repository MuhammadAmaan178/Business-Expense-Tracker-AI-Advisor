import { Zap, Info, ShieldCheck, Sparkles, Loader2, PieChart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { fetchAIAdvice } from '../api';

export default function RealTimeSummary({ baseAmount, taxAmount, totalAmount, isIncome, description, category }) {
  const isHighPriority = totalAmount > 50000;
  const [advice, setAdvice] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Only fetch advice if we have enough context
    if (totalAmount > 0 && category) {
      const getAdvice = async () => {
        setLoading(true);
        try {
          const res = await fetchAIAdvice(`Transaction of ${totalAmount} for ${category}. Details: ${description}`);
          setAdvice(res.data);
        } catch (err) {
          setAdvice('Error loading AI insights.');
        } finally {
          setLoading(false);
        }
      };
      // Debounce slightly to avoid spamming while typing
      const timeout = setTimeout(getAdvice, 1000);
      return () => clearTimeout(timeout);
    } else {
      setAdvice('Enter amount and category to generate AI insights.');
    }
  }, [totalAmount, category, description]);

  return (
    <div className="bg-[#111827] rounded-2xl shadow-xl flex flex-col overflow-hidden text-gray-300 font-sans border border-gray-800">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800 bg-gray-900/50">
        <div className="flex items-center gap-3 text-white">
          <PieChart className="w-5 h-5 text-indigo-400" />
          <h3 className="font-medium text-sm tracking-wide">Real-time Summary</h3>
        </div>
        <div className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${isHighPriority ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'}`}>
          {isHighPriority ? 'High' : 'Low'} Priority
        </div>
      </div>

      {/* Break down */}
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-400">Base Amount</span>
          <span className="font-mono text-white">PKR {baseAmount.toLocaleString('en-PK', { minimumFractionDigits: 2 })}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-400">Tax (18%)</span>
          <span className={`font-mono ${isIncome ? 'text-emerald-400' : 'text-rose-400'}`}>
            {isIncome ? '+' : '+'} PKR {taxAmount.toLocaleString('en-PK', { minimumFractionDigits: 2 })}
          </span>
        </div>
        
        <hr className="border-gray-800 my-2" />
        
        <div className="flex justify-between items-end">
          <span className="text-base font-medium text-white mb-1">Total Amount</span>
          <span className={`text-2xl font-bold font-mono tracking-tight ${isIncome ? 'text-emerald-400' : 'text-rose-400'}`}>
            PKR {totalAmount.toLocaleString('en-PK', { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* AI Suggestion Box */}
      <div className="p-4 mx-4 mb-4 mt-auto rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 relative overflow-hidden group hover:border-indigo-500/40 transition-colors">
        <div className="absolute top-0 right-0 p-3 opacity-10 transform translate-x-2 -translate-y-2 group-hover:scale-110 transition-transform">
          <Sparkles className="w-16 h-16 text-indigo-400" />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2 text-indigo-300">
            <Sparkles className="w-4 h-4" />
            <h4 className="text-xs font-semibold uppercase tracking-wider">AI Insight</h4>
          </div>
          <p className="text-sm text-indigo-100/70 leading-relaxed min-h-[60px]">
            {loading ? <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Analyzing data...</span> : advice}
          </p>
        </div>
      </div>
    </div>
  );
}
