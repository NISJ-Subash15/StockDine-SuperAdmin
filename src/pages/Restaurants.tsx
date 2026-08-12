import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { Restaurant, RestaurantStatus } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { Building2, Search, Filter, Eye, CheckCircle2, XCircle, AlertTriangle, Star, MapPin, X } from 'lucide-react';

export const RestaurantsPage: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Approved' | 'Active' | 'Suspended' | 'Rejected'>('All');

  // Rejection reason modal
  const [rejectingRestaurant, setRejectingRestaurant] = useState<Restaurant | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    async function loadRestaurants() {
      setIsLoading(true);
      const data = await api.getRestaurants();
      setRestaurants(data);
      setIsLoading(false);
    }
    loadRestaurants();
  }, []);

  const handleUpdateStatus = async (rest: Restaurant, status: RestaurantStatus, reason?: string) => {
    await api.updateRestaurantStatus(rest.id, status, reason);
    setRestaurants((prev) =>
      prev.map((r) => (r.id === rest.id ? { ...r, status, rejectionReason: reason || r.rejectionReason } : r))
    );
    setRejectingRestaurant(null);
    setRejectionReason('');
  };

  const filteredRestaurants = restaurants.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
            <Building2 className="size-4 text-[#D2D0C1]" />
            <span>Platform Restaurant Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-foreground mt-1">
            Restaurant Onboarding & Oversight
          </h1>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-card p-4 rounded-2xl border border-border">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-3 size-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search venue name, owner or city..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-background border border-border text-xs font-semibold text-foreground focus:outline-none focus:border-[#D2D0C1]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <Filter className="size-4 text-muted-foreground shrink-0" />
          <span className="text-xs font-bold text-muted-foreground">Status:</span>
          {(['All', 'Pending', 'Active', 'Suspended', 'Rejected'] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                statusFilter === st
                  ? 'bg-[#D2D0C1] text-[#2B2B2B]'
                  : 'bg-background text-muted-foreground hover:text-foreground border border-border'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Restaurants Table */}
      <div className="rounded-3xl bg-card border border-border overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-12 text-center text-xs font-bold text-muted-foreground space-y-2">
            <div className="size-6 rounded-full border-2 border-[#D2D0C1] border-t-transparent animate-spin mx-auto" />
            <span>Loading platform restaurants...</span>
          </div>
        ) : filteredRestaurants.length === 0 ? (
          <div className="p-12 text-center text-xs font-semibold text-muted-foreground">
            No restaurants found matching search filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-background border-b border-border uppercase font-bold text-muted-foreground text-[10px] tracking-wider">
                <tr>
                  <th className="px-6 py-4">Restaurant</th>
                  <th className="px-6 py-4">Owner & Contact</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4 text-center">Bookings</th>
                  <th className="px-6 py-4 text-center">Rating</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-medium">
                {filteredRestaurants.map((r) => (
                  <tr key={r.id} className="hover:bg-muted/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-xl bg-background border border-border text-foreground font-bold flex items-center justify-center font-serif text-lg shrink-0">
                          {r.name[0]}
                        </div>
                        <div>
                          <span className="font-bold text-foreground block">{r.name}</span>
                          <span className="text-[11px] text-muted-foreground block">{r.cuisine}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-foreground block">{r.ownerName}</span>
                      <span className="text-[11px] text-muted-foreground block font-mono">{r.email}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <MapPin className="size-3.5 shrink-0 text-[#D2D0C1]" />
                        <span>{r.city}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center font-bold text-foreground">
                      {r.totalBookings.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-center font-bold text-foreground">
                      <div className="inline-flex items-center gap-1">
                        <Star className="size-3.5 fill-[#D2D0C1] text-[#D2D0C1]" />
                        <span>{r.rating > 0 ? r.rating : 'N/A'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <StatusBadge status={r.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/restaurants/${r.id}`}
                          className="p-2 rounded-xl bg-background border border-border text-foreground hover:bg-muted transition-colors cursor-pointer"
                          title="View Restaurant Details"
                        >
                          <Eye className="size-4" />
                        </Link>

                        {r.status === 'Pending' && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleUpdateStatus(r, 'Active')}
                              className="px-2.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/20 text-xs font-bold flex items-center gap-1 cursor-pointer"
                              title="Approve Restaurant"
                            >
                              <CheckCircle2 className="size-3.5" />
                              <span>Approve</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setRejectingRestaurant(r)}
                              className="px-2.5 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 hover:bg-rose-500/20 text-xs font-bold flex items-center gap-1 cursor-pointer"
                              title="Reject Registration"
                            >
                              <XCircle className="size-3.5" />
                              <span>Reject</span>
                            </button>
                          </>
                        )}

                        {r.status === 'Active' && (
                          <button
                            type="button"
                            onClick={() => handleUpdateStatus(r, 'Suspended')}
                            className="px-2.5 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 hover:bg-rose-500/20 text-xs font-bold cursor-pointer"
                          >
                            Suspend
                          </button>
                        )}

                        {r.status === 'Suspended' && (
                          <button
                            type="button"
                            onClick={() => handleUpdateStatus(r, 'Active')}
                            className="px-2.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/20 text-xs font-bold cursor-pointer"
                          >
                            Activate
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Rejection Reason Modal */}
      {rejectingRestaurant && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-xl text-foreground">
                Reject Registration
              </h3>
              <button
                type="button"
                onClick={() => setRejectingRestaurant(null)}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground"
              >
                <X className="size-5" />
              </button>
            </div>

            <p className="text-xs text-muted-foreground">
              Please specify the reason for rejecting <strong className="text-foreground">{rejectingRestaurant.name}</strong>'s onboarding request.
            </p>

            <textarea
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g. Incomplete FSSAI documentation or food safety license."
              className="w-full p-3 rounded-2xl bg-background border border-border text-xs font-semibold text-foreground focus:outline-none focus:border-[#D2D0C1]"
            />

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRejectingRestaurant(null)}
                className="w-1/2 py-3 rounded-2xl bg-muted text-xs font-bold text-foreground cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleUpdateStatus(rejectingRestaurant, 'Rejected', rejectionReason)}
                className="w-1/2 py-3 rounded-2xl bg-rose-500 text-white font-extrabold text-xs uppercase cursor-pointer"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
