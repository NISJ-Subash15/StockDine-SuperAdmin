import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Mail, Lock, Eye, EyeOff, KeyRound, AlertCircle, CheckCircle2, ArrowRight, X } from 'lucide-react';
import { ThemeToggle } from '../components/ThemeToggle';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, requestPasswordReset } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Forgot password modal state
  const [showForgot, setShowForgot] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMsg, setResetMsg] = useState('');
  const [isResetLoading, setIsResetLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim()) {
      setErrorMsg('Please enter your Super Admin Email Address.');
      return;
    }
    if (!password) {
      setErrorMsg('Please enter your Password.');
      return;
    }

    setIsLoading(true);
    const res = await login(email, password);
    setIsLoading(false);

    if (res.success) {
      navigate('/dashboard', { replace: true });
    } else {
      setErrorMsg(res.message || 'Invalid Super Admin credentials or unauthorized account role.');
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim()) return;
    setIsResetLoading(true);
    const res = await requestPasswordReset(resetEmail);
    setIsResetLoading(false);
    setResetMsg(res.message);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between p-4 sm:p-6 lg:p-10 relative selection:bg-[#D2D0C1] selection:text-[#2B2B2B]">
      {/* -------------------------------------------------- */}
      {/* Top Header */}
      {/* -------------------------------------------------- */}
      <header className="flex items-center justify-between max-w-5xl mx-auto w-full pt-2 pb-6">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-card border border-border flex items-center justify-center text-foreground shadow-xs">
            <ShieldCheck className="size-5 text-accent" />
          </div>
          <div>
            <span className="font-serif italic text-2xl sm:text-3xl font-bold tracking-tight text-foreground block leading-none">
              StockDine
            </span>
            <span className="text-[9px] uppercase tracking-[0.25em] text-muted-foreground font-extrabold block mt-1">
              GLOBAL PLATFORM CONTROL
            </span>
          </div>
        </div>

        <ThemeToggle />
      </header>

      {/* -------------------------------------------------- */}
      {/* Main Authentication Area */}
      {/* -------------------------------------------------- */}
      <main className="flex-1 flex items-center justify-center py-8">
        <div className="w-full max-w-md space-y-6">
          {/* Badge & Headings */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-card border border-border text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground shadow-xs">
              <ShieldCheck className="size-3 text-accent" />
              <span>SUPER ADMINISTRATOR</span>
            </div>
            <h1 className="font-serif italic text-3xl sm:text-4xl text-foreground font-bold tracking-tight">
              Global Platform Control
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground font-medium max-w-xs mx-auto">
              Secure access to StockDine's global platform operations.
            </p>
          </div>

          {/* Premium Login Card */}
          <div className="rounded-3xl bg-card border border-border p-6 sm:p-8 md:p-10 shadow-xl space-y-6">
            <div className="text-center space-y-1">
              <div className="size-12 rounded-2xl bg-background border border-border flex items-center justify-center text-accent mx-auto shadow-xs">
                <ShieldCheck className="size-6" />
              </div>
              <h2 className="font-serif italic text-2xl font-bold text-foreground">
                Super Admin Sign In
              </h2>
              <p className="text-xs text-muted-foreground font-medium">
                Authorized platform administrators only.
              </p>
            </div>

            {errorMsg && (
              <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="size-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider mb-1.5 text-foreground">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 size-4 text-muted-foreground" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@stockdine.com"
                    className="w-full pl-10 pr-4 py-3.5 rounded-2xl bg-background dark:bg-[#171717] border border-border text-xs font-bold text-foreground focus:outline-none focus:border-accent transition-colors"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-foreground">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgot(true);
                      setResetEmail(email);
                      setResetMsg('');
                    }}
                    className="text-xs font-extrabold text-foreground hover:underline cursor-pointer transition-colors"
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
                    className="w-full pl-10 pr-10 py-3.5 rounded-2xl bg-background dark:bg-[#171717] border border-border text-xs font-bold text-foreground focus:outline-none focus:border-accent transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 rounded-2xl bg-foreground text-background font-extrabold text-xs uppercase tracking-wider shadow-md hover:opacity-90 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
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

            <div className="pt-4 border-t border-border text-center text-[11px] text-muted-foreground font-medium">
              Authorized platform administrators only.
            </div>
          </div>
        </div>
      </main>

      {/* -------------------------------------------------- */}
      {/* Forgot Password Modal */}
      {/* -------------------------------------------------- */}
      {showForgot && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4 relative">
            <button
              type="button"
              onClick={() => setShowForgot(false)}
              className="absolute top-4 right-4 p-2 rounded-xl text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <X className="size-5" />
            </button>

            <div className="size-12 rounded-2xl bg-background border border-border text-accent flex items-center justify-center mx-auto shadow-xs">
              <KeyRound className="size-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-serif italic font-bold text-2xl text-foreground">
                Reset Credentials
              </h3>
              <p className="text-xs text-muted-foreground font-medium">
                Enter your registered Super Admin email address for security recovery.
              </p>
            </div>

            {resetMsg ? (
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="size-4 shrink-0" />
                <span>{resetMsg}</span>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider mb-1.5 text-foreground">
                    Super Admin Email
                  </label>
                  <input
                    type="email"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="admin@stockdine.com"
                    className="w-full px-4 py-3.5 rounded-2xl bg-background dark:bg-[#171717] border border-border text-xs font-bold text-foreground focus:outline-none focus:border-accent transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isResetLoading}
                  className="w-full py-3.5 rounded-2xl bg-foreground text-background font-extrabold text-xs uppercase tracking-wider shadow-md hover:opacity-90 active:scale-[0.99] transition-all cursor-pointer"
                >
                  {isResetLoading ? 'Sending Request...' : 'Send Recovery Instructions'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* -------------------------------------------------- */}
      {/* Footer */}
      {/* -------------------------------------------------- */}
      <footer className="text-center text-[11px] text-muted-foreground font-medium py-2">
        © StockDine Platform Operations
      </footer>
    </div>
  );
};
