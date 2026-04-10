import { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Eye, EyeOff, Loader2 } from 'lucide-react';
import { api } from '../services/api';

interface LoginProps {
  onLogin: (username: string, token: string) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!username || !password) {
      setErrorMsg('Please enter both username and password.');
      return;
    }
    
    setIsLoading(true);
    setErrorMsg('');
    try {
      if (activeTab === 'signup') {
        const user = await api.signup(username, password);
        // Automatically sign in after signup to get token
        const authData = await api.signin(username, password);
        onLogin(user.username, authData.accessToken);
      } else {
        const authData = await api.signin(username, password);
        onLogin(username, authData.accessToken);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mica-bg h-screen w-full flex items-center justify-center relative overflow-hidden">
      {/* Background Overlay for Luminous Depth */}
      <div className="absolute inset-0 bg-white/20 dark:bg-black/10 backdrop-blur-xl"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md px-6 flex flex-col items-center"
      >
        {/* Top Area: Geometric Logo */}
        <div className="mb-8 flex flex-col items-center">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#005faa] to-[#0078d4] flex items-center justify-center shadow-lg transform rotate-45 mb-6">
            <Sparkles className="text-white w-8 h-8 -rotate-45" />
          </div>
          <h1 className="text-4xl font-semibold text-[#1a1c1c] tracking-tight">Welcome</h1>
        </div>

        {/* Main Card */}
        <div className="w-full glass-panel bg-white/70 rounded-xl border border-white/30 shadow-2xl overflow-hidden">
          {/* Pivot Control */}
          <div className="flex px-8 pt-6 gap-8">
            <button 
              onClick={() => { setActiveTab('signin'); setErrorMsg(''); }}
              className={`relative pb-3 text-sm font-medium transition-all ${activeTab === 'signin' ? 'text-[#005faa]' : 'text-[#404752] hover:text-[#1a1c1c]'}`}
            >
              Sign In
              {activeTab === 'signin' && (
                <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-[#005faa] rounded-full" />
              )}
            </button>
            <button 
              onClick={() => { setActiveTab('signup'); setErrorMsg(''); }}
              className={`relative pb-3 text-sm font-medium transition-all ${activeTab === 'signup' ? 'text-[#005faa]' : 'text-[#404752] hover:text-[#1a1c1c]'}`}
            >
              Sign Up
              {activeTab === 'signup' && (
                <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-[#005faa] rounded-full" />
              )}
            </button>
          </div>

          <div className="p-8 space-y-6">
            {errorMsg && (
              <div className="p-3 text-xs text-red-600 bg-red-50 rounded-lg border border-red-100">
                {errorMsg}
              </div>
            )}
            {/* Input Group: User Name */}
            <div className="group">
              <label className="block text-[10px] font-semibold text-[#404752] uppercase tracking-widest mb-1">User Name</label>
              <div className="relative border-b-2 border-[#c0c7d4] focus-within:border-[#005faa] transition-colors">
                <input 
                  className="w-full bg-transparent py-2 px-0 border-none focus:ring-0 text-[#1a1c1c] placeholder:text-[#c0c7d4] outline-none" 
                  placeholder="Enter your user name" 
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                />
              </div>
            </div>

            {/* Input Group: Password */}
            <div className="group">
              <label className="block text-[10px] font-semibold text-[#404752] uppercase tracking-widest mb-1">Password</label>
              <div className="relative border-b-2 border-[#c0c7d4] focus-within:border-[#005faa] transition-colors flex items-center">
                <input 
                  className="w-full bg-transparent py-2 px-0 border-none focus:ring-0 text-[#1a1c1c] placeholder:text-[#c0c7d4] outline-none" 
                  placeholder="••••••••" 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[#404752] hover:text-[#005faa] transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <a className="text-xs font-medium text-[#005faa] hover:underline" href="#">Forgot password?</a>
            </div>

            {/* Primary Button */}
            <button 
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-gradient-to-br from-[#005faa] to-[#0078d4] text-white py-3 rounded-lg font-semibold shadow-md active:scale-[0.98] transition-transform duration-150 disabled:opacity-70 flex justify-center items-center"
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : (activeTab === 'signin' ? 'Sign In' : 'Sign Up')}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
