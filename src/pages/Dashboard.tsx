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
  AlertTriangle,
  ArrowUpRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export const Dashboard: React.FC = () => {
  const [telemetry, setTelemetry] = useState<PlatformTelemetry | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const data = await api.getDashboardTelemetry();
      setTelemetry(data);
      setIsLoading(false);
    }
    loadData();
  }, []);

  const bookingTrendsData = [
    { month: 'Jan', bookings: 6200, gmv: 6200000 },
    { month: 'Feb', bookings: 7800, gmv: 7800000 },
    { month: 'Mar', bookings: 9400, gmv: 9400000 },
    { month: 'Apr', bookings: 11200, gmv: 11200000 },
    { month: 'May', bookings: 14500, gmv: 14500000 },
    { month: 'Jun', bookings: 18200, gmv: 18200000 },
    { month: 'Jul', bookings: 22100, gmv: 22100000 },
  ];

  const statusDistributionData = [
    { name: 'Completed', value: 81200, color: '#10B981' },
    { name: 'Confirmed', value: 2800, color: '#3B82F6' },
    { name: 'Cancelled', value: 5400, color: '#EF4444' },
  ];

  const restaurantGrowthData = [
    { month: 'Jan', count: 180 },
    { month: 'Feb', count: 210 },
    { month: 'Mar', count: 245 },
    { month: 'Apr', count: 280 },
    { month: 'May', count: 310 },
    { month: 'Jun', count: 342 },
  ];

  const formatCurrency = (val: number) => {
    return `₹${(val / 100000).toFixed(2)}L`;
  };

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

        {telemetry?.isDemoData && (
          <div className="px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-bold flex items-center gap-1.5 w-fit">
            <AlertTriangle className="size-3.5 shrink-0" />
            <span>DEMO / DEVELOPMENT DATA</span>
          </div>
        )}
      </div>

      {/* 8 KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Users"
          value={isLoading ? '...' : (telemetry?.totalUsers || 0).toLocaleString()}
          subtitle="Registered diners"
          trend="+14.2% mo/mo"
          trendPositive={true}
          icon={<Users className="size-5" />}
        />
        <KPICard
          title="Total Restaurants"
          value={isLoading ? '...' : (telemetry?.totalRestaurants || 0).toLocaleString()}
          subtitle="Onboarded venues"
          trend="+8 new this week"
          trendPositive={true}
          icon={<Building2 className="size-5" />}
        />
        <KPICard
          title="Active Restaurants"
          value={isLoading ? '...' : (telemetry?.activeRestaurants || 0).toLocaleString()}
          subtitle="Live accepting bookings"
          trend="87% active rate"
          trendPositive={true}
          icon={<Building2 className="size-5" />}
        />
        <KPICard
          title="Total Bookings"
          value={isLoading ? '...' : (telemetry?.totalBookings || 0).toLocaleString()}
          subtitle="All time reservations"
          trend="+18.5% mo/mo"
          trendPositive={true}
          icon={<Calendar className="size-5" />}
        />
        <KPICard
          title="Completed Bookings"
          value={isLoading ? '...' : (telemetry?.completedBookings || 0).toLocaleString()}
          subtitle="Fulfillments confirmed"
          trend="90.8% success"
          trendPositive={true}
          icon={<CheckCircle2 className="size-5" />}
        />
        <KPICard
          title="Cancelled Bookings"
          value={isLoading ? '...' : (telemetry?.cancelledBookings || 0).toLocaleString()}
          subtitle="User & venue cancellations"
          trend="6.0% cancellation"
          trendPositive={false}
          icon={<XCircle className="size-5" />}
        />
        <KPICard
          title="Advance Payments"
          value={isLoading ? '...' : formatCurrency(telemetry?.totalAdvancePaid || 0)}
          subtitle="Platform collected deposit"
          trend="+22.1% advance volume"
          trendPositive={true}
          icon={<CreditCard className="size-5" />}
        />
        <KPICard
          title="Platform GMV"
          value={isLoading ? '...' : formatCurrency(telemetry?.platformGMV || 0)}
          subtitle="Gross Merchant Value"
          trend="₹8.94 Cr lifetime"
          trendPositive={true}
          icon={<DollarSign className="size-5" />}
        />
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-4">
        {/* GMV & Booking Volume Trend */}
        <div className="lg:col-span-8 p-6 rounded-3xl bg-card border border-border space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif font-bold text-xl text-foreground">
                Platform GMV & Booking Velocity
              </h2>
              <p className="text-xs text-muted-foreground">
                Monthly reservation volume vs Gross Merchant Value
              </p>
            </div>
            <div className="p-2 rounded-xl bg-background border border-border text-[#D2D0C1]">
              <ArrowUpRight className="size-4" />
            </div>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={bookingTrendsData}>
                <defs>
                  <linearGradient id="gmvGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D2D0C1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#D2D0C1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="month" stroke="#A3A3A3" fontSize={11} />
                <YAxis stroke="#A3A3A3" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#2B2B2B',
                    borderColor: '#444444',
                    borderRadius: '12px',
                    color: '#FFFFFF',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="bookings"
                  stroke="#D2D0C1"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#gmvGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Booking Status Distribution */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-card border border-border space-y-4 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="font-serif font-bold text-xl text-foreground">
              Booking Health Breakdown
            </h2>
            <p className="text-xs text-muted-foreground">
              Distribution of reservation statuses
            </p>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#2B2B2B',
                    borderColor: '#444444',
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
        </div>
      </div>
    </div>
  );
};
