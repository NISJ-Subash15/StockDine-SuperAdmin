import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { PlatformUser, Booking } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { ArrowLeft, User, Mail, Phone, Calendar, Shield, CreditCard, Clock, UserX, UserCheck } from 'lucide-react';

export const UserDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [user, setUser] = useState<PlatformUser | null>(null);
  const [userBookings, setUserBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      setIsLoading(true);
      const allUsers = await api.getUsers();
      const match = allUsers.find((u) => u.id === id) || allUsers[0];
      setUser(match);

      const allBookings = await api.getBookings();
      setUserBookings(allBookings.filter((b) => b.userId === match.id));
      setIsLoading(false);
    }
    loadUser();
  }, [id]);

  const handleToggleStatus = async () => {
    if (!user) return;
    const newStatus = user.status === 'Active' ? 'Suspended' : 'Active';
    await api.updateUserStatus(user.id, newStatus);
    setUser({ ...user, status: newStatus });
  };

  if (isLoading || !user) {
    return (
      <div className="p-12 text-center text-xs font-bold text-muted-foreground space-y-2">
        <div className="size-6 rounded-full border-2 border-[#D2D0C1] border-t-transparent animate-spin mx-auto" />
        <span>Loading user account details...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex items-center gap-4 pb-4 border-b border-border">
        <Link
          to="/users"
          className="p-2 rounded-xl bg-card border border-border text-foreground hover:bg-muted transition-colors"
        >
          <ArrowLeft className="size-4" />
        </Link>
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            User Account Profile
          </span>
          <h1 className="text-2xl font-serif font-bold text-foreground">{user.name}</h1>
        </div>
      </div>

      {/* Profile Overview Card */}
      <div className="p-6 rounded-3xl bg-card border border-border shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="size-16 rounded-2xl bg-background border border border-[#D2D0C1]/40 flex items-center justify-center font-serif text-3xl font-bold text-[#D2D0C1]">
            {user.name[0]}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-foreground">{user.name}</h2>
              <StatusBadge status={user.status} />
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground font-medium">
              <span className="flex items-center gap-1">
                <Mail className="size-3.5" />
                {user.email}
              </span>
              <span className="flex items-center gap-1">
                <Phone className="size-3.5" />
                {user.mobile}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="size-3.5" />
                Joined {user.registrationDate}
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleToggleStatus}
          className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            user.status === 'Active'
              ? 'bg-rose-500/10 border-rose-500/20 text-rose-500 hover:bg-rose-500/20'
              : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/20'
          }`}
        >
          {user.status === 'Active' ? (
            <>
              <UserX className="size-4" />
              <span>Suspend Account</span>
            </>
          ) : (
            <>
              <UserCheck className="size-4" />
              <span>Activate Account</span>
            </>
          )}
        </button>
      </div>

      {/* Booking History Table */}
      <div className="space-y-4">
        <h3 className="font-serif font-bold text-xl text-foreground">User Booking History</h3>
        <div className="rounded-3xl bg-card border border-border overflow-hidden shadow-sm">
          {userBookings.length === 0 ? (
            <div className="p-8 text-center text-xs text-muted-foreground font-semibold">
              No booking records found for this user.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-background border-b border-border uppercase font-bold text-muted-foreground text-[10px] tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Booking ID</th>
                    <th className="px-6 py-4">Restaurant</th>
                    <th className="px-6 py-4">Date & Time</th>
                    <th className="px-6 py-4">Guests</th>
                    <th className="px-6 py-4 text-right">Advance Paid</th>
                    <th className="px-6 py-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border font-medium">
                  {userBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-muted/40 transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-foreground">{b.bookingId}</td>
                      <td className="px-6 py-4 font-bold text-foreground">{b.restaurantName}</td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {b.date} • {b.time}
                      </td>
                      <td className="px-6 py-4">{b.guests} Guests</td>
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
