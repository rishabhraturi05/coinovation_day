import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { RoleProvider } from './context/RoleContext';
import AppShell from './components/AppShell';

import LandingPage from './pages/LandingPage';
import StudentHome from './pages/StudentHome';
import StudentCheckIn from './pages/StudentCheckIn';
import StudentResult from './pages/StudentResult';
import StudentHistory from './pages/StudentHistory';
import StaffDashboard from './pages/StaffDashboard';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  return (
    <RoleProvider>
      <BrowserRouter>
        <Routes>
          {/* Landing / Hero Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Student Portal */}
          <Route path="/student" element={<AppShell><StudentHome /></AppShell>} />
          <Route path="/student/check-in" element={<AppShell><StudentCheckIn /></AppShell>} />
          <Route path="/student/result" element={<AppShell><StudentResult /></AppShell>} />
          <Route path="/student/history" element={<AppShell><StudentHistory /></AppShell>} />

          {/* Staff Support Operations */}
          <Route path="/staff" element={<AppShell><StaffDashboard /></AppShell>} />

          {/* University Admin Wellbeing Intelligence */}
          <Route path="/admin" element={<AppShell><AdminDashboard /></AppShell>} />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </RoleProvider>
  );
}
