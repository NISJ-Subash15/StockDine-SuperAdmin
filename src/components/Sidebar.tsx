import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Building2,
  Calendar,
  CreditCard,
  Star,
  LifeBuoy,
  BarChart3,
  Bell,
  Settings,
  ShieldAlert,
  X,
} from 'lucide-react';

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, setMobileOpen }) => {
  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="size-4" /> },
    { to: '/users', label: 'Users', icon: <Users className="size-4" /> },
    { to: '/restaurants', label: 'Restaurants', icon: <Building2 className="size-4" /> },
    { to: '/bookings', label: 'Bookings', icon: <Calendar className="size-4" /> },
    { to: '/payments', label: 'Payments', icon: <CreditCard className="size-4" /> },
    { to: '/reviews', label: 'Reviews', icon: <Star className="size-4" /> },
    { to: '/support', label: 'Support Desk', icon: <LifeBuoy className="size-4" /> },
    { to: '/analytics', label: 'Analytics', icon: <BarChart3 className="size-4" /> },
    { to: '/notifications', label: 'Notifications', icon: <Bell className="size-4" /> },
    { to: '/settings', label: 'Settings', icon: <Settings className="size-4" /> },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-card border-r border-border flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Header Brand */}
          <div className="p-5 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-xl bg-background border border-[#D2D0C1]/40 flex items-center justify-center text-[#D2D0C1]">
                <ShieldAlert className="size-5" />
              </div>
              <div>
                <span className="font-serif italic font-bold text-xl tracking-tight text-foreground block leading-none">
                  StockDine
                </span>
                <span className="text-[9px] font-extrabold uppercase tracking-[0.2em] text-[#D2D0C1] block mt-1">
                  Global Super Admin
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-muted-foreground hover:text-foreground"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Nav List */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#D2D0C1] text-[#2B2B2B] font-bold shadow-xs'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`
                }
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Footer Badge */}
        <div className="p-4 border-t border-border">
          <div className="p-3 rounded-xl bg-background border border-border text-[11px] font-medium text-muted-foreground text-center space-y-1">
            <div className="flex items-center justify-center gap-1.5 font-bold text-foreground">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Platform Core Online</span>
            </div>
            <p className="text-[10px] text-muted-foreground/80">StockDine System v2.4.0</p>
          </div>
        </div>
      </aside>
    </>
  );
};
