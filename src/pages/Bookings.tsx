import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { Booking, BookingStatus } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { Calendar, Search, Filter, Eye, Info, X } from 'lucide-react';

export const BookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Confirmed' | 'Completed' | 'Cancelled'>('All');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    async function loadBookings() {
      setIsLoading(true);
      const data = await api.getBookings();
      setBookings(data);
      setIsLoading(false);
    }
    loadBookings();
  }, []);

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.bookingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.restaurantName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
            <Calendar className="size-4 text-[#D2D0C1]" />
            <span>Global Booking Ledger</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-foreground mt-1">
            Platform Reservations Oversight
          </h1>
        </div>

        <div className="px-3.5 py-1.5 rounded-full bg-card border border-border text-xs text-muted-foreground font-semibold flex items-center gap-1.5">
          <Info className="size-3.5 text-[#D2D0C1]" />
          <span>Advance Deposit Model Active</span>
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
            placeholder="Search booking ID, diner or venue..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-background border border-border text-xs font-semibold text-foreground focus:outline-none focus:border-[#D2D0C1]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="size-4 text-muted-foreground shrink-0" />
          <span className="text-xs font-bold text-muted-foreground">Status:</span>
          {(['All', 'Confirmed', 'Completed', 'Cancelled'] as const).map((st) => (
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

      {/* Bookings Table */}
      <div className="rounded-3xl bg-card border border-border overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-12 text-center text-xs font-bold text-muted-foreground space-y-2">
            <div className="size-6 rounded-full border-2 border-[#D2D0C1] border-t-transparent animate-spin mx-auto" />
            <span>Loading global reservation logs...</span>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="p-12 text-center text-xs font-semibold text-muted-foreground">
            No booking records found matching filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-background border-b border-border uppercase font-bold text-muted-foreground text-[10px] tracking-wider">
                <tr>
                  <th className="px-6 py-4">Booking ID</th>
                  <th className="px-6 py-4">Diner</th>
                  <th className="px-6 py-4">Restaurant</th>
                  <th className="px-6 py-4">Date & Time</th>
                  <th className="px-6 py-4 text-right">Advance Paid</th>
                  <th className="px-6 py-4 text-right">Remaining Bill</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-medium">
                {filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-muted/40 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-foreground">{b.bookingId}</td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-foreground block">{b.userName}</span>
                      <span className="text-[11px] text-muted-foreground block">{b.userPhone}</span>
                    </td>
                    <td className="px-6 py-4 font-bold text-foreground">{b.restaurantName}</td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {b.date} • {b.time}
                    </td>
                    <td className="px-6 py-4 text-right font-mono font-bold text-emerald-500">
                      ₹{b.advanceAmount}
                    </td>
                    <td className="px-6 py-4 text-right font-mono font-semibold text-muted-foreground">
                      ₹{b.remainingAmount}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <StatusBadge status={b.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedBooking(b)}
                        className="p-2 rounded-xl bg-background border border-border text-foreground hover:bg-muted transition-colors cursor-pointer"
                        title="View Detailed Breakdown"
                      >
                        <Eye className="size-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 relative">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#D2D0C1]">
                  Reservation Audit Details
                </span>
                <h3 className="font-serif font-bold text-2xl text-foreground">
                  {selectedBooking.bookingId}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-background border border-border space-y-3 text-xs">
              <div className="flex justify-between pb-2 border-b border-border">
                <span className="text-muted-foreground font-semibold">Diner Name:</span>
                <span className="font-bold text-foreground">{selectedBooking.userName}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-border">
                <span className="text-muted-foreground font-semibold">Restaurant Venue:</span>
                <span className="font-bold text-foreground">{selectedBooking.restaurantName}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-border">
                <span className="text-muted-foreground font-semibold">Reservation Time:</span>
                <span className="font-bold text-foreground">{selectedBooking.date} at {selectedBooking.time}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-border">
                <span className="text-muted-foreground font-semibold">Table & Party Size:</span>
                <span className="font-bold text-foreground">{selectedBooking.tableNumber} ({selectedBooking.guests} Guests)</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-border">
                <span className="text-muted-foreground font-semibold">Total Estimated Bill:</span>
                <span className="font-bold text-foreground">₹{selectedBooking.totalAmount}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-border">
                <span className="text-emerald-500 font-bold">Advance Deposit Paid (Platform):</span>
                <span className="font-bold text-emerald-500 font-mono">₹{selectedBooking.advanceAmount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground font-semibold">Remaining Settlement (At Venue):</span>
                <span className="font-bold text-foreground font-mono">₹{selectedBooking.remainingAmount}</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-[#D2D0C1]/10 border border-[#D2D0C1]/20 text-[11px] text-muted-foreground space-y-1">
              <div className="flex items-center gap-1 font-bold text-foreground">
                <Info className="size-3.5 text-[#D2D0C1]" />
                <span>Financial Settlement Note</span>
              </div>
              <p>
                StockDine collects the 20% advance deposit to guarantee table availability & hold live stock. The remaining balance is settled directly by the diner at the restaurant venue upon dining completion.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setSelectedBooking(null)}
              className="w-full py-3 rounded-2xl bg-[#D2D0C1] text-[#2B2B2B] font-extrabold text-xs uppercase cursor-pointer"
            >
              Close Record
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
