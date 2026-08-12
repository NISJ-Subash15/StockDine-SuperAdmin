import React, { useState } from 'react';
import { MOCK_NOTIFICATIONS } from '../lib/api';
import { NotificationAlert } from '../types';
import { Bell, CheckCheck, Building2, AlertTriangle, LifeBuoy, ShieldAlert } from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationAlert[]>(MOCK_NOTIFICATIONS);

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const getIcon = (type: NotificationAlert['type']) => {
    switch (type) {
      case 'restaurant_registration':
        return <Building2 className="size-4 text-[#D2D0C1]" />;
      case 'high_cancellation':
      case 'payment_alert':
        return <AlertTriangle className="size-4 text-rose-400" />;
      case 'support_escalation':
        return <LifeBuoy className="size-4 text-amber-400" />;
      default:
        return <ShieldAlert className="size-4 text-[#D2D0C1]" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
            <Bell className="size-4 text-[#D2D0C1]" />
            <span>Platform Alert Feed</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-foreground mt-1">
            Notifications Center
          </h1>
        </div>

        <button
          type="button"
          onClick={handleMarkAllRead}
          className="px-4 py-2 rounded-xl bg-card border border-border text-foreground hover:bg-muted text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <CheckCheck className="size-4 text-[#D2D0C1]" />
          <span>Mark All as Read</span>
        </button>
      </div>

      {/* Alert Feed */}
      <div className="space-y-3 max-w-3xl">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`p-5 rounded-3xl border transition-all flex items-start justify-between gap-4 ${
              n.read
                ? 'bg-card border-border opacity-70'
                : 'bg-card border-[#D2D0C1]/40 shadow-sm'
            }`}
          >
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-2xl bg-background border border-border shrink-0 mt-0.5">
                {getIcon(n.type)}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-foreground">{n.title}</h3>
                  {!n.read && (
                    <span className="size-2 rounded-full bg-amber-500 inline-block" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                  {n.message}
                </p>
                <span className="text-[10px] text-muted-foreground font-semibold block pt-1">
                  {n.timestamp}
                </span>
              </div>
            </div>

            {!n.read && (
              <button
                type="button"
                onClick={() => handleMarkAsRead(n.id)}
                className="text-[11px] font-bold text-[#D2D0C1] hover:underline shrink-0 cursor-pointer"
              >
                Mark Read
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
