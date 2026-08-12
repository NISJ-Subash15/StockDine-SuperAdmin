import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../lib/api';
import { Restaurant, Booking, RestaurantStatus } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { ArrowLeft, Building2, User, Mail, Phone, MapPin, Calendar, Star, DollarSign, CheckCircle2, XCircle } from 'lucide-react';

export const RestaurantDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [restBookings, setRestBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const allRest = await api.getRestaurants();
      const match = allRest.find((r) => r.id === id) || allRest[0];
      setRestaurant(match);

      const allBookings = await api.getBookings();
      setRestBookings(allBookings.filter((b) => b.restaurantId === match.id));
      setIsLoading(false);
    }
    loadData();
  }, [id]);

  const handleUpdateStatus = async (status: RestaurantStatus) => {
    if (!restaurant) return;
    await api.updateRestaurantStatus(restaurant.id, status);
    setRestaurant({ ...restaurant, status });
  };

  if (isLoading || !restaurant) {
    return (
      <div className="p-12 text-center text-xs font-bold text-muted-foreground space-y-2">
        <div className="size-6 rounded-full border-2 border-[#D2D0C1] border-t-transparent animate-spin mx-auto" />
        <span>Loading restaurant profile details...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex items-center gap-4 pb-4 border-b border-border">
        <Link
          to="/restaurants"
          className="p-2 rounded-xl bg-card border border-border text-foreground hover:bg-muted transition-colors"
        >
          <ArrowLeft className="size-4" />
        </Link>
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Restaurant Oversight Profile
          </span>
          <h1 className="text-2xl font-serif font-bold text-foreground">{restaurant.name}</h1>
        </div>
      </div>

      {/* Main Profile Overview Card */}
      <div className="p-6 rounded-3xl bg-card border border-border shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="size-16 rounded-2xl bg-background border border-[#D2D0C1]/40 flex items-center justify-center font-serif text-3xl font-bold text-[#D2D0C1]">
            {restaurant.name[0]}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-foreground">{restaurant.name}</h2>
              <StatusBadge status={restaurant.status} />
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground font-medium">
              <span className="flex items-center gap-1">
                <User className="size-3.5" />
                Owner: {restaurant.ownerName}
              </span>
              <span className="flex items-center gap-1">
                <Mail className="size-3.5" />
                {restaurant.email}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="size-3.5" />
                {restaurant.address}, {restaurant.city}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {restaurant.status === 'Pending' && (
            <>
              <button
                type="button"
                onClick={() => handleUpdateStatus('Active')}
                className="px-4 py-2.5 rounded-xl bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <CheckCircle2 className="size-4" />
                <span>Approve Venue</span>
              </button>
              <button
                type="button"
                onClick={() => handleUpdateStatus('Rejected')}
                className="px-4 py-2.5 rounded-xl bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <XCircle className="size-4" />
                <span>Reject</span>
              </button>
            </>
          )}

          {restaurant.status === 'Active' && (
            <button
              type="button"
              onClick={() => handleUpdateStatus('Suspended')}
              className="px-4 py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 hover:bg-rose-500/20 text-xs font-bold cursor-pointer"
            >
              Suspend Platform Access
            </button>
          )}

          {restaurant.status === 'Suspended' && (
            <button
              type="button"
              onClick={() => handleUpdateStatus('Active')}
              className="px-4 py-2.5 rounded-xl bg-emerald-500 text-white font-bold text-xs cursor-pointer shadow-sm"
            >
              Reactivate Venue
            </button>
          )}
        </div>
      </div>

      {/* Rejection Note Warning */}
      {restaurant.rejectionReason && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-bold flex items-center gap-2">
          <span>Rejection / Moderation Note: {restaurant.rejectionReason}</span>
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-card border border-border space-y-1">
          <span className="text-xs font-bold text-muted-foreground uppercase">Total Reservations</span>
          <div className="text-2xl font-serif font-bold text-foreground">{restaurant.totalBookings}</div>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border space-y-1">
          <span className="text-xs font-bold text-muted-foreground uppercase">Platform GMV Generated</span>
          <div className="text-2xl font-serif font-bold text-foreground">₹{(restaurant.gmvTotal / 100000).toFixed(2)}L</div>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border space-y-1">
          <span className="text-xs font-bold text-muted-foreground uppercase">Average Rating</span>
          <div className="text-2xl font-serif font-bold text-foreground flex items-center gap-1.5">
            <Star className="size-5 fill-[#D2D0C1] text-[#D2D0C1]" />
            <span>{restaurant.rating > 0 ? restaurant.rating : 'N/A'}</span>
          </div>
        </div>
      </div>

      {/* Associated Bookings */}
      <div className="space-y-4 pt-2">
        <h3 className="font-serif font-bold text-xl text-foreground">Venue Bookings Log</h3>
        <div className="rounded-3xl bg-card border border-border overflow-hidden shadow-sm">
          {restBookings.length === 0 ? (
            <div className="p-8 text-center text-xs text-muted-foreground font-semibold">
              No recent reservations logged for this restaurant.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-background border-b border-border uppercase font-bold text-muted-foreground text-[10px] tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Booking ID</th>
                    <th className="px-6 py-4">Diner</th>
                    <th className="px-6 py-4">Date & Time</th>
                    <th className="px-6 py-4">Table</th>
                    <th className="px-6 py-4 text-right">Advance Paid</th>
                    <th className="px-6 py-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border font-medium">
                  {restBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-muted/40 transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-foreground">{b.bookingId}</td>
                      <td className="px-6 py-4 font-bold text-foreground">{b.userName}</td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {b.date} • {b.time}
                      </td>
                      <td className="px-6 py-4">{b.tableNumber}</td>
                      <td className="px-6 py-4 text-right font-mono font-bold text-foreground">
                        ₹{b.advanceAmount}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <StatusBadge status={b.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
