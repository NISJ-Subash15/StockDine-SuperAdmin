import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, Mail, Lock, Eye, EyeOff, KeyRound, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { ThemeToggle } from '../components/ThemeToggle';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, requestPasswordReset } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Forgot password modal
  const [showForgot, setShowForgot] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMsg, setResetMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim() || !password) {
      setErrorMsg('Please enter both Email and Password.');
      return;
    }

    setIsLoading(true);
    const res = await login(email, password);
    setIsLoading(false);

    if (res.success) {
      navigate('/dashboard', { replace: true });
    } else {
      setErrorMsg(res.message || 'Authentication failed.');
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim()) return;
    const res = await requestPasswordReset(resetEmail);
    setResetMsg(res.message);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between p-4 sm:p-6 lg:p-10 relative">
      <header className="flex items-center justify-between max-w-4xl mx-auto w-full pt-2">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-xl bg-card border border-border flex items-center justify-center text-[#D2D0C1]">
            <ShieldAlert className="size-5" />
          </div>
          <div>
            <span className="font-serif italic text-2xl font-bold text-foreground block leading-none">
              StockDine
            </span>
            <span className="text-[9px] uppercase tracking-[0.25em] text-[#D2D0C1] font-extrabold block mt-1">
              Global Platform Control
            </span>
          </div>
        </div>
        <ThemeToggle />
      </header>

      <main className="flex-1 flex items-center justify-center py-8">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D2D0C1]/15 text-[#D2D0C1] text-[10px] font-extrabold uppercase tracking-widest border border-[#D2D0C1]/30">
              <ShieldAlert className="size-3" />
              <span>SUPER ADMIN PORTAL ONLY</span>
            </div>
            <h1 className="font-serif italic text-3xl sm:text-4xl text-foreground font-bold">
              Administrative Sign In
            </h1>
            <p className="text-xs text-muted-foreground font-medium max-w-xs mx-auto">
              Authorized StockDine platform administrators only. Customer & Restaurant accounts strictly prohibited.
            </p>
          </div>

          <div className="rounded-3xl bg-card border border-border p-8 sm:p-10 shadow-2xl space-y-6">
            {errorMsg && (
              <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="size-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold uppercase mb-1.5 text-foreground">
                  Super Admin Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 size-4 text-muted-foreground" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="superadmin@stockdine.com"
                    className="w-full pl-10 pr-4 py-3.5 rounded-2xl bg-background border border-border text-xs font-bold text-foreground focus:outline-none focus:border-[#D2D0C1]"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-extrabold uppercase text-foreground">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgot(true);
                      setResetEmail(email);
                      setResetMsg('');
                    }}
                    className="text-xs font-extrabold text-[#D2D0C1] hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 size-4 text-muted-foreground" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-3.5 rounded-2xl bg-background border border-border text-xs font-bold text-foreground focus:outline-none focus:border-[#D2D0C1]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 rounded-2xl bg-[#D2D0C1] text-[#2B2B2B] font-extrabold text-xs uppercase tracking-wider shadow-lg hover:bg-[#c4c2b2] transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {isLoading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>Authenticate Super Admin</span>
                    <ArrowRight className="size-4" />
                  </>
                )}
              </button>
            </form>

            <div className="pt-4 border-t border-border text-center text-[11px] text-muted-foreground space-y-1">
              <div>Super Admin Credentials: <span className="font-mono text-foreground font-bold">subash15082007@gmail.com</span> / <span className="font-mono text-foreground font-bold">198088</span></div>
              <div className="text-[10px] text-muted-foreground/80">Alternate Demo: <span className="font-mono text-foreground font-bold">superadmin@stockdine.com</span> / <span className="font-mono text-foreground font-bold">Admin@StockDine2026</span></div>
            </div>
          </div>
        </div>
      </main>

      {/* Forgot Password Modal */}
      {showForgot && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
            <div className="size-12 rounded-2xl bg-[#D2D0C1]/20 text-[#D2D0C1] flex items-center justify-center mx-auto border border-[#D2D0C1]/30">
              <KeyRound className="size-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-serif italic font-bold text-2xl text-foreground">
                Reset Admin Credentials
              </h3>
              <p className="text-xs text-muted-foreground">
                Enter your administrative email address to receive secure password recovery instructions.
              </p>
            </div>

            {resetMsg ? (
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="size-4 shrink-0" />
                <span>{resetMsg}</span>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <input
                  type="email"
                  required
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="superadmin@stockdine.com"
                  className="w-full px-4 py-3 rounded-2xl bg-background border border-border text-xs font-bold text-foreground focus:outline-none focus:border-[#D2D0C1]"
                />
                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-[#D2D0C1] text-[#2B2B2B] font-extrabold text-xs uppercase cursor-pointer"
                >
                  Send Reset Instructions
                </button>
              </form>
            )}

            <button
              type="button"
              onClick={() => setShowForgot(false)}
              className="w-full py-2.5 rounded-2xl bg-muted text-xs font-bold text-foreground cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <footer className="text-center text-[11px] text-muted-foreground py-2">
        © 2026 StockDine Platform Operations. Unauthorized access monitored & logged.
      </footer>
    </div>
  );
};
