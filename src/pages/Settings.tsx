import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Settings as SettingsIcon, KeyRound, ShieldCheck, Lock, Bell, User, CheckCircle2, AlertCircle } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user, logout } = useAuth();

  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  const [passSuccess, setPassSuccess] = useState('');
  const [passError, setPassError] = useState('');

  // Notification Toggles
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [cancellationAlerts, setCancellationAlerts] = useState(true);

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setPassSuccess('');
    setPassError('');

    if (!currentPass) {
      setPassError('Please enter your current administrative password.');
      return;
    }
    if (newPass.length < 8) {
      setPassError('New password must be at least 8 characters long.');
      return;
    }
    if (newPass !== confirmPass) {
      setPassError('New passwords do not match.');
      return;
    }

    setPassSuccess('Super Admin Security Password updated successfully.');
    setCurrentPass('');
    setNewPass('');
    setConfirmPass('');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
            <SettingsIcon className="size-4 text-[#D2D0C1]" />
            <span>Platform Administrative Preferences</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-foreground mt-1">
            Super Admin Settings
          </h1>
        </div>
      </div>

      {/* Account Profile Card */}
      <div className="p-6 rounded-3xl bg-card border border-border space-y-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="size-12 rounded-2xl bg-background border border-[#D2D0C1]/40 flex items-center justify-center font-serif text-2xl font-bold text-[#D2D0C1]">
            {user?.name ? user.name[0] : 'S'}
          </div>
          <div>
            <h2 className="font-serif font-bold text-xl text-foreground">{user?.name}</h2>
            <span className="text-xs text-muted-foreground">{user?.email}</span>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-background border border-border text-xs flex items-center justify-between">
          <span className="text-muted-foreground font-semibold">Account Level:</span>
          <span className="font-extrabold uppercase text-[#D2D0C1] flex items-center gap-1">
            <ShieldCheck className="size-4" />
            Global Platform Director (Super Admin)
          </span>
        </div>
      </div>

      {/* Security Password Form */}
      <div className="p-6 rounded-3xl bg-card border border-border space-y-4 shadow-sm">
        <div>
          <h2 className="font-serif font-bold text-xl text-foreground flex items-center gap-2">
            <KeyRound className="size-5 text-[#D2D0C1]" />
            <span>Security & Authentication</span>
          </h2>
          <p className="text-xs text-muted-foreground">
            Update your administrative login password. Minimum 8 characters required.
          </p>
        </div>

        {passError && (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="size-4 shrink-0" />
            <span>{passError}</span>
          </div>
        )}

        {passSuccess && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="size-4 shrink-0" />
            <span>{passSuccess}</span>
          </div>
        )}

        <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
          <div>
            <label className="block text-xs font-extrabold uppercase mb-1 text-foreground">
              Current Password
            </label>
            <input
              type="password"
              value={currentPass}
              onChange={(e) => setCurrentPass(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-2xl bg-background border border-border text-xs font-semibold text-foreground focus:outline-none focus:border-[#D2D0C1]"
            />
          </div>

          <div>
            <label className="block text-xs font-extrabold uppercase mb-1 text-foreground">
              New Password
            </label>
            <input
              type="password"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-2xl bg-background border border-border text-xs font-semibold text-foreground focus:outline-none focus:border-[#D2D0C1]"
            />
          </div>

          <div>
            <label className="block text-xs font-extrabold uppercase mb-1 text-foreground">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-2xl bg-background border border-border text-xs font-semibold text-foreground focus:outline-none focus:border-[#D2D0C1]"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-3 rounded-2xl bg-[#D2D0C1] text-[#2B2B2B] font-extrabold text-xs uppercase cursor-pointer"
          >
            Update Security Password
          </button>
        </form>
      </div>

      {/* Session Controls */}
      <div className="p-6 rounded-3xl bg-card border border-border space-y-3 shadow-sm">
        <h2 className="font-serif font-bold text-xl text-foreground">Active Session Security</h2>
        <p className="text-xs text-muted-foreground">
          Terminate current Super Admin session tokens and redirect to sign in.
        </p>
        <button
          type="button"
          onClick={logout}
          className="px-4 py-2.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 hover:bg-rose-500/20 font-bold text-xs cursor-pointer transition-colors"
        >
          Sign Out of All Administrative Sessions
        </button>
      </div>
    </div>
  );
};
