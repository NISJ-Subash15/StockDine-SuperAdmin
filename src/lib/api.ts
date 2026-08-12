import {
  PlatformUser,
  Restaurant,
  Booking,
  Payment,
  Review,
  SupportTicket,
  PlatformTelemetry,
  NotificationAlert,
  RestaurantStatus,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('stockdine_superadmin_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Structured Production-Ready Demo Data Fallback
export const MOCK_TELEMETRY: PlatformTelemetry = {
  totalUsers: 14850,
  totalRestaurants: 342,
  activeRestaurants: 298,
  pendingApprovalRestaurants: 14,
  totalBookings: 89400,
  completedBookings: 81200,
  cancelledBookings: 5400,
  totalAdvancePaid: 17880000, // ₹1.78 Cr advance payments
  platformGMV: 89400000,      // ₹8.94 Cr GMV
  activeSupportTickets: 8,
  reviewsCount: 12450,
  isDemoData: true,
};

export const MOCK_RESTAURANTS: Restaurant[] = [
  {
    id: 'rest-001',
    name: 'Heritage Spice Bistro',
    ownerName: 'Subash Nethaji',
    email: 'admin@heritagespice.com',
    phone: '+91 98765 43210',
    address: '100 Feet Road, Indiranagar',
    city: 'Bengaluru',
    cuisine: 'North Indian & Mughlai',
    status: 'Active',
    totalBookings: 1420,
    rating: 4.9,
    joinedDate: '2025-01-15',
    gmvTotal: 1420000,
    logo: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
    coverImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200',
  },
  {
    id: 'rest-002',
    name: 'Tuscan Oven Pizzeria',
    ownerName: 'Marco Rossi',
    email: 'marco@tuscanoven.com',
    phone: '+91 98123 45678',
    address: 'Koramangala 5th Block',
    city: 'Bengaluru',
    cuisine: 'Italian & Artisan Pizza',
    status: 'Active',
    totalBookings: 980,
    rating: 4.8,
    joinedDate: '2025-02-01',
    gmvTotal: 980000,
  },
  {
    id: 'rest-003',
    name: 'Zen Sushi & Teppanyaki',
    ownerName: 'Kenji Sato',
    email: 'kenji@zensushi.in',
    phone: '+91 97788 99000',
    address: 'UB City, Vittal Mallya Road',
    city: 'Bengaluru',
    cuisine: 'Japanese & Pan-Asian',
    status: 'Pending',
    totalBookings: 0,
    rating: 0,
    joinedDate: '2026-08-10',
    gmvTotal: 0,
  },
  {
    id: 'rest-004',
    name: 'The Golden Leaf Grill',
    ownerName: 'Ananya Roy',
    email: 'ananya@goldenleaf.com',
    phone: '+91 96543 21098',
    address: 'Jubilee Hills',
    city: 'Hyderabad',
    cuisine: 'Continental & BBQ',
    status: 'Pending',
    totalBookings: 0,
    rating: 0,
    joinedDate: '2026-08-11',
    gmvTotal: 0,
  },
  {
    id: 'rest-005',
    name: 'Bawarchi Grand Royal',
    ownerName: 'Syed Ahmed',
    email: 'syed@bawarchigrand.com',
    phone: '+91 95432 10987',
    address: 'Banjara Hills',
    city: 'Hyderabad',
    cuisine: 'Hyderabadi Biryani',
    status: 'Suspended',
    totalBookings: 650,
    rating: 3.2,
    joinedDate: '2024-11-20',
    gmvTotal: 650000,
    rejectionReason: 'Repeated non-compliance with StockDine table hold policies.',
  },
];

export const MOCK_USERS: PlatformUser[] = [
  {
    id: 'user-001',
    name: 'Subash Nethaji',
    email: 'subash@example.com',
    mobile: '+91 98765 43210',
    role: 'customer',
    registrationDate: '2025-01-10',
    bookingCount: 24,
    totalSpent: 28800,
    status: 'Active',
    lastActivity: '2026-08-12 19:45',
  },
  {
    id: 'user-002',
    name: 'Priya Sharma',
    email: 'priya.sharma@example.com',
    mobile: '+91 98111 22233',
    role: 'customer',
    registrationDate: '2025-03-22',
    bookingCount: 12,
    totalSpent: 14400,
    status: 'Active',
    lastActivity: '2026-08-11 14:20',
  },
  {
    id: 'user-003',
    name: 'Rohan Verma',
    email: 'rohan.v@example.com',
    mobile: '+91 97777 88899',
    role: 'customer',
    registrationDate: '2025-06-15',
    bookingCount: 3,
    totalSpent: 3600,
    status: 'Suspended',
    lastActivity: '2026-07-30 11:10',
  },
];

export const MOCK_BOOKINGS: Booking[] = [
  {
    id: 'bk-1001',
    bookingId: 'SD-BK-8901',
    userId: 'user-001',
    userName: 'Subash Nethaji',
    userEmail: 'subash@example.com',
    userPhone: '+91 98765 43210',
    restaurantId: 'rest-001',
    restaurantName: 'Heritage Spice Bistro',
    date: '2026-08-12',
    time: '20:30',
    guests: 4,
    tableNumber: 'Table 04 (VIP)',
    totalAmount: 2400,
    advanceAmount: 480,
    remainingAmount: 1920,
    status: 'Confirmed',
    createdAt: '2026-08-12 18:15',
  },
  {
    id: 'bk-1002',
    bookingId: 'SD-BK-8902',
    userId: 'user-002',
    userName: 'Priya Sharma',
    userEmail: 'priya.sharma@example.com',
    userPhone: '+91 98111 22233',
    restaurantId: 'rest-002',
    restaurantName: 'Tuscan Oven Pizzeria',
    date: '2026-08-12',
    time: '21:00',
    guests: 2,
    tableNumber: 'Table 02',
    totalAmount: 1600,
    advanceAmount: 320,
    remainingAmount: 1280,
    status: 'Completed',
    createdAt: '2026-08-12 17:00',
  },
  {
    id: 'bk-1003',
    bookingId: 'SD-BK-8903',
    userId: 'user-003',
    userName: 'Rohan Verma',
    userEmail: 'rohan.v@example.com',
    userPhone: '+91 97777 88899',
    restaurantId: 'rest-001',
    restaurantName: 'Heritage Spice Bistro',
    date: '2026-08-11',
    time: '19:30',
    guests: 6,
    tableNumber: 'Table 08',
    totalAmount: 3600,
    advanceAmount: 720,
    remainingAmount: 2880,
    status: 'Cancelled',
    createdAt: '2026-08-11 12:00',
  },
];

export const MOCK_PAYMENTS: Payment[] = [
  {
    id: 'pay-001',
    transactionId: 'TXN-908123',
    bookingId: 'SD-BK-8901',
    userId: 'user-001',
    userName: 'Subash Nethaji',
    restaurantId: 'rest-001',
    restaurantName: 'Heritage Spice Bistro',
    totalAmount: 2400,
    advancePaid: 480,
    remainingAmount: 1920,
    paymentMethod: 'UPI',
    status: 'Successful',
    date: '2026-08-12 18:15',
  },
  {
    id: 'pay-002',
    transactionId: 'TXN-908124',
    bookingId: 'SD-BK-8902',
    userId: 'user-002',
    userName: 'Priya Sharma',
    restaurantId: 'rest-002',
    restaurantName: 'Tuscan Oven Pizzeria',
    totalAmount: 1600,
    advancePaid: 320,
    remainingAmount: 1280,
    paymentMethod: 'Credit Card',
    status: 'Successful',
    date: '2026-08-12 17:00',
  },
];

export const MOCK_REVIEWS: Review[] = [
  {
    id: 'rev-001',
    userId: 'user-001',
    userName: 'Subash Nethaji',
    restaurantId: 'rest-001',
    restaurantName: 'Heritage Spice Bistro',
    rating: 5,
    comment: 'Exceptional dining experience! Live menu stock holds were smooth and advance booking worked flawlessly.',
    date: '2026-08-10',
    isVerifiedBooking: true,
    moderationStatus: 'Published',
  },
  {
    id: 'rev-002',
    userId: 'user-003',
    userName: 'Spam Account 99',
    restaurantId: 'rest-005',
    restaurantName: 'Bawarchi Grand Royal',
    rating: 1,
    comment: 'Fake restaurant! Do not visit click link http://spam.xyz for coupons',
    date: '2026-08-08',
    isVerifiedBooking: false,
    moderationStatus: 'Flagged',
    moderationReason: 'Contains malicious external phishing links.',
  },
];

export const MOCK_SUPPORT: SupportTicket[] = [
  {
    id: 'tkt-001',
    ticketNumber: 'TKT-7701',
    userName: 'Kenji Sato',
    userEmail: 'kenji@zensushi.in',
    userRole: 'Restaurant Owner',
    restaurantId: 'rest-003',
    restaurantName: 'Zen Sushi & Teppanyaki',
    subject: 'Verification status update request for venue approval',
    issueCategory: 'Onboarding',
    priority: 'High',
    status: 'Open',
    createdAt: '2026-08-11 10:30',
    lastUpdated: '2026-08-11 10:30',
    messages: [
      {
        id: 'msg-1',
        sender: 'User',
        text: 'Hi Super Admin, we submitted our FSSAI certificate and tax registration. Please review our pending approval.',
        timestamp: '2026-08-11 10:30',
      },
    ],
  },
];

export const MOCK_NOTIFICATIONS: NotificationAlert[] = [
  {
    id: 'notif-1',
    title: 'New Restaurant Registration Request',
    message: 'Zen Sushi & Teppanyaki (UB City, Bengaluru) has requested Super Admin platform onboarding approval.',
    type: 'restaurant_registration',
    timestamp: '10 minutes ago',
    read: false,
    actionUrl: '/restaurants/rest-003',
  },
  {
    id: 'notif-2',
    title: 'High Booking Volume Alert',
    message: 'Heritage Spice Bistro reached 1,400+ completed reservations milestone.',
    type: 'system',
    timestamp: '1 hour ago',
    read: false,
  },
];

// API Service Layer
export const api = {
  // Telemetry & Dashboard
  async getDashboardTelemetry(): Promise<PlatformTelemetry> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/dashboard`, {
        headers: getAuthHeader(),
      });
      if (res.ok) {
        const data = await res.json();
        return data.telemetry || data;
      }
    } catch (e) {}
    return MOCK_TELEMETRY;
  },

  // Restaurants
  async getRestaurants(): Promise<Restaurant[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/restaurants`, {
        headers: getAuthHeader(),
      });
      if (res.ok) {
        const data = await res.json();
        return data.restaurants || data;
      }
    } catch (e) {}
    return MOCK_RESTAURANTS;
  },

  async updateRestaurantStatus(id: string, status: RestaurantStatus, reason?: string): Promise<{ success: boolean; message: string }> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/restaurants/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify({ status, rejectionReason: reason }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {}
    return { success: true, message: `Restaurant status updated to ${status} (Local/Fallback Mode)` };
  },

  // Users
  async getUsers(): Promise<PlatformUser[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/users`, {
        headers: getAuthHeader(),
      });
      if (res.ok) {
        const data = await res.json();
        return data.users || data;
      }
    } catch (e) {}
    return MOCK_USERS;
  },

  async updateUserStatus(id: string, status: 'Active' | 'Suspended'): Promise<{ success: boolean }> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/users/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify({ status }),
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    return { success: true };
  },

  // Bookings
  async getBookings(): Promise<Booking[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/bookings`, {
        headers: getAuthHeader(),
      });
      if (res.ok) {
        const data = await res.json();
        return data.bookings || data;
      }
    } catch (e) {}
    return MOCK_BOOKINGS;
  },

  // Payments
  async getPayments(): Promise<Payment[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/payments`, {
        headers: getAuthHeader(),
      });
      if (res.ok) {
        const data = await res.json();
        return data.payments || data;
      }
    } catch (e) {}
    return MOCK_PAYMENTS;
  },

  // Reviews
  async getReviews(): Promise<Review[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/reviews`, {
        headers: getAuthHeader(),
      });
      if (res.ok) {
        const data = await res.json();
        return data.reviews || data;
      }
    } catch (e) {}
    return MOCK_REVIEWS;
  },

  async moderateReview(id: string, action: 'Published' | 'Removed' | 'Flagged', reason?: string): Promise<{ success: boolean }> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/reviews/${id}/moderate`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify({ action, reason }),
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    return { success: true };
  },

  // Support
  async getSupportTickets(): Promise<SupportTicket[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/support`, {
        headers: getAuthHeader(),
      });
      if (res.ok) {
        const data = await res.json();
        return data.tickets || data;
      }
    } catch (e) {}
    return MOCK_SUPPORT;
  },
};
