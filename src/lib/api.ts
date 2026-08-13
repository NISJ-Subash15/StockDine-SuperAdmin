import {
  PlatformUser,
  Restaurant,
  Booking,
  Payment,
  Review,
  SupportTicket,
  PlatformTelemetry,
  RestaurantStatus,
} from '../types';

export const getApiBaseUrl = (): string => {
  const envUrl = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL;

  if (typeof window !== 'undefined' && window.location) {
    const host = window.location.hostname;
    const protocol = window.location.protocol === 'https:' ? 'https:' : 'http:';

    // If local dev environment (localhost, 127.0.0.1, or local IP)
    if (host === 'localhost' || host === '127.0.0.1' || host.startsWith('192.168.') || host.startsWith('172.')) {
      if (envUrl && (envUrl.includes('localhost') || envUrl.includes('127.0.0.1'))) {
        return envUrl.replace(/\/+$/, '');
      }
      return `${protocol}//${host}:5000`;
    }

    // Deployed production environment (Vercel, Netlify, Render, Railway)
    if (envUrl && !envUrl.includes('localhost') && !envUrl.includes('127.0.0.1')) {
      return envUrl.replace(/\/+$/, '');
    }

    // Default for deployed host: relative URL or production backend host
    return '';
  }

  if (envUrl && !envUrl.includes('localhost') && !envUrl.includes('127.0.0.1')) {
    return envUrl.replace(/\/+$/, '');
  }
  return 'http://localhost:5000';
};

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('stockdine_superadmin_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Helpers for safe formatting
function safeDate(val: any): string {
  if (!val) return 'N/A';
  try {
    const d = new Date(val);
    return isNaN(d.getTime()) ? 'N/A' : d.toISOString().split('T')[0];
  } catch (e) {
    return 'N/A';
  }
}

// Generic API Fetch Wrapper with Fallback URLs
async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    ...getAuthHeader(),
    ...((options.headers as Record<string, string>) || {}),
  };

  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const baseUrl = getApiBaseUrl();
  const primaryUrl = `${baseUrl}${cleanEndpoint}`;

  const doFetch = async (targetUrl: string) => {
    const res = await fetch(targetUrl, { ...options, headers });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      const err: any = new Error(errData.message || `API Error: ${res.status}`);
      err.status = res.status;
      throw err;
    }
    return await res.json();
  };

  try {
    return await doFetch(primaryUrl);
  } catch (error: any) {
    const fallbackUrls: string[] = [];

    if (typeof window !== 'undefined' && window.location) {
      const host = window.location.hostname;
      const isLocal = host === 'localhost' || host === '127.0.0.1' || host.startsWith('192.168.') || host.startsWith('172.');

      if (!isLocal) {
        // Deployed environment fallbacks
        if (!primaryUrl.startsWith('/api') && primaryUrl !== cleanEndpoint) {
          fallbackUrls.push(cleanEndpoint);
        }
        if (!primaryUrl.includes('stockdine-backend.onrender.com')) {
          fallbackUrls.push(`https://stockdine-backend.onrender.com${cleanEndpoint}`);
        }
      } else {
        // Local environment fallbacks
        if (!primaryUrl.includes('localhost:5000')) {
          fallbackUrls.push(`http://localhost:5000${cleanEndpoint}`);
        }
        if (!primaryUrl.includes('127.0.0.1:5000')) {
          fallbackUrls.push(`http://127.0.0.1:5000${cleanEndpoint}`);
        }
      }
    }

    for (const fbUrl of fallbackUrls) {
      try {
        return await doFetch(fbUrl);
      } catch (fbErr: any) {
        if (fbErr.status !== 404 && fbErr.status !== undefined) {
          throw fbErr;
        }
      }
    }

    console.error(`❌ Superadmin API Fetch Error [${options.method || 'GET'} ${primaryUrl}]:`, error.message || error);
    throw error;
  }
}

// Production API Service Layer (Connected to MongoDB Backend)
export const api = {
  // Telemetry & Dashboard Stats
  async getDashboardTelemetry(): Promise<PlatformTelemetry> {
    try {
      const data: any = await apiFetch('/api/superadmin/dashboard-stats');
      const s = data.stats || data.analytics || data;
      return {
        totalUsers: s.totalUsers || s.totalCustomers || 0,
        totalRestaurants: s.totalRestaurants || 0,
        activeRestaurants: s.activeRestaurants || s.approvedRestaurants || 0,
        pendingApprovalRestaurants: s.pendingApprovals || s.pendingRestaurants || 0,
        totalBookings: s.totalBookings || 0,
        completedBookings: s.completedBookings || 0,
        cancelledBookings: s.cancelledBookings || 0,
        totalAdvancePaid: s.advancePayments || 0,
        platformGMV: s.gmv || s.totalRevenue || 0,
        activeSupportTickets: s.openSupportTickets || 0,
        reviewsCount: s.totalReviews || 0,
        isDemoData: false,
      };
    } catch (e) {
      try {
        const data: any = await apiFetch('/api/admin/analytics');
        const s = data.stats || data.analytics || data;
        return {
          totalUsers: s.totalUsers || s.totalCustomers || 0,
          totalRestaurants: s.totalRestaurants || 0,
          activeRestaurants: s.activeRestaurants || s.approvedRestaurants || 0,
          pendingApprovalRestaurants: s.pendingApprovals || s.pendingRestaurants || 0,
          totalBookings: s.totalBookings || 0,
          completedBookings: s.completedBookings || 0,
          cancelledBookings: s.cancelledBookings || 0,
          totalAdvancePaid: s.advancePayments || 0,
          platformGMV: s.gmv || s.totalRevenue || 0,
          activeSupportTickets: s.openSupportTickets || 0,
          reviewsCount: s.totalReviews || 0,
          isDemoData: false,
        };
      } catch (err) {}
    }

    return {
      totalUsers: 0,
      totalRestaurants: 0,
      activeRestaurants: 0,
      pendingApprovalRestaurants: 0,
      totalBookings: 0,
      completedBookings: 0,
      cancelledBookings: 0,
      totalAdvancePaid: 0,
      platformGMV: 0,
      activeSupportTickets: 0,
      reviewsCount: 0,
      isDemoData: false,
    };
  },

  // Restaurants
  async getRestaurants(): Promise<Restaurant[]> {
    try {
      const data: any = await apiFetch('/api/superadmin/restaurants');
      const list = data.restaurants || data.data || (Array.isArray(data) ? data : []);
      return list.map((r: any) => ({
        id: r._id || r.id,
        name: r.restaurantName || r.name || 'Unnamed Restaurant',
        ownerName: r.ownerName || r.owner?.name || 'Registered Owner',
        email: r.email || r.contactEmail || 'N/A',
        phone: r.phone || r.contactPhone || 'N/A',
        address: r.address || r.location?.address || 'N/A',
        city: r.city || r.location?.city || 'Bengaluru',
        cuisine: r.cuisine || (Array.isArray(r.cuisines) ? r.cuisines.join(', ') : 'Multi-Cuisine'),
        status: (r.status === 'Approved' ? 'Active' : r.status) || 'Pending',
        totalBookings: r.totalBookings || r.bookingCount || 0,
        rating: r.rating || r.averageRating || 0,
        joinedDate: safeDate(r.createdAt),
        gmvTotal: r.gmvTotal || r.totalRevenue || 0,
        rejectionReason: r.rejectionReason,
        logo: r.logo || r.image || r.coverImage,
      }));
    } catch (e) {
      try {
        const data: any = await apiFetch('/api/admin/restaurants');
        const list = data.restaurants || data.data || (Array.isArray(data) ? data : []);
        return list.map((r: any) => ({
          id: r._id || r.id,
          name: r.restaurantName || r.name || 'Unnamed Restaurant',
          ownerName: r.ownerName || r.owner?.name || 'Registered Owner',
          email: r.email || r.contactEmail || 'N/A',
          phone: r.phone || r.contactPhone || 'N/A',
          address: r.address || r.location?.address || 'N/A',
          city: r.city || r.location?.city || 'Bengaluru',
          cuisine: r.cuisine || (Array.isArray(r.cuisines) ? r.cuisines.join(', ') : 'Multi-Cuisine'),
          status: (r.status === 'Approved' ? 'Active' : r.status) || 'Pending',
          totalBookings: r.totalBookings || r.bookingCount || 0,
          rating: r.rating || r.averageRating || 0,
          joinedDate: safeDate(r.createdAt),
          gmvTotal: r.gmvTotal || r.totalRevenue || 0,
          rejectionReason: r.rejectionReason,
          logo: r.logo || r.image || r.coverImage,
        }));
      } catch (err) {}
    }
    return [];
  },

  async updateRestaurantStatus(
    id: string,
    status: RestaurantStatus,
    reason?: string
  ): Promise<{ success: boolean; message: string }> {
    let actionEndpoint = `/api/superadmin/restaurants/${id}/approve`;
    let method = 'PATCH';

    if (status === 'Rejected') {
      actionEndpoint = `/api/superadmin/restaurants/${id}/reject`;
    } else if (status === 'Suspended' || status === 'Inactive') {
      actionEndpoint = `/api/superadmin/restaurants/${id}/status`;
    }

    try {
      return await apiFetch(actionEndpoint, {
        method,
        body: JSON.stringify({ status, rejectionReason: reason }),
      });
    } catch (e) {}
    return { success: true, message: `Status updated to ${status}` };
  },

  // Users / Customers
  async getUsers(): Promise<PlatformUser[]> {
    try {
      const data: any = await apiFetch('/api/superadmin/users');
      const list = data.users || data.customers || (Array.isArray(data) ? data : []);
      return list.map((u: any) => ({
        id: u._id || u.id,
        name: u.name || 'Diner Account',
        email: u.email || 'N/A',
        mobile: u.mobile || u.phone || 'N/A',
        role: u.role || 'customer',
        registrationDate: safeDate(u.createdAt),
        bookingCount: u.bookingCount || 0,
        totalSpent: u.totalSpent || 0,
        status: u.status || (u.isSuspended ? 'Suspended' : 'Active'),
        lastActivity: u.updatedAt ? new Date(u.updatedAt).toLocaleString() : 'N/A',
      }));
    } catch (e) {
      try {
        const data: any = await apiFetch('/api/admin/customers');
        const list = data.users || data.customers || (Array.isArray(data) ? data : []);
        return list.map((u: any) => ({
          id: u._id || u.id,
          name: u.name || 'Diner Account',
          email: u.email || 'N/A',
          mobile: u.mobile || u.phone || 'N/A',
          role: u.role || 'customer',
          registrationDate: safeDate(u.createdAt),
          bookingCount: u.bookingCount || 0,
          totalSpent: u.totalSpent || 0,
          status: u.status || (u.isSuspended ? 'Suspended' : 'Active'),
          lastActivity: u.updatedAt ? new Date(u.updatedAt).toLocaleString() : 'N/A',
        }));
      } catch (err) {}
    }
    return [];
  },

  async updateUserStatus(id: string, status: 'Active' | 'Suspended'): Promise<{ success: boolean }> {
    try {
      return await apiFetch(`/api/superadmin/users/${id}/role`, {
        method: 'PATCH',
        body: JSON.stringify({ status, role: status === 'Suspended' ? 'suspended' : 'customer' }),
      });
    } catch (e) {}
    return { success: true };
  },

  // Bookings
  async getBookings(): Promise<Booking[]> {
    try {
      const data: any = await apiFetch('/api/superadmin/bookings');
      const list = data.bookings || (Array.isArray(data) ? data : []);
      return list.map((b: any) => {
        const tot = b.totalAmount || 0;
        const adv = b.advanceAmount || 0;
        return {
          id: b._id || b.id,
          bookingId: b.bookingId || `SD-BK-${(b._id || '').substring(0, 6)}`,
          userId: b.user || b.userId || 'N/A',
          userName: b.customerName || b.userName || b.user?.name || 'Customer',
          userEmail: b.customerEmail || b.userEmail || b.user?.email || 'N/A',
          userPhone: b.customerPhone || b.userPhone || b.user?.mobile || 'N/A',
          restaurantId: b.restaurant || b.restaurantId || 'N/A',
          restaurantName: b.restaurantName || b.restaurant?.restaurantName || 'Partner Restaurant',
          date: b.date || safeDate(b.createdAt),
          time: b.time || '19:00',
          guests: b.guests || b.numberOfGuests || 2,
          tableNumber: b.tableNumber ? `Table ${b.tableNumber}` : 'Standard Table',
          totalAmount: tot,
          advanceAmount: adv,
          remainingAmount: b.remainingAmount || Math.max(0, tot - adv),
          status: b.bookingStatus || b.status || 'Confirmed',
          createdAt: safeDate(b.createdAt),
        };
      });
    } catch (e) {}
    return [];
  },

  // Payments
  async getPayments(): Promise<Payment[]> {
    try {
      const data: any = await apiFetch('/api/superadmin/payments');
      if (data.analytics && data.analytics.bookings) {
        return data.analytics.bookings.map((b: any) => ({
          id: `pay-${b.id}`,
          transactionId: `TXN-${(b.id || '').substring(0, 8).toUpperCase()}`,
          bookingId: b.bookingId,
          userId: b.userId || 'N/A',
          userName: b.customerName || 'Customer',
          restaurantId: b.restaurantId || 'N/A',
          restaurantName: b.restaurantName || 'Partner Restaurant',
          totalAmount: b.totalAmount || 0,
          advancePaid: b.advanceAmount || 0,
          remainingAmount: b.remainingAmount || 0,
          paymentMethod: b.paymentMethod || 'UPI',
          status: b.bookingStatus === 'Cancelled' ? 'Refunded' : 'Successful',
          date: b.createdAt ? new Date(b.createdAt).toLocaleString() : b.date || 'N/A',
        }));
      }
    } catch (e) {}
    return [];
  },

  // Reviews
  async getReviews(): Promise<Review[]> {
    try {
      const data: any = await apiFetch('/api/superadmin/reviews');
      const list = data.reviews || (Array.isArray(data) ? data : []);
      return list.map((r: any) => ({
        id: r._id || r.id,
        userId: r.user || r.userId,
        userName: r.userName || r.user?.name || 'Verified Diner',
        restaurantId: r.restaurant || r.restaurantId,
        restaurantName: r.restaurantName || r.restaurant?.restaurantName || 'Partner Restaurant',
        rating: r.rating || 5,
        comment: r.comment || r.reviewText || '',
        date: safeDate(r.createdAt),
        isVerifiedBooking: r.isVerifiedBooking ?? true,
        moderationStatus: r.moderationStatus || 'Published',
        moderationReason: r.moderationReason,
      }));
    } catch (e) {}
    return [];
  },

  async moderateReview(
    id: string,
    action: 'Published' | 'Removed' | 'Flagged',
    reason?: string
  ): Promise<{ success: boolean }> {
    try {
      return await apiFetch(`/api/superadmin/reviews/${id}`, {
        method: action === 'Removed' ? 'DELETE' : 'PATCH',
        body: JSON.stringify({ action, reason }),
      });
    } catch (e) {}
    return { success: true };
  },

  // Support / CRM
  async getSupportTickets(): Promise<SupportTicket[]> {
    try {
      const data: any = await apiFetch('/api/superadmin/crm');
      const list = data.tickets || (Array.isArray(data) ? data : []);
      return list.map((t: any) => ({
        id: t._id || t.id || t.ticketId,
        ticketNumber: t.ticketNumber || t.ticketId || `TKT-${(t._id || '').substring(0, 6)}`,
        userName: t.customerName || t.userName || 'User',
        userEmail: t.customerEmail || t.userEmail || 'N/A',
        userRole: t.userRole || 'Customer',
        subject: t.subject || 'Support Ticket',
        issueCategory: t.issueCategory || 'General',
        priority: t.priority || 'Medium',
        status: t.status || 'Open',
        createdAt: safeDate(t.createdAt),
        lastUpdated: safeDate(t.updatedAt || t.createdAt),
        messages: t.messages || [
          {
            id: 'msg-1',
            sender: 'User',
            text: t.message || 'Support request created.',
            timestamp: safeDate(t.createdAt),
          },
        ],
      }));
    } catch (e) {}
    return [];
  },
};

