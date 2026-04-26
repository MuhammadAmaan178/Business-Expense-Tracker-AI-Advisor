import { useEffect, useState } from 'react';
import {
  TrendingUp, TrendingDown, DollarSign, AlertCircle,
  CheckCircle, Clock, BarChart2, PieChart, Loader2,
  ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { fetchAnalysis } from '../api';

const CATEGORY_COLORS = [
  '#6366f1','#10b981','#f59e0b','#ef4444','#3b82f6',
  '#8b5cf6','#ec4899','#14b8a6','#f97316','#84cc16','#06b6d4','#a78bfa'
];

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalysis()
      .then(res => setData(res.data))
      .catch(err => console.error('Dashboard load error:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mr-3" />
        <span className="text-gray-500 text-sm">Loading dashboard...</span>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-1 items-center justify-center h-full">
        <p className="text-gray-400 text-sm">Failed to load dashboard data.</p>
      </div>
    );
  }

  const fmt = (n) => `Rs ${Number(n).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

  // Category breakdown sorted by total
  const categories = Object.entries(data.category_breakdown || {})
    .sort((a, b) => b[1].total_amount - a[1].total_amount);

  const maxCatAmount = categories[0]?.[1]?.total_amount || 1;

  // Monthly trend sorted
  const months = Object.entries(data.monthly_trend || {}).sort((a, b) => a[0].localeCompare(b[0]));
  const maxMonthAmount = Math.max(...months.map(m => m[1]), 1);

  const paidPct = data.total_records > 0
    ? Math.round((data.paid_count / data.total_records) * 100)
    : 0;
  const pendingPct = 100 - paidPct;

  return (
    <div className="p-8 space-y-8 overflow-y-auto">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard</h2>
        <p className="text-sm text-gray-500 mt-1">Full financial overview from your CSV data</p>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <KpiCard
          title="Total Turnover"
          value={fmt(data.total_turnover)}
          sub={`${data.total_records} transactions`}
          icon={<DollarSign className="w-5 h-5" />}
          color="indigo"
          trend="up"
        />
        <KpiCard
          title="Avg Transaction"
          value={fmt(data.avg_transaction)}
          sub={`Max: ${fmt(data.highest_transaction)}`}
          icon={<TrendingUp className="w-5 h-5" />}
          color="emerald"
          trend="up"
        />
        <KpiCard
          title="Tax Collected"
          value={fmt(data.total_tax_collected)}
          sub="18% GST applied"
          icon={<BarChart2 className="w-5 h-5" />}
          color="rose"
          trend="down"
        />
        <KpiCard
          title="Std Deviation"
          value={fmt(data.std_deviation)}
          sub={`Min: ${fmt(data.lowest_transaction)}`}
          icon={<TrendingDown className="w-5 h-5" />}
          color="amber"
        />
      </div>

      {/* ── Middle Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Payment Status Ring */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 flex flex-col gap-4">
          <h3 className="font-semibold text-gray-800 text-sm flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-500" /> Payment Status
          </h3>
          {/* Visual ring simulation with CSS */}
          <div className="flex items-center justify-center py-2">
            <div className="relative w-32 h-32">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f3f4f6" strokeWidth="3.5" />
                <circle
                  cx="18" cy="18" r="15.9" fill="none"
                  stroke="#10b981" strokeWidth="3.5"
                  strokeDasharray={`${paidPct} ${100 - paidPct}`}
                  strokeLinecap="round"
                />
                <circle
                  cx="18" cy="18" r="15.9" fill="none"
                  stroke="#f59e0b" strokeWidth="3.5"
                  strokeDasharray={`${pendingPct} ${100 - pendingPct}`}
                  strokeDashoffset={`${-paidPct}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-bold text-gray-800">{paidPct}%</span>
                <span className="text-[10px] text-gray-400">Paid</span>
              </div>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                <span className="text-gray-600">Paid</span>
              </div>
              <span className="font-semibold text-gray-800">{data.paid_count}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
                <span className="text-gray-600">Pending</span>
              </div>
              <span className="font-semibold text-gray-800">{data.pending_count}</span>
            </div>
          </div>
        </div>

        {/* Priority Breakdown */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 flex flex-col gap-4">
          <h3 className="font-semibold text-gray-800 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500" /> Priority Breakdown
          </h3>
          <div className="space-y-4 flex-1 flex flex-col justify-center">
            {[
              { label: 'High', count: data.high_priority_count, color: 'bg-red-500', light: 'bg-red-50 text-red-600' },
              { label: 'Medium', count: data.medium_priority_count, color: 'bg-yellow-400', light: 'bg-yellow-50 text-yellow-700' },
              { label: 'Low', count: data.low_priority_count, color: 'bg-gray-300', light: 'bg-gray-100 text-gray-600' },
            ].map(({ label, count, color, light }) => {
              const pct = data.total_records > 0 ? Math.round((count / data.total_records) * 100) : 0;
              return (
                <div key={label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${light}`}>{label}</span>
                    <span className="text-xs text-gray-500">{count} <span className="text-gray-400">({pct}%)</span></span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className={`${color} h-2 rounded-full transition-all`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 flex flex-col gap-3">
          <h3 className="font-semibold text-gray-800 text-sm flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-500" /> Quick Stats
          </h3>
          <div className="space-y-3 flex-1">
            {[
              { label: 'Highest Transaction', value: fmt(data.highest_transaction), accent: 'text-emerald-600' },
              { label: 'Lowest Transaction',  value: fmt(data.lowest_transaction),  accent: 'text-rose-500' },
              { label: 'Avg per Transaction', value: fmt(data.avg_transaction),     accent: 'text-indigo-600' },
              { label: 'Total Amount (Raw)',  value: fmt(data.total_amount_raw),    accent: 'text-gray-700' },
              { label: 'Std Deviation',       value: fmt(data.std_deviation),       accent: 'text-amber-600' },
            ].map(({ label, value, accent }) => (
              <div key={label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <span className="text-xs text-gray-500">{label}</span>
                <span className={`text-sm font-semibold ${accent}`}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Monthly Trend Bar Chart ── */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
        <h3 className="font-semibold text-gray-800 text-sm mb-6 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-indigo-500" /> Monthly Revenue Trend
        </h3>
        <div className="flex items-end gap-2 overflow-x-auto pb-2" style={{ height: '140px' }}>
          {months.map(([month, amount]) => {
            const heightPct = Math.max(8, Math.round((amount / maxMonthAmount) * 100));
            return (
              <div key={month} className="flex flex-col items-center flex-1 min-w-[40px] group">
                <div className="relative w-full flex justify-center">
                  <div
                    className="w-full bg-indigo-100 group-hover:bg-indigo-500 rounded-t-md transition-all duration-300 cursor-pointer"
                    style={{ height: `${heightPct}px` }}
                    title={`${month}: ${fmt(amount)}`}
                  />
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 hidden group-hover:block bg-gray-800 text-white text-[10px] rounded px-2 py-1 whitespace-nowrap z-10">
                    {fmt(amount)}
                  </div>
                </div>
                <span className="text-[9px] text-gray-400 mt-1 rotate-45 origin-left">{month.slice(5)}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Category Breakdown ── */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
        <h3 className="font-semibold text-gray-800 text-sm mb-5 flex items-center gap-2">
          <PieChart className="w-4 h-4 text-indigo-500" /> Category Breakdown
        </h3>
        <div className="space-y-3">
          {categories.map(([cat, { count, total_amount }], idx) => {
            const pct = Math.round((total_amount / maxCatAmount) * 100);
            return (
              <div key={cat} className="flex items-center gap-4 group">
                <div className="w-28 text-xs text-gray-600 truncate shrink-0">{cat}</div>
                <div className="flex-1 bg-gray-100 rounded-full h-2.5">
                  <div
                    className="h-2.5 rounded-full transition-all"
                    style={{ width: `${pct}%`, backgroundColor: CATEGORY_COLORS[idx % CATEGORY_COLORS.length] }}
                  />
                </div>
                <div className="text-xs text-gray-500 shrink-0 w-28 text-right">
                  {count} txns · <span className="font-medium text-gray-700">{fmt(total_amount)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function KpiCard({ title, value, sub, icon, color, trend }) {
  const colors = {
    indigo: { bg: 'bg-indigo-50', icon: 'text-indigo-600', border: 'border-indigo-100', val: 'text-indigo-700' },
    emerald: { bg: 'bg-emerald-50', icon: 'text-emerald-600', border: 'border-emerald-100', val: 'text-emerald-700' },
    rose: { bg: 'bg-rose-50', icon: 'text-rose-500', border: 'border-rose-100', val: 'text-rose-600' },
    amber: { bg: 'bg-amber-50', icon: 'text-amber-600', border: 'border-amber-100', val: 'text-amber-700' },
  }[color];

  return (
    <div className={`bg-white border ${colors.border} rounded-2xl shadow-sm p-5 flex flex-col gap-3`}>
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{title}</p>
        <div className={`${colors.bg} p-2 rounded-lg ${colors.icon}`}>{icon}</div>
      </div>
      <p className={`text-2xl font-bold ${colors.val} leading-none`}>{value}</p>
      <div className="flex items-center gap-1 text-xs text-gray-400">
        {trend === 'up' && <ArrowUpRight className="w-3 h-3 text-emerald-500" />}
        {trend === 'down' && <ArrowDownRight className="w-3 h-3 text-rose-400" />}
        {sub}
      </div>
    </div>
  );
}
