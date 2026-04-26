import { Calendar, Tag, FileText, Store, CreditCard, DollarSign, TrendingUp, TrendingDown, CheckCircle2 } from 'lucide-react';

export default function TransactionForm({ formData, setFormData, errors, onSubmit }) {
  const isIncome = formData.type === 'income';
  
  // Dynamic styles based on transaction type
  const themeColor = isIncome ? 'emerald' : 'rose';
  const themeBgLight = isIncome ? 'bg-emerald-50' : 'bg-rose-50';
  const themeText = isIncome ? 'text-emerald-700' : 'text-rose-700';
  const themeBorder = isIncome ? 'border-emerald-200' : 'border-rose-200';
  const themeRing = isIncome ? 'focus:ring-emerald-500/20' : 'focus:ring-rose-500/20';
  const themeFocusBorder = isIncome ? 'focus:border-emerald-500' : 'focus:border-rose-500';
  const buttonBg = isIncome ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const inputClass = `w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none transition-all focus:ring-4 ${themeRing} ${themeFocusBorder} bg-white text-gray-800 placeholder-gray-400`;
  const errorClass = "border-red-300 focus:border-red-500 focus:ring-red-500/20";
  
  const Label = ({ children, required }) => (
    <label className="block text-xs font-medium text-gray-700 mb-1.5">
      {children} {required && <span className="text-red-500">*</span>}
    </label>
  );

  const ErrorMsg = ({ msg }) => (
    msg ? <p className="text-xs text-red-500 mt-1">{msg}</p> : null
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Form Header */}
      <div className={`px-6 py-4 flex items-center justify-between border-b ${themeBorder} ${themeBgLight}`}>
        <div className="flex items-center gap-2">
          {isIncome ? <TrendingUp className={`w-5 h-5 ${themeText}`} /> : <TrendingDown className={`w-5 h-5 ${themeText}`} />}
          <h2 className={`font-semibold ${themeText}`}>
            Record New {isIncome ? 'Income' : 'Expense'}
          </h2>
        </div>
        <div className="flex items-center gap-1 text-xs font-medium text-gray-500 bg-white/60 px-2.5 py-1 rounded-md border border-gray-200/50">
          ID: {isIncome ? 'INC' : 'EXP'}-{Math.floor(1000 + Math.random() * 9000)}
        </div>
      </div>

      <form onSubmit={onSubmit} className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 1. Date picker */}
          <div>
            <Label required>Date</Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className={`${inputClass} pl-10 ${errors.date ? errorClass : ''}`}
              />
            </div>
            <ErrorMsg msg={errors.date} />
          </div>

          {/* 2. Transaction Type */}
          <div>
            <Label required>Transaction Type</Label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className={`${inputClass} font-medium ${isIncome ? 'text-emerald-700' : 'text-rose-700'}`}
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          {/* 3. Category */}
          <div>
            <Label required>Category</Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Tag className="h-4 w-4 text-gray-400" />
              </div>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`${inputClass} pl-10 ${errors.category ? errorClass : ''}`}
              >
                <option value="" disabled>Select Category</option>
                {isIncome ? (
                  <>
                    <option value="Sales">Sales</option>
                    <option value="Services">Services</option>
                    <option value="Interest">Interest</option>
                    <option value="Refunds">Refunds</option>
                  </>
                ) : (
                  <>
                    <option value="Rent">Rent</option>
                    <option value="Salaries">Salaries</option>
                    <option value="Electricity Bill">Electricity Bill</option>
                    <option value="Stock Purchase">Stock Purchase</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Transport">Transport</option>
                    <option value="Maintenance">Maintenance</option>
                  </>
                )}
              </select>
            </div>
            <ErrorMsg msg={errors.category} />
          </div>

          {/* 5. Amount */}
          <div>
            <Label required>Amount</Label>
            <div className="relative flex rounded-lg shadow-sm">
              <span className={`inline-flex items-center px-4 rounded-l-lg border border-r-0 border-gray-200 bg-gray-50 text-gray-500 sm:text-sm font-medium ${errors.amount ? 'border-red-300' : ''}`}>
                PKR
              </span>
              <input
                type="number"
                name="amount"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={formData.amount}
                onChange={handleChange}
                className={`flex-1 min-w-0 block w-full px-3 py-2.5 rounded-none rounded-r-lg border border-gray-200 focus:ring-4 ${themeRing} ${themeFocusBorder} text-sm outline-none transition-all ${errors.amount ? errorClass : ''} font-mono`}
              />
            </div>
            <ErrorMsg msg={errors.amount} />
          </div>

          {/* 4. Description */}
          <div className="col-span-1 md:col-span-2">
            <Label required>Item Description</Label>
            <div className="relative">
              <div className="absolute top-2.5 left-3 pointer-events-none">
                <FileText className="h-4 w-4 text-gray-400" />
              </div>
              <textarea
                name="description"
                rows={2}
                placeholder="e.g. K-Electric Bill, Staff Salary..."
                value={formData.description}
                onChange={handleChange}
                className={`${inputClass} pl-10 resize-none ${errors.description ? errorClass : ''}`}
              />
            </div>
            <ErrorMsg msg={errors.description} />
          </div>

          {/* 6. Vendor Search Bar */}
          <div>
            <Label required>Vendor / Supplier</Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Store className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                name="vendor"
                placeholder="Search vendor..."
                value={formData.vendor}
                onChange={handleChange}
                className={`${inputClass} pl-10 ${errors.vendor ? errorClass : ''}`}
              />
            </div>
            <ErrorMsg msg={errors.vendor} />
          </div>

          {/* 7. Payment Method */}
          <div>
            <Label required>Payment Method</Label>
            <div className="relative flex gap-1 p-1 bg-gray-50 border border-gray-200 rounded-lg">
              {['Cash', 'Bank Transfer', 'Credit Card', 'Check', 'EasyPaisa'].map((method) => {
                const isSelected = formData.paymentMethod === method;
                return (
                  <button
                    key={method}
                    type="button"
                    onClick={() => handleChange({ target: { name: 'paymentMethod', value: method } })}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
                      isSelected 
                        ? `bg-white shadow-sm text-gray-900 border border-gray-200/50` 
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100/50 border border-transparent'
                    }`}
                  >
                    {method}
                  </button>
                )
              })}
            </div>
            <ErrorMsg msg={errors.paymentMethod} />
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-gray-100 mt-6">
          <button
            type="submit"
            className={`w-full flex items-center justify-center gap-2 py-3 px-4 text-white font-medium rounded-lg transition-all focus:ring-4 focus:outline-none ${buttonBg} ${isIncome ? 'focus:ring-emerald-500/30' : 'focus:ring-rose-500/30'} shadow-sm`}
          >
            <CheckCircle2 className="w-5 h-5" />
            Save Transaction
          </button>
          <p className="text-center text-xs text-gray-400 mt-3 flex items-center justify-center gap-1">
            Transaction ID will be auto-generated by backend.
          </p>
        </div>
      </form>
    </div>
  );
}
