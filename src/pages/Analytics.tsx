import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { PlatformTelemetry, Restaurant } from '../types';
import { BarChart3, Users, Building2, Utensils, Award } from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const [telemetry, setTelemetry] = useState<PlatformTelemetry | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const [t, r] = await Promise.all([
        api.getDashboardTelemetry(),
        api.getRestaurants(),
      ]);
      setTelemetry(t);
      setRestaurants(r);
      setIsLoading(false);
    }
    loadData();
  }, []);

  const totalB = telemetry?.totalBookings || 0;
  const compB = telemetry?.completedBookings || 0;
  const cancB = telemetry?.cancelledBookings || 0;

  const completionRate = totalB > 0 ? ((compB / totalB) * 100).toFixed(1) : '0';
  const cancellationRate = totalB > 0 ? ((cancB / totalB) * 100).toFixed(1) : '0';
  const avgAdvance = totalB > 0 ? Math.round((telemetry?.totalAdvancePaid || 0) / totalB) : 0;

  // Cuisine category aggregation from real restaurants database
  const cuisineCounts: Record<string, number> = {};
  restaurants.forEach((rest) => {
    const c = rest.cuisine || 'Other';
    cuisineCounts[c] = (cuisineCounts[c] || 0) + (rest.totalBookings || 1);
  });

  const categoryData = Object.entries(cuisineCounts).map(([category, bookings]) => ({
    category,
    bookings,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
            <BarChart3 className="size-4 text-[#D2D0C1]" />
            <span>Platform Telemetry</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-foreground mt-1">
            Global Analytics & Database Intelligence
          </h1>
        </div>
      </div>

      {/* Metric Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-card border border-border space-y-1">
          <span className="text-[10px] font-bold text-muted-foreground uppercase">Completion Rate</span>
          <div className="text-2xl font-serif font-bold text-emerald-500">
            {isLoading ? '...' : `${completionRate}%`}
          </div>
          <span className="text-[11px] text-muted-foreground">{compB.toLocaleString()} fulfillments</span>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border space-y-1">
          <span className="text-[10px] font-bold text-muted-foreground uppercase">Cancellation Rate</span>
          <div className="text-2xl font-serif font-bold text-rose-500">
            {isLoading ? '...' : `${cancellationRate}%`}
          </div>
          <span className="text-[11px] text-muted-foreground">{cancB.toLocaleString()} cancellations</span>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border space-y-1">
          <span className="text-[10px] font-bold text-muted-foreground uppercase">Avg Advance / Booking</span>
          <div className="text-2xl font-serif font-bold text-foreground">
            {isLoading ? '...' : `₹${avgAdvance}`}
          </div>
          <span className="text-[11px] text-muted-foreground">Calculated from deposit records</span>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border space-y-1">
          <span className="text-[10px] font-bold text-muted-foreground uppercase">Active Partner Venues</span>
          <div className="text-2xl font-serif font-bold text-foreground">
            {isLoading ? '...' : (telemetry?.activeRestaurants || 0)}
          </div>
          <span className="text-[11px] text-muted-foreground">Approved active venues</span>
        </div>
      </div>

      {/* Category & Venue Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 p-6 rounded-3xl bg-card border border-border space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif font-bold text-xl text-foreground">Cuisine Category Distribution</h2>
              <p className="text-xs text-muted-foreground">Aggregated from active venue database</p>
            </div>
            <Utensils className="size-5 text-[#D2D0C1]" />
          </div>

          {isLoading ? (
            <div className="p-12 text-center text-xs text-muted-foreground font-bold">
              Loading category analytics...
            </div>
          ) : categoryData.length === 0 ? (
            <div className="p-12 text-center text-xs text-muted-foreground font-semibold">
              No restaurant cuisine data registered in database yet.
            </div>
          ) : (
            <div className="space-y-3 pt-2">
              {categoryData.map((cat) => (
                <div key={cat.category} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-foreground">{cat.category}</span>
                    <span className="text-muted-foreground">{cat.bookings} venue(s)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-background overflow-hidden border border-border">
                    <div
                      className="h-full bg-[#D2D0C1]"
                      style={{
                        width: `${Math.min(100, (cat.bookings / Math.max(1, restaurants.length)) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-6 p-6 rounded-3xl bg-card border border-border space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif font-bold text-xl text-foreground">Top Onboarded Venues</h2>
              <p className="text-xs text-muted-foreground">Ranked by database reservation volume</p>
            </div>
            <Award className="size-5 text-[#D2D0C1]" />
          </div>

          {isLoading ? (
            <div className="p-12 text-center text-xs text-muted-foreground font-bold">
              Loading venue telemetry...
            </div>
          ) : restaurants.length === 0 ? (
            <div className="p-12 text-center text-xs text-muted-foreground font-semibold">
              No restaurants registered yet.
            </div>
          ) : (
            <div className="space-y-3">
              {restaurants.slice(0, 5).map((r) => (
                <div
                  key={r.id}
                  className="p-3.5 rounded-2xl bg-background border border-border flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-foreground block">{r.name}</span>
                    <span className="text-[11px] text-muted-foreground block">{r.city} • {r.cuisine}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-foreground block">{r.totalBookings} Bookings</span>
                    <span className="text-[10px] text-emerald-500 font-semibold uppercase">{r.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
