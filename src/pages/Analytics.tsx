import React from 'react';
import { BarChart3, TrendingUp, Users, Building2, Calendar, Award, Utensils, Percent } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
} from 'recharts';

export const AnalyticsPage: React.FC = () => {
  const userGrowthData = [
    { month: 'Jan', users: 8400 },
    { month: 'Feb', users: 9600 },
    { month: 'Mar', users: 11000 },
    { month: 'Apr', users: 12400 },
    { month: 'May', users: 13800 },
    { month: 'Jun', users: 14850 },
  ];

  const categoryPopularityData = [
    { category: 'North Indian', bookings: 28400 },
    { category: 'Italian & Pizza', bookings: 22100 },
    { category: 'Asian & Sushi', bookings: 16500 },
    { category: 'Biryani & Kebabs', bookings: 14200 },
    { category: 'Continental & BBQ', bookings: 8200 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
            <BarChart3 className="size-4 text-[#D2D0C1]" />
            <span>Platform Deep Telemetry</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-foreground mt-1">
            Global Analytics & Growth Intelligence
          </h1>
        </div>
      </div>

      {/* Metric Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-card border border-border space-y-1">
          <span className="text-[10px] font-bold text-muted-foreground uppercase">Completion Rate</span>
          <div className="text-2xl font-serif font-bold text-emerald-500">90.8%</div>
          <span className="text-[11px] text-muted-foreground">81,200 fulfillments</span>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border space-y-1">
          <span className="text-[10px] font-bold text-muted-foreground uppercase">Cancellation Rate</span>
          <div className="text-2xl font-serif font-bold text-rose-500">6.0%</div>
          <span className="text-[11px] text-muted-foreground">5,400 cancellations</span>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border space-y-1">
          <span className="text-[10px] font-bold text-muted-foreground uppercase">Avg Advance / Booking</span>
          <div className="text-2xl font-serif font-bold text-foreground">₹200</div>
          <span className="text-[11px] text-muted-foreground">20% table hold deposit</span>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border space-y-1">
          <span className="text-[10px] font-bold text-muted-foreground uppercase">Venue Retention Rate</span>
          <div className="text-2xl font-serif font-bold text-foreground">96.4%</div>
          <span className="text-[11px] text-muted-foreground">Monthly active partner venues</span>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* User Growth Line Chart */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-card border border-border space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif font-bold text-xl text-foreground">User Growth Velocity</h2>
              <p className="text-xs text-muted-foreground">Cumulative registered diner accounts</p>
            </div>
            <Users className="size-5 text-[#D2D0C1]" />
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={userGrowthData}>
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
                <Line type="monotone" dataKey="users" stroke="#D2D0C1" strokeWidth={3} dot={{ fill: '#D2D0C1', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Popularity Bar Chart */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-card border border-border space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif font-bold text-xl text-foreground">Cuisine Category Popularity</h2>
              <p className="text-xs text-muted-foreground">Total reservations per food category</p>
            </div>
            <Utensils className="size-5 text-[#D2D0C1]" />
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryPopularityData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="category" stroke="#A3A3A3" fontSize={10} />
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
                <Bar dataKey="bookings" fill="#D2D0C1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
