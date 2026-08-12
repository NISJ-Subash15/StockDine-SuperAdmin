import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export const Layout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <Header setMobileOpen={setMobileOpen} />
        <main className="p-4 sm:p-6 lg:p-8 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
