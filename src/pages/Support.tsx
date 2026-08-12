import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { SupportTicket, SupportPriority, SupportStatus } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { LifeBuoy, Search, Filter, MessageSquare, Send, X, Clock } from 'lucide-react';

export const SupportPage: React.FC = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Open' | 'In Progress' | 'Resolved' | 'Closed'>('All');
  const [priorityFilter, setPriorityFilter] = useState<'All' | 'Low' | 'Medium' | 'High' | 'Urgent'>('All');

  const [activeTicket, setActiveTicket] = useState<SupportTicket | null>(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    async function loadTickets() {
      setIsLoading(true);
      const data = await api.getSupportTickets();
      setTickets(data);
      setIsLoading(false);
    }
    loadTickets();
  }, []);

  const handleUpdateStatus = (ticketId: string, status: SupportStatus) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status, lastUpdated: 'Just now' } : t))
    );
    if (activeTicket && activeTicket.id === ticketId) {
      setActiveTicket({ ...activeTicket, status, lastUpdated: 'Just now' });
    }
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeTicket) return;

    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: 'Super Admin Support' as const,
      text: replyText,
      timestamp: 'Just now',
    };

    const updated = {
      ...activeTicket,
      messages: [...activeTicket.messages, newMsg],
      lastUpdated: 'Just now',
    };

    setActiveTicket(updated);
    setTickets((prev) => prev.map((t) => (t.id === activeTicket.id ? updated : t)));
    setReplyText('');
  };

  const filteredTickets = tickets.filter((t) => {
    const matchesSearch =
      t.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
    const matchesPriority = priorityFilter === 'All' || t.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
            <LifeBuoy className="size-4 text-[#D2D0C1]" />
            <span>Platform Support Escalations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-foreground mt-1">
            Global Support Desk
          </h1>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between bg-card p-4 rounded-2xl border border-border">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-3 size-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search ticket #, subject or user..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-background border border-border text-xs font-semibold text-foreground focus:outline-none focus:border-[#D2D0C1]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <Filter className="size-4 text-muted-foreground shrink-0" />
          <span className="text-xs font-bold text-muted-foreground">Status:</span>
          {(['All', 'Open', 'In Progress', 'Resolved'] as const).map((st) => (
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

      {/* Tickets Table */}
      <div className="rounded-3xl bg-card border border-border overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-12 text-center text-xs font-bold text-muted-foreground space-y-2">
            <div className="size-6 rounded-full border-2 border-[#D2D0C1] border-t-transparent animate-spin mx-auto" />
            <span>Loading support desk tickets...</span>
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="p-12 text-center text-xs font-semibold text-muted-foreground">
            No support tickets match active filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-background border-b border-border uppercase font-bold text-muted-foreground text-[10px] tracking-wider">
                <tr>
                  <th className="px-6 py-4">Ticket</th>
                  <th className="px-6 py-4">Requester</th>
                  <th className="px-6 py-4">Subject & Category</th>
                  <th className="px-6 py-4 text-center">Priority</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-medium">
                {filteredTickets.map((t) => (
                  <tr key={t.id} className="hover:bg-muted/40 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-foreground">{t.ticketNumber}</td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-foreground block">{t.userName}</span>
                      <span className="text-[11px] text-muted-foreground block">{t.userRole}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-foreground block">{t.subject}</span>
                      <span className="text-[10px] font-semibold text-muted-foreground uppercase">{t.issueCategory}</span>
                    </td>
                    <td className="px-6 py-4 text-center font-bold">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          t.priority === 'Urgent' || t.priority === 'High'
                            ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                            : 'bg-muted text-muted-foreground border border-border'
                        }`}
                      >
                        {t.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <StatusBadge status={t.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => setActiveTicket(t)}
                        className="px-3 py-1.5 rounded-xl bg-background border border-border text-foreground hover:bg-muted font-bold text-xs cursor-pointer flex items-center gap-1 ml-auto"
                      >
                        <MessageSquare className="size-3.5" />
                        <span>Manage</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Ticket Details & Chat Modal */}
      {activeTicket && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#D2D0C1]">
                  Ticket #{activeTicket.ticketNumber} • {activeTicket.issueCategory}
                </span>
                <h3 className="font-serif font-bold text-xl text-foreground">
                  {activeTicket.subject}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveTicket(null)}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="flex items-center justify-between bg-background p-3 rounded-2xl border border-border text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-foreground">Status:</span>
                <StatusBadge status={activeTicket.status} />
              </div>
              <div className="flex gap-2">
                {(['In Progress', 'Resolved', 'Closed'] as SupportStatus[]).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => handleUpdateStatus(activeTicket.id, st)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-colors ${
                      activeTicket.status === st
                        ? 'bg-[#D2D0C1] text-[#2B2B2B]'
                        : 'bg-card border border-border text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Set {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Conversation Thread */}
            <div className="flex-1 overflow-y-auto space-y-3 p-4 bg-background rounded-2xl border border-border min-h-[200px]">
              {activeTicket.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-3 rounded-2xl max-w-lg space-y-1 text-xs ${
                    msg.sender === 'Super Admin Support'
                      ? 'ml-auto bg-[#D2D0C1]/20 text-foreground border border-[#D2D0C1]/30'
                      : 'mr-auto bg-card text-foreground border border-border'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold text-[10px] uppercase text-muted-foreground">
                    <span>{msg.sender}</span>
                    <span>{msg.timestamp}</span>
                  </div>
                  <p className="font-medium leading-relaxed">{msg.text}</p>
                </div>
              ))}
            </div>

            {/* Reply Form */}
            <form onSubmit={handleSendReply} className="flex gap-2 pt-2">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type Super Admin response..."
                className="flex-1 px-4 py-3 rounded-2xl bg-background border border-border text-xs font-semibold text-foreground focus:outline-none focus:border-[#D2D0C1]"
              />
              <button
                type="submit"
                className="px-5 py-3 rounded-2xl bg-[#D2D0C1] text-[#2B2B2B] font-extrabold text-xs uppercase cursor-pointer flex items-center gap-1.5 shrink-0"
              >
                <Send className="size-4" />
                <span>Send</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
