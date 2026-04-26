import { useState } from 'react';
import { BookMarked, CheckCircle2, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('user@invalid');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);

  // Simulated logic to showcase the requirements for Error vs Success states
  const emailInvalid = email.length > 0 && !email.includes('@');
  const emailSuccess = email.includes('@domain'); // Example strict logic for green check
  const forceEmailError = email === 'user@invalid';

  const isEmailError = emailInvalid || forceEmailError;
  const isEmailSuccess = emailSuccess && !isEmailError;
  
  const isPasswordSuccess = password.length >= 8;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isEmailError && isPasswordSuccess) {
      onLogin();
    }
  };

  const GoogleIcon = () => (
    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );

  const MicrosoftIcon = () => (
    <svg className="w-5 h-5 mr-2" viewBox="0 0 21 21">
      <path fill="#f25022" d="M1 1h9v9H1z"/>
      <path fill="#00a4ef" d="M1 11h9v9H1z"/>
      <path fill="#7fba00" d="M11 1h9v9h-9z"/>
      <path fill="#ffb900" d="M11 11h9v9h-9z"/>
    </svg>
  );

  return (
    <div className="fixed inset-0 flex w-full font-sans overflow-hidden bg-white">
      {/* LEFT PANEL: DESKTOP ONLY (40%) */}
      <div className="hidden md:flex flex-col w-[40%] bg-[#0f1117] p-10 lg:p-16 justify-between text-white border-r border-[#1f2937]">
        <div>
          {/* Logo */}
          <div className="flex items-center gap-2 mb-8">
            <div className="bg-[#10b981] p-1.5 rounded text-white shadow-sm">
              <BookMarked size={18} className="stroke-[2.5]" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">DukaanBook</span>
          </div>

          {/* Heading */}
          <div className="max-w-sm">
            <h1 className="text-3xl lg:text-4xl font-bold leading-tight mb-4">
              Smart Finance for Every Dukaan
            </h1>
            <p className="text-[#9ca3af] text-sm leading-relaxed mb-8">
              Track income, expenses & grow your business with Pakistan's leading business suite.
            </p>

            {/* Features */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-[#10b981] w-5 h-5" />
                <span className="font-medium text-sm text-[white]">Real-time income & expense tracking</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-[#10b981] w-5 h-5" />
                <span className="font-medium text-sm text-[white]">Auto tax calculation (18% GST)</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-[#10b981] w-5 h-5" />
                <span className="font-medium text-sm text-[white]">Smart AI-powered suggestions</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Text */}
        <div className="flex items-center gap-2 mt-6">
          <svg className="w-4 h-4 text-[#9ca3af]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <p className="text-[10px] uppercase tracking-widest font-bold text-[#9ca3af]">
            Trusted by 500+ businesses
          </p>
        </div>
      </div>

      {/* RIGHT PANEL: RESPONSIVE CONTENT AREA (60% Desktop, 100% Mobile) */}
      <div className="flex flex-col h-full w-full md:w-[60%] bg-[#f3f4f6] relative justify-center items-center px-4 overflow-hidden">
        
        {/* Mobile Logo Only */}
        <div className="md:hidden flex items-center justify-center gap-2 mb-4">
          <div className="bg-[#10b981]/10 p-1.5 rounded-md text-[#10b981]">
            <BookMarked size={20} className="stroke-[2.5]" />
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-900">DukaanBook</span>
        </div>

        {/* Login Card */}
        <div className="w-full max-w-[360px] bg-white rounded-xl shadow-lg border border-gray-100 p-5 sm:p-6">
          <h2 className="text-xl font-bold text-[#1a1d27] mb-1">Welcome Back</h2>
          <p className="text-xs text-[#6b7280] mb-4">Sign in to your account</p>

          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Email Field */}
            <div>
              <label className="block text-[11px] font-semibold text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className={`h-4 w-4 ${isEmailError ? 'text-red-400' : 'text-gray-400'}`} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={`w-full pl-9 pr-9 py-1.5 rounded-lg border text-xs outline-none transition-all
                  ${isEmailError 
                    ? 'border-[#ef4444] text-red-900 focus:ring-4 focus:ring-red-500/20 bg-red-50/10' 
                    : isEmailSuccess 
                    ? 'border-[#10b981] text-gray-900 focus:border-[#10b981] focus:ring-4 focus:ring-[#10b981]/20'
                    : 'border-gray-200 text-gray-900 focus:border-[#10b981] focus:ring-4 focus:ring-[#10b981]/20'
                  }`}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center bg-transparent pointer-events-none">
                  {isEmailError && <AlertCircle className="h-4 w-4 text-red-500" />}
                  {isEmailSuccess && <CheckCircle2 className="h-4 w-4 text-[#10b981]" />}
                </div>
              </div>
              {isEmailError && (
                <p className="text-xs text-red-500 mt-1.5 mt-2 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 inline" /> Invalid email address
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-[11px] font-semibold text-gray-700 mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className={`w-full pl-9 pr-12 py-1.5 rounded-lg border text-xs outline-none transition-all text-gray-900
                    ${isPasswordSuccess && password.length > 0
                      ? 'border-[#10b981] focus:border-[#10b981] focus:ring-4 focus:ring-[#10b981]/20'
                      : 'border-gray-200 focus:border-[#10b981] focus:ring-4 focus:ring-[#10b981]/20'
                    }`}
                />
                
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-1.5">
                  {isPasswordSuccess && password.length > 0 && (
                    <CheckCircle2 className="h-4 w-4 text-[#10b981]" />
                  )}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-600 focus:outline-none bg-white p-0.5 rounded"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Options */}
            <div className="flex items-center justify-between mt-3">
              <label className="flex items-center cursor-pointer group">
                <input 
                  type="checkbox" 
                  defaultChecked
                  className="w-3.5 h-3.5 rounded border-gray-300 text-[#10b981] focus:ring-[#10b981]/30 cursor-pointer" 
                />
                <span className="ml-1.5 text-xs text-gray-600 group-hover:text-gray-800">Remember me</span>
              </label>
              <a href="#" className="text-xs font-semibold text-[#10b981] hover:text-[#059669]">
                Forgot Password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              type="submit"
              className="w-full py-2 px-4 bg-[#10b981] hover:bg-[#059669] text-white font-bold rounded-lg transition-colors mt-1 mb-1 text-xs shadow-sm focus:ring-4 focus:ring-[#10b981]/30"
            >
              Sign In to DukaanBook
            </button>
          </form>

          {/* Connect Dividers */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-[10px]">
              <span className="px-2 bg-white uppercase text-gray-400 tracking-wider font-semibold">
                — continue with —
              </span>
            </div>
          </div>

          {/* Social Logins */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <button className="flex items-center justify-center py-1.5 px-3 bg-white border border-gray-200 rounded-md text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm focus:ring-2 focus:ring-gray-200">
              <GoogleIcon />
              Google
            </button>
            <button className="flex items-center justify-center py-1.5 px-3 bg-white border border-gray-200 rounded-md text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm focus:ring-2 focus:ring-gray-200">
              <MicrosoftIcon />
              Microsoft
            </button>
          </div>

          <p className="text-center text-xs text-gray-500 font-medium">
            Don't have an account? <a href="#" className="text-[#10b981] hover:text-[#059669] font-bold">Sign Up Free</a>
          </p>
        </div>

        {/* Footer */}
        <div className="mt-6 w-full text-center px-4 shrink-0">
          <p className="text-xs font-medium text-[#9ca3af]">
            © 2024 DukaanBook <span className="mx-1.5">•</span> 
            <a href="#" className="hover:text-gray-700 transition-colors">Privacy Policy</a> <span className="mx-1.5">•</span> 
            <a href="#" className="hover:text-gray-700 transition-colors">Terms of Service</a>
          </p>
        </div>

      </div>
    </div>
  );
}
