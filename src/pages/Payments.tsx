import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { Payment } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { CreditCard, Search, Filter, ShieldCheck, DollarSign } from 'lucide-react';

export const PaymentsPage: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Successful' | 'Pending' | 'Failed' | 'Refunded'>('All');

  useEffect(() => {
    async function loadPayments() {
      setIsLoading(true);
      const data = await api.getPayments();
      setPayments(data);
      setIsLoading(false);
    }
    loadPayments();
  }, []);

  const filteredPayments = payments.filter((p) => {
    const matchesSearch =
      p.transactionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.bookingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.restaurantName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalAdvanceVolume = payments.reduce((sum, p) => sum + (p.status === 'Successful' ? p.advancePaid : 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
            <CreditCard className="size-4 text-[#D2D0C1]" />
            <span>Platform Financial Audit</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-foreground mt-1">
            Advance Payment Monitoring
          </h1>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border flex items-center gap-4">
          <div>
            <span className="text-[10px] font-extrabold uppercase text-muted-foreground block">
              Total Advance Collected
            </span>
            <span className="text-xl font-serif font-bold text-emerald-500 font-mono">
              ₹{totalAdvanceVolume.toLocaleString()}
            </span>
          </div>
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
            placeholder="Search TXN ID, booking, user or venue..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-background border border-border text-xs font-semibold text-foreground focus:outline-none focus:border-[#D2D0C1]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="size-4 text-muted-foreground shrink-0" />
          <span className="text-xs font-bold text-muted-foreground">Status:</span>
          {(['All', 'Successful', 'Pending', 'Failed', 'Refunded'] as const).map((st) => (
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

      {/* Payments Table */}
      <div className="rounded-3xl bg-card border border-border overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-12 text-center text-xs font-bold text-muted-foreground space-y-2">
            <div className="size-6 rounded-full border-2 border-[#D2D0C1] border-t-transparent animate-spin mx-auto" />
            <span>Loading payment records...</span>
          </div>
        ) : filteredPayments.length === 0 ? (
          <div className="p-12 text-center text-xs font-semibold text-muted-foreground">
            No transaction records found matching criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-background border-b border-border uppercase font-bold text-muted-foreground text-[10px] tracking-wider">
                <tr>
                  <th className="px-6 py-4">Transaction ID</th>
                  <th className="px-6 py-4">Booking ID</th>
                  <th className="px-6 py-4">Diner & Venue</th>
                  <th className="px-6 py-4 text-right">Advance Paid</th>
                  <th className="px-6 py-4 text-right">Remaining Venue Bill</th>
                  <th className="px-6 py-4 text-center">Method</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-medium">
                {filteredPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-muted/40 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-foreground">{p.transactionId}</td>
                    <td className="px-6 py-4 font-mono text-muted-foreground">{p.bookingId}</td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-foreground block">{p.userName}</span>
                      <span className="text-[11px] text-muted-foreground block">{p.restaurantName}</span>
                    </td>
                    <td className="px-6 py-4 text-right font-mono font-bold text-emerald-500">
                      ₹{p.advancePaid}
                    </td>
                    <td className="px-6 py-4 text-right font-mono font-semibold text-muted-foreground">
                      ₹{p.remainingAmount}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-2.5 py-1 rounded-lg bg-background border border-border text-[11px] font-semibold text-foreground">
                        {p.paymentMethod}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="px-6 py-4 text-right text-muted-foreground">{p.date}</td>
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
