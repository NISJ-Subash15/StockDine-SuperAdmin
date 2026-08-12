import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { PlatformUser } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { Users as UsersIcon, Search, Filter, Eye, UserX, UserCheck, Shield } from 'lucide-react';

export const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<PlatformUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Suspended'>('All');

  useEffect(() => {
    async function loadUsers() {
      setIsLoading(true);
      const data = await api.getUsers();
      setUsers(data);
      setIsLoading(false);
    }
    loadUsers();
  }, []);

  const handleToggleStatus = async (user: PlatformUser) => {
    const newStatus = user.status === 'Active' ? 'Suspended' : 'Active';
    await api.updateUserStatus(user.id, newStatus);
    setUsers((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, status: newStatus } : u))
    );
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.mobile.includes(searchQuery);
    const matchesStatus = statusFilter === 'All' || u.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
            <UsersIcon className="size-4 text-[#D2D0C1]" />
            <span>Platform User Directory</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-foreground mt-1">
            Registered Platform Diners
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
            placeholder="Search by name, email or mobile..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-background border border-border text-xs font-semibold text-foreground focus:outline-none focus:border-[#D2D0C1]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="size-4 text-muted-foreground shrink-0" />
          <span className="text-xs font-bold text-muted-foreground">Filter:</span>
          {(['All', 'Active', 'Suspended'] as const).map((st) => (
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

      {/* Users Table */}
      <div className="rounded-3xl bg-card border border-border overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-12 text-center text-xs font-bold text-muted-foreground space-y-2">
            <div className="size-6 rounded-full border-2 border-[#D2D0C1] border-t-transparent animate-spin mx-auto" />
            <span>Loading registered platform users...</span>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center text-xs font-semibold text-muted-foreground">
            No platform users found matching criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-background border-b border-border uppercase font-bold text-muted-foreground text-[10px] tracking-wider">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Mobile</th>
                  <th className="px-6 py-4">Registration</th>
                  <th className="px-6 py-4 text-center">Bookings</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-medium">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-muted/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="size-9 rounded-xl bg-background border border-border text-foreground font-bold flex items-center justify-center font-serif text-base shrink-0">
                          {u.name[0]}
                        </div>
                        <div>
                          <span className="font-bold text-foreground block">{u.name}</span>
                          <span className="text-[11px] text-muted-foreground block">{u.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono font-semibold text-muted-foreground">
                      {u.mobile}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{u.registrationDate}</td>
                    <td className="px-6 py-4 text-center font-bold text-foreground">
                      {u.bookingCount}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <StatusBadge status={u.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/users/${u.id}`}
                          className="p-2 rounded-xl bg-background border border-border text-foreground hover:bg-muted transition-colors cursor-pointer"
                          title="View Profile Details"
                        >
                          <Eye className="size-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(u)}
                          className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                            u.status === 'Active'
                              ? 'bg-rose-500/10 border-rose-500/20 text-rose-500 hover:bg-rose-500/20'
                              : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/20'
                          }`}
                          title={u.status === 'Active' ? 'Suspend Account' : 'Activate Account'}
                        >
                          {u.status === 'Active' ? <UserX className="size-4" /> : <UserCheck className="size-4" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
