import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import RoleSwitcherModal from './RoleSwitcherModal';
import EmergencyHelpCard from './EmergencyHelpCard';
import ChatAssistant from './ChatAssistant';
import { useRole } from '../context/RoleContext';

export default function AppShell({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isEmergencyModalOpen, setIsEmergencyModalOpen } = useRole();

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar Navigation */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 md:pl-64 flex flex-col min-w-0">
        <Topbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Modals & Floating Assistants */}
      <RoleSwitcherModal />
      <EmergencyHelpCard
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
      />
      <ChatAssistant />
    </div>
  );
}
