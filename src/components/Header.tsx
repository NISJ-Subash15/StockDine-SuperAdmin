import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ThemeToggle } from './ThemeToggle';
import { Menu, Bell, LogOut, ShieldCheck, User } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

interface HeaderProps {
  setMobileOpen: (open: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({ setMobileOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="h-16 border-b border-border bg-card px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="lg:hidden p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted"
        >
          <Menu className="size-5" />
        </button>
        <div>
          <h1 className="text-sm font-bold text-foreground">StockDine Super Admin</h1>
          <p className="text-[11px] text-muted-foreground hidden sm:block">
            Global Control Center & Telemetry Operations
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Link
          to="/notifications"
          className="p-2 rounded-xl bg-background border border-border text-foreground hover:bg-muted transition-colors relative"
          title="Notifications"
        >
          <Bell className="size-4 text-[#D2D0C1]" />
          <span className="absolute top-1 right-1 size-2 rounded-full bg-amber-500" />
        </Link>

        <ThemeToggle />

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 p-1.5 rounded-xl bg-background border border-border hover:bg-muted transition-all cursor-pointer"
          >
            <div className="size-7 rounded-lg bg-[#D2D0C1] text-[#2B2B2B] font-bold flex items-center justify-center text-xs">
              {user?.name ? user.name[0].toUpperCase() : 'A'}
            </div>
            <span className="text-xs font-bold text-foreground hidden sm:inline">
              {user?.name || 'Super Admin'}
            </span>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-card border border-border shadow-xl p-2 z-50 space-y-1">
              <div className="p-2.5 border-b border-border text-xs">
                <span className="font-bold text-foreground block truncate">{user?.name}</span>
                <span className="text-[10px] text-muted-foreground block truncate">{user?.email}</span>
                <span className="mt-1 inline-flex items-center gap-1 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#D2D0C1]/20 text-[#D2D0C1]">
                  <ShieldCheck className="size-3" />
                  Super Admin
                </span>
              </div>

              <Link
                to="/settings"
                onClick={() => setShowProfileMenu(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                <User className="size-4" />
                <span>Account Settings</span>
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
              >
                <LogOut className="size-4" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
