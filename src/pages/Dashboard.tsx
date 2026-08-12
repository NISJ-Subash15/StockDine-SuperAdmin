import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { PlatformTelemetry } from '../types';
import { KPICard } from '../components/KPICard';
import {
  Users,
  Building2,
  Calendar,
  CreditCard,
  DollarSign,
  CheckCircle2,
  XCircle,
  Activity,
  ArrowUpRight,
  RefreshCw,
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts';

export const Dashboard: React.FC = () => {
  const [telemetry, setTelemetry] = useState<PlatformTelemetry | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    const data = await api.getDashboardTelemetry();
    setTelemetry(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const formatCurrency = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)} Lakhs`;
    return `₹${val.toLocaleString()}`;
  };

  const completed = telemetry?.completedBookings || 0;
  const cancelled = telemetry?.cancelledBookings || 0;
  const total = telemetry?.totalBookings || 0;
  const confirmed = Math.max(0, total - (completed + cancelled));

  const statusDistributionData = [
    { name: 'Completed', value: completed, color: '#10B981' },
    { name: 'Confirmed', value: confirmed, color: '#3B82F6' },
    { name: 'Cancelled', value: cancelled, color: '#EF4444' },
  ].filter((d) => d.value > 0 || total === 0);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
            <Activity className="size-4 text-[#D2D0C1]" />
            <span>Platform Operational Dashboard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-foreground mt-1">
            Global Telemetry & Oversight
          </h1>
        </div>

        <button
          type="button"
          onClick={loadData}
          disabled={isLoading}
          className="px-4 py-2 rounded-xl bg-card border border-border text-foreground hover:bg-muted text-xs font-bold transition-all flex items-center gap-2 w-fit cursor-pointer shadow-xs"
        >
          <RefreshCw className={`size-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* 8 KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Diners"
          value={isLoading ? '...' : (telemetry?.totalUsers || 0).toLocaleString()}
          subtitle="Registered customer accounts"
          icon={<Users className="size-5" />}
        />
        <KPICard
          title="Total Restaurants"
          value={isLoading ? '...' : (telemetry?.totalRestaurants || 0).toLocaleString()}
          subtitle="Partner venues in database"
          icon={<Building2 className="size-5" />}
        />
        <KPICard
          title="Active Restaurants"
          value={isLoading ? '...' : (telemetry?.activeRestaurants || 0).toLocaleString()}
          subtitle="Approved accepting bookings"
          icon={<Building2 className="size-5 text-emerald-500" />}
        />
        <KPICard
          title="Total Bookings"
          value={isLoading ? '...' : (telemetry?.totalBookings || 0).toLocaleString()}
          subtitle="Reservations logged"
          icon={<Calendar className="size-5" />}
        />
        <KPICard
          title="Completed Bookings"
          value={isLoading ? '...' : (telemetry?.completedBookings || 0).toLocaleString()}
          subtitle="Fulfilled dining reservations"
          icon={<CheckCircle2 className="size-5 text-emerald-500" />}
        />
        <KPICard
          title="Cancelled Bookings"
          value={isLoading ? '...' : (telemetry?.cancelledBookings || 0).toLocaleString()}
          subtitle="Cancelled reservation count"
          icon={<XCircle className="size-5 text-rose-500" />}
        />
        <KPICard
          title="Advance Payments"
          value={isLoading ? '...' : formatCurrency(telemetry?.totalAdvancePaid || 0)}
          subtitle="Collected 20% table hold deposit"
          icon={<CreditCard className="size-5" />}
        />
        <KPICard
          title="Platform GMV"
          value={isLoading ? '...' : formatCurrency(telemetry?.platformGMV || 0)}
          subtitle="Gross Merchant Value"
          icon={<DollarSign className="size-5" />}
        />
      </div>

      {/* Analytics Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
        {/* Real Metrics Summary */}
        <div className="lg:col-span-8 p-6 rounded-3xl bg-card border border-border space-y-4 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif font-bold text-xl text-foreground">
                Database Platform Overview
              </h2>
              <p className="text-xs text-muted-foreground">
                Real-time MongoDB platform metric breakdown
              </p>
            </div>
            <div className="p-2 rounded-xl bg-background border border-border text-[#D2D0C1]">
              <ArrowUpRight className="size-4" />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-border">
            <div className="p-4 rounded-2xl bg-background border border-border space-y-1">
              <span className="text-[10px] font-bold uppercase text-muted-foreground">Pending Approvals</span>
              <div className="text-xl font-serif font-bold text-amber-500">
                {telemetry?.pendingApprovalRestaurants || 0}
              </div>
              <span className="text-[11px] text-muted-foreground">Venues awaiting review</span>
            </div>

            <div className="p-4 rounded-2xl bg-background border border-border space-y-1">
              <span className="text-[10px] font-bold uppercase text-muted-foreground">Open Support Tickets</span>
              <div className="text-xl font-serif font-bold text-foreground">
                {telemetry?.activeSupportTickets || 0}
              </div>
              <span className="text-[11px] text-muted-foreground">Active support inquiries</span>
            </div>

            <div className="p-4 rounded-2xl bg-background border border-border space-y-1">
              <span className="text-[10px] font-bold uppercase text-muted-foreground">Total Customer Reviews</span>
              <div className="text-xl font-serif font-bold text-foreground">
                {telemetry?.reviewsCount || 0}
              </div>
              <span className="text-[11px] text-muted-foreground">Diner ratings submitted</span>
            </div>
          </div>
        </div>

        {/* Booking Status Distribution */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-card border border-border space-y-4 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="font-serif font-bold text-xl text-foreground">
              Booking Health Breakdown
            </h2>
            <p className="text-xs text-muted-foreground">
              Distribution of reservation statuses
            </p>
          </div>

          {total === 0 ? (
            <div className="h-48 flex items-center justify-center text-xs text-muted-foreground font-semibold">
              No booking records logged in database.
            </div>
          ) : (
            <>
              <div className="h-48 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusDistributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={70}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {statusDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#202020',
                        borderColor: '#333333',
                        borderRadius: '12px',
                        color: '#FFFFFF',
                        fontSize: '12px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border text-center text-xs">
                {statusDistributionData.map((item) => (
                  <div key={item.name} className="space-y-0.5">
                    <span className="size-2.5 rounded-full inline-block mr-1" style={{ backgroundColor: item.color }} />
                    <span className="text-muted-foreground block text-[10px] uppercase font-bold">{item.name}</span>
                    <span className="font-bold text-foreground block">{item.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
