import { useState, useEffect } from 'react';
import TransactionForm from './components/TransactionForm';
import RealTimeSummary from './components/RealTimeSummary';
import RecordsView from './components/RecordsView';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import { fetchTransactions, fetchAnalysis, addTransaction } from './api';
import {
  Building2,
  LayoutDashboard,
  PlusCircle,
  List,
  LogOut
} from 'lucide-react';

function App() {
  const [currentView, setCurrentView] = useState('login'); // 'login' | 'dashboard' | 'records' | 'form'
  const [records, setRecords] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  // Toast state
  const [toast, setToast] = useState(null);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    type: 'Income',
    category: '',
    description: '',
    vendor: '',
    amount: '',
    paymentMethod: ''
  });

  const [errors, setErrors] = useState({});

  const loadData = async () => {
    try {
      const transRes = await fetchTransactions(1, 100);
      setRecords(transRes.data.records || []);
      const anaRes = await fetchAnalysis();
      setAnalysis(anaRes.data);
    } catch (err) {
      console.error('Failed to load data', err);
    }
  };

  useEffect(() => {
    if (currentView === 'records') {
      loadData();
    }
  }, [currentView]);

  const validate = () => {
    const newErrors = {};
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.description) newErrors.description = 'Description is required';
    if (!formData.vendor) newErrors.vendor = 'Vendor is required';
    if (!formData.amount || isNaN(formData.amount) || Number(formData.amount) <= 0) {
      newErrors.amount = 'Valid amount is required';
    }
    if (!formData.paymentMethod) newErrors.paymentMethod = 'Payment method is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setLoading(true);
      try {
        const payload = {
          Date: formData.date,
          Transaction_Type: formData.type.charAt(0).toUpperCase() + formData.type.slice(1).toLowerCase(),
          Category: formData.category,
          Item_Description: formData.description,
          Amount_Raw: parseFloat(formData.amount),
          Vendor_Supplier: formData.vendor,
          Payment_Method: formData.paymentMethod
        };
        await addTransaction(payload);
        showToast('success', `Transaction saved successfully`);
        setFormData({
          ...formData,
          category: '',
          description: '',
          vendor: '',
          amount: '',
          paymentMethod: ''
        });
        setErrors({});
        setCurrentView('records');
      } catch (err) {
        showToast('error', err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    }
  };

  const baseAmount = Number(formData.amount) || 0;
  const taxAmount = baseAmount * 0.18;
  const totalAmount = baseAmount + taxAmount;
  const isIncome = formData.type === 'income';

  if (currentView === 'login') {
    return <Login onLogin={() => setCurrentView('dashboard')} />;
  }

  const navItems = [
    { view: 'dashboard', label: 'Dashboard',    Icon: LayoutDashboard },
    { view: 'form',      label: 'New Entry',     Icon: PlusCircle      },
    { view: 'records',   label: 'View Records',  Icon: List            },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans text-slate-800">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col hidden lg:flex shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-gray-200 shrink-0">
          <div className="flex items-center gap-2 text-indigo-600">
            <Building2 size={24} className="stroke-[1.5]" />
            <span className="text-xl font-bold tracking-tight">DukaanLedger</span>
          </div>
        </div>

        <div className="p-4 flex-1 overflow-y-auto">
          <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 mt-2">Navigation</p>
          <nav className="space-y-1">
            {navItems.map(({ view, label, Icon }) => (
              <button
                key={view}
                onClick={() => setCurrentView(view)}
                className={`cursor-pointer w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  currentView === view
                    ? 'bg-indigo-50 text-indigo-600 shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon size={20} className={currentView === view ? 'stroke-[2]' : 'stroke-[1.5]'} />
                <span className="font-medium text-sm">{label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-gray-200 bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
              AD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Admin User</p>
              <p className="text-xs text-gray-500 truncate">Shop Owner</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto relative">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shrink-0 sticky top-0 z-10 w-full">
          <h1 className="text-sm font-semibold text-gray-500 capitalize">
            {currentView === 'form' ? 'New Entry' : currentView}
          </h1>
          <button
            onClick={() => setCurrentView('login')}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 border border-gray-200 hover:border-red-200 rounded-lg transition-all"
          >
            <LogOut size={16} className="stroke-[1.5]" />
            Logout
          </button>
        </header>

        {currentView === 'dashboard' && <Dashboard />}

        {currentView === 'form' && (
          <div className="p-8 max-w-7xl mx-auto w-full">
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              <div className="flex-1 w-full relative">
                <TransactionForm
                  formData={formData}
                  setFormData={setFormData}
                  errors={errors}
                  onSubmit={handleSubmit}
                />
              </div>
              <div className="w-full lg:w-96 shrink-0 sticky top-8">
                <RealTimeSummary
                  baseAmount={baseAmount}
                  taxAmount={taxAmount}
                  totalAmount={totalAmount}
                  isIncome={isIncome}
                  description={formData.description}
                  category={formData.category}
                />
              </div>
            </div>
          </div>
        )}

        {currentView === 'records' && (
          <RecordsView
            activeRecords={records}
            analysis={analysis}
            setRecords={setRecords}
            setAnalysis={setAnalysis}
            onAddClick={() => setCurrentView('form')}
          />
        )}
      </main>

      {toast && (
        <div style={{
          position: 'fixed',
          bottom: '32px',
          right: '32px',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '14px 20px',
          borderRadius: '12px',
          minWidth: '280px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
          background: toast.type === 'success' ? '#0f4c2a' : '#4c0f0f',
          border: `1px solid ${toast.type === 'success' ? '#22c55e' : '#ef4444'}`,
          animation: 'slideUp 0.3s ease'
        }}>
          <span style={{ fontSize: '22px' }}>
            {toast.type === 'success' ? '✅' : '❌'}
          </span>
          <div>
            <div style={{ 
              color: toast.type === 'success' ? '#22c55e' : '#ef4444',
              fontWeight: '700', 
              fontSize: '13px',
              letterSpacing: '0.5px'
            }}>
              {toast.type === 'success' ? 'TRANSACTION SAVED' : 'SAVE FAILED'}
            </div>
            <div style={{ color: '#cbd5e1', fontSize: '12px', marginTop: '2px' }}>
              {toast.message}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
      `}</style>
    </div>
  );
}

export default App;
