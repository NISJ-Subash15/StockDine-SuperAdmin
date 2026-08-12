export type UserRole = 'superadmin' | 'restaurant' | 'customer';

export interface SuperAdminUser {
  id: string;
  email: string;
  name: string;
  role: 'superadmin';
  avatar?: string;
}

export interface PlatformUser {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: 'customer' | 'restaurant' | 'superadmin';
  registrationDate: string;
  bookingCount: number;
  totalSpent: number;
  status: 'Active' | 'Suspended' | 'Pending';
  lastActivity: string;
}

export type RestaurantStatus = 'Pending' | 'Approved' | 'Rejected' | 'Suspended' | 'Active' | 'Inactive';

export interface Restaurant {
  id: string;
  name: string;
  ownerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  cuisine: string;
  status: RestaurantStatus;
  totalBookings: number;
  rating: number;
  joinedDate: string;
  gmvTotal: number;
  rejectionReason?: string;
  logo?: string;
  coverImage?: string;
  tablesCount?: number;
  dishesCount?: number;
}

export type BookingStatus = 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled' | 'Refunded';

export interface Booking {
  id: string;
  bookingId: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  restaurantId: string;
  restaurantName: string;
  date: string;
  time: string;
  guests: number;
  tableNumber: string;
  totalAmount: number;
  advanceAmount: number;
  remainingAmount: number;
  status: BookingStatus;
  createdAt: string;
}

export type PaymentStatus = 'Pending' | 'Successful' | 'Failed' | 'Refunded';

export interface Payment {
  id: string;
  transactionId: string;
  bookingId: string;
  userId: string;
  userName: string;
  restaurantId: string;
  restaurantName: string;
  totalAmount: number;
  advancePaid: number;
  remainingAmount: number;
  paymentMethod: 'Credit Card' | 'Debit Card' | 'UPI' | 'Net Banking' | 'Wallet';
  status: PaymentStatus;
  date: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  restaurantId: string;
  restaurantName: string;
  rating: number;
  comment: string;
  date: string;
  isVerifiedBooking: boolean;
  moderationStatus: 'Published' | 'Under Review' | 'Flagged' | 'Removed';
  moderationReason?: string;
}

export type SupportPriority = 'Low' | 'Medium' | 'High' | 'Urgent';
export type SupportStatus = 'Open' | 'In Progress' | 'Resolved' | 'Closed';

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  userId?: string;
  userName: string;
  userEmail: string;
  userRole: 'Customer' | 'Restaurant Owner';
  restaurantId?: string;
  restaurantName?: string;
  subject: string;
  issueCategory: 'Booking' | 'Payment' | 'Account' | 'Technical' | 'Onboarding';
  priority: SupportPriority;
  status: SupportStatus;
  createdAt: string;
  lastUpdated: string;
  messages: Array<{
    id: string;
    sender: 'User' | 'Super Admin Support';
    text: string;
    timestamp: string;
  }>;
}

export interface PlatformTelemetry {
  totalUsers: number;
  totalRestaurants: number;
  activeRestaurants: number;
  pendingApprovalRestaurants: number;
  totalBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  totalAdvancePaid: number;
  platformGMV: number;
  activeSupportTickets: number;
  reviewsCount: number;
  isDemoData?: boolean;
}

export interface NotificationAlert {
  id: string;
  title: string;
  message: string;
  type: 'restaurant_registration' | 'payment_alert' | 'high_cancellation' | 'support_escalation' | 'system';
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}
