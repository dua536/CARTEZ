import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import TopNavBar from '../Navigation/TopNavBar';
import SideNavBar from '../Navigation/SideNavBar';
import Footer from '../Navigation/Footer';

export default function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);

  return (
    <div className="bg-surface text-on-surface selection:bg-primary/30 min-h-screen overflow-hidden flex flex-col pt-24 pb-8">
      <TopNavBar onToggleSidebar={toggleSidebar} />
      <SideNavBar isOpen={isSidebarOpen} />
      
      <main className={`flex-1 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'ml-52' : 'ml-0'}`}>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
