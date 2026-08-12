import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="size-8 rounded-full border-2 border-[#D2D0C1] border-t-transparent animate-spin" />
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Verifying Super Admin Authorization...
          </span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
