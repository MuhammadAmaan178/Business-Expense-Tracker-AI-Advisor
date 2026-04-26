import { useState } from 'react';
import { Sparkles, Loader2, TrendingUp, BarChart2, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { fetchAIAdvice, fetchFilteredAnalysis } from '../api';

function renderAIResponse(text) {
  if (!text) return null;
  // Split on lines that look like ALL-CAPS section headers (4+ uppercase letters/spaces)
  const sections = text.split(/\n(?=[A-Z][A-Z ]{3,}\n?)/).filter(Boolean);

  return sections.map((section, i) => {
    const lines = section.trim().split('\n').filter(Boolean);
    const header = lines[0];
    const points = lines.slice(1);

    return (
      <div key={i} style={{ marginBottom: '20px' }}>
        <div style={{
          color: '#7C3AED',
          fontWeight: '700',
          fontSize: '11px',
          letterSpacing: '1.5px',
          textTransform: 'uppercase',
          marginBottom: '8px',
          paddingBottom: '4px',
          borderBottom: '1px solid rgba(124,58,237,0.3)'
        }}>
          {header}
        </div>
        {points.map((point, j) => (
          <div key={j} style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '6px',
            fontSize: '13px',
            lineHeight: '1.6',
            color: '#E2E8F0'
          }}>
            <span style={{ color: '#7C3AED', marginTop: '2px', flexShrink: 0 }}>›</span>
            <span>{point.replace(/^-\s*/, '')}</span>
          </div>
        ))}
      </div>
    );
  });
}

export default function AIInsightPanel({ filterParams, filterContext }) {
  const [advice, setAdvice] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showStats, setShowStats] = useState(true);
  const [fetched, setFetched] = useState(false);

  const fmt = (n) =>
    `Rs ${Number(n).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

  const handleGetInsights = async () => {
    setLoading(true);
    setFetched(true);
    try {
      // Step 1: Get NumPy analysis of current filtered data
      const cleanParams = Object.fromEntries(
        Object.entries(filterParams || {}).filter(([_, v]) => v !== '')
      );
      const anaRes = await fetchFilteredAnalysis(cleanParams);
      const ana = anaRes.data;
      setAnalysis(ana);

      // Step 2: Send analysis to Groq via /api/ai-advice
      const aiRes = await fetchAIAdvice(
        filterContext || 'All Data',
        cleanParams
      );
      setAdvice(aiRes.data || 'No advice returned.');
    } catch (err) {
      setAdvice('Failed to fetch AI insights. Make sure GROQ_API_KEY is set in .env');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0f1117] border border-gray-800 rounded-2xl overflow-hidden text-gray-300 font-sans shadow-xl mt-6">

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-gray-900/60">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-500/20 p-1.5 rounded-lg">
            <Sparkles className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">AI Insights</h3>
            <p className="text-[10px] text-gray-500">
              Context: <span className="text-indigo-400">{filterContext || 'All Data'}</span>
            </p>
          </div>
        </div>
        <button
          onClick={handleGetInsights}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition-all focus:ring-4 focus:ring-indigo-500/30"
        >
          {loading
            ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Analyzing...</>
            : <><RefreshCw className="w-3.5 h-3.5" /> {fetched ? 'Refresh Insights' : 'Get AI Insights'}</>
          }
        </button>
      </div>

      {/* Content */}
      {!fetched && !loading && (
        <div className="flex flex-col items-center justify-center py-10 gap-3 text-gray-600">
          <Sparkles className="w-8 h-8 text-gray-700" />
          <p className="text-sm">Click <span className="text-indigo-400 font-semibold">Get AI Insights</span> to analyze the current filtered data</p>
        </div>
      )}

      {fetched && (
        <div className="p-6 space-y-6">

          {/* NumPy Stats Section */}
          {analysis && (
            <div>
              <button
                onClick={() => setShowStats(s => !s)}
                className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 hover:text-gray-200 transition-colors"
              >
                <BarChart2 className="w-4 h-4 text-indigo-400" />
                NumPy Analysis ({analysis.total_records} records)
                {showStats ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>

              {showStats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: 'Total Turnover',    value: fmt(analysis.total_turnover),       color: 'text-emerald-400' },
                    { label: 'Avg Transaction',   value: fmt(analysis.avg_transaction),      color: 'text-indigo-400'  },
                    { label: 'Tax Collected',     value: fmt(analysis.total_tax_collected),  color: 'text-rose-400'    },
                    { label: 'Std Deviation',     value: fmt(analysis.std_deviation),        color: 'text-amber-400'   },
                    { label: 'Highest Txn',       value: fmt(analysis.highest_transaction),  color: 'text-green-400'   },
                    { label: 'Lowest Txn',        value: fmt(analysis.lowest_transaction),   color: 'text-red-400'     },
                    { label: 'Paid Count',        value: analysis.paid_count,                color: 'text-blue-400'    },
                    { label: 'Pending Count',     value: analysis.pending_count,             color: 'text-yellow-400'  },
                  ].map(({ label, value, color }) => (
                    <div key={label} className="bg-gray-800/60 rounded-xl p-3 border border-gray-700/50">
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">{label}</p>
                      <p className={`text-sm font-bold font-mono ${color}`}>{value}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Priority + Status pills */}
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="text-[10px] px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 font-semibold">
                  High: {analysis.high_priority_count}
                </span>
                <span className="text-[10px] px-2.5 py-1 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 font-semibold">
                  Medium: {analysis.medium_priority_count}
                </span>
                <span className="text-[10px] px-2.5 py-1 rounded-full bg-gray-500/10 text-gray-400 border border-gray-600 font-semibold">
                  Low: {analysis.low_priority_count}
                </span>
              </div>
            </div>
          )}

          {/* Divider */}
          {analysis && <hr className="border-gray-800" />}

          {/* Groq AI Advice Section */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Groq AI Recommendations</span>
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 font-semibold">llama-3.3-70b</span>
            </div>

            {loading ? (
              <div className="flex items-center gap-2 text-gray-500 text-sm py-4">
                <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                Generating financial insights...
              </div>
            ) : (
              <div className="bg-gray-800/40 rounded-xl border border-gray-700/50" style={{ padding: '16px 20px' }}>
                {renderAIResponse(advice)}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
