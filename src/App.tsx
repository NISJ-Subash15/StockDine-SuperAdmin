import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { UsersPage } from './pages/Users';
import { UserDetail } from './pages/UserDetail';
import { RestaurantsPage } from './pages/Restaurants';
import { RestaurantDetail } from './pages/RestaurantDetail';
import { BookingsPage } from './pages/Bookings';
import { PaymentsPage } from './pages/Payments';
import { ReviewsPage } from './pages/Reviews';
import { SupportPage } from './pages/Support';
import { AnalyticsPage } from './pages/Analytics';
import { NotificationsPage } from './pages/Notifications';
import { SettingsPage } from './pages/Settings';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="users/:id" element={<UserDetail />} />
            <Route path="restaurants" element={<RestaurantsPage />} />
            <Route path="restaurants/:id" element={<RestaurantDetail />} />
            <Route path="bookings" element={<BookingsPage />} />
            <Route path="payments" element={<PaymentsPage />} />
            <Route path="reviews" element={<ReviewsPage />} />
            <Route path="support" element={<SupportPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};
