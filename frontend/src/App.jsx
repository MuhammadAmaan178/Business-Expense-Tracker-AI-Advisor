import { useState, useEffect } from 'react';
import TransactionForm from './components/TransactionForm';
import RealTimeSummary from './components/RealTimeSummary';
import RecordsView from './components/RecordsView';
import Login from './components/Login';
import { fetchTransactions, fetchAnalysis, addTransaction } from './api';
import { 
  Building2, 
  LayoutDashboard, 
  PlusCircle, 
  List, 
  Settings,
  Bell
} from 'lucide-react';

function App() {
  const [currentView, setCurrentView] = useState('login'); // 'login', 'records' or 'form'
  const [records, setRecords] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

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
          Transaction_Type: formData.type === 'income' || formData.type === 'Income' ? 'Income' : 'Expense',
          Category: formData.category,
          Item_Description: formData.description,
          Amount_Raw: parseFloat(formData.amount),
          Vendor_Supplier: formData.vendor,
          Payment_Method: formData.paymentMethod
        };
        
        await addTransaction(payload);
        alert('Transaction Saved Successfully!');
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
        alert('Failed to save: ' + err.message);
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
    return <Login onLogin={() => setCurrentView('records')} />;
  }

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
            <button 
               className="w-full flex items-center gap-3 px-3 py-2 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <LayoutDashboard size={20} className="stroke-[1.5]" />
              <span className="font-medium text-sm">Dashboard</span>
            </button>
            <button 
               onClick={() => setCurrentView('form')}
               className={`cursor-pointer w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                 currentView === 'form' 
                   ? 'bg-indigo-50 text-indigo-600 shadow-sm' 
                   : 'text-gray-600 hover:bg-gray-50'
               }`}
            >
              <PlusCircle size={20} className={currentView === 'form' ? 'stroke-[2]' : 'stroke-[1.5]'} />
              <span className="font-medium text-sm">New Entry</span>
            </button>
            <button 
               onClick={() => setCurrentView('records')}
               className={`cursor-pointer w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                currentView === 'records' 
                  ? 'bg-indigo-50 text-indigo-600 shadow-sm' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <List size={20} className={currentView === 'records' ? 'stroke-[2]' : 'stroke-[1.5]'} />
              <span className="font-medium text-sm">View Records</span>
            </button>
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
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-end px-8 shrink-0 sticky top-0 z-10 w-full">
          <div className="flex items-center gap-4">
            <button className="text-gray-400 hover:text-gray-600 transition-colors">
              <Bell size={20} className="stroke-[1.5]" />
            </button>
            <button className="text-gray-400 hover:text-gray-600 transition-colors">
              <Settings size={20} className="stroke-[1.5]" />
            </button>
          </div>
        </header>

        {currentView === 'form' ? (
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
        ) : (
          <RecordsView 
            activeRecords={records} 
            analysis={analysis} 
            setRecords={setRecords} 
            setAnalysis={setAnalysis} 
          />
        )}
      </main>
    </div>
  );
}

export default App;
