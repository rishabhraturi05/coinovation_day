import React from 'react';
import { NavLink } from 'react-router-dom';
import { useRole, ROLES } from '../context/RoleContext';
import { 
  Activity, 
  Home, 
  ClipboardCheck, 
  Clock, 
  ShieldAlert, 
  BarChart3, 
  PhoneCall, 
  Users, 
  MessageSquare,
  Sparkles,
  Lock
} from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
  const { currentRole, setIsRoleModalOpen, setIsEmergencyModalOpen, setIsCompanionOpen } = useRole();

  const studentLinks = [
    { name: 'Student Home', path: '/student', icon: Home },
    { name: 'Weekly Check-in', path: '/student/check-in', icon: ClipboardCheck },
    { name: 'Wellbeing Journey', path: '/student/history', icon: Clock },
  ];

  const staffLinks = [
    { name: 'Support Operations', path: '/staff', icon: ShieldAlert },
  ];

  const adminLinks = [
    { name: 'University Intelligence', path: '/admin', icon: BarChart3 },
  ];

  const getLinks = () => {
    if (currentRole === ROLES.STAFF) return staffLinks;
    if (currentRole === ROLES.ADMIN) return adminLinks;
    return studentLinks;
  };

  const navLinks = getLinks();

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs md:hidden"
        />
      )}

      <aside className={`
        fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-200/90 flex flex-col justify-between transition-transform duration-200 ease-in-out md:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Brand & Logo Header */}
        <div>
          <div className="p-5 border-b border-slate-100">
            <NavLink to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-sky-600 text-white flex items-center justify-center shadow-md shadow-sky-600/20 group-hover:scale-105 transition-transform">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-base font-bold tracking-tight text-slate-900 leading-tight">
                  Campus<span className="text-sky-600">Pulse</span>
                </h1>
                <p className="text-[10px] text-slate-500 font-medium tracking-tight">
                  See the change. Offer support earlier.
                </p>
              </div>
            </NavLink>
          </div>

          {/* Role Status Tag */}
          <div className="px-5 py-3 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-600">
                {currentRole === ROLES.STUDENT && 'Student View'}
                {currentRole === ROLES.STAFF && 'Staff Operations'}
                {currentRole === ROLES.ADMIN && 'Admin Intelligence'}
              </span>
            </div>
            <button
              onClick={() => setIsRoleModalOpen(true)}
              className="text-[11px] font-semibold text-sky-600 hover:text-sky-800 hover:underline"
            >
              Switch
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => onClose && onClose()}
                  className={({ isActive }) => `
                    flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all
                    ${isActive
                      ? 'bg-sky-50 text-sky-700 shadow-xs border border-sky-100'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }
                  `}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}

            {/* Quick Companion Chat Link for students */}
            {currentRole === ROLES.STUDENT && (
              <button
                type="button"
                onClick={() => {
                  setIsCompanionOpen(true);
                  if (onClose) onClose();
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
              >
                <MessageSquare className="w-4 h-4 text-sky-600 shrink-0" />
                <span>Campus Companion</span>
                <span className="ml-auto text-[10px] bg-sky-100 text-sky-800 font-bold px-1.5 py-0.2 rounded">
                  AI
                </span>
              </button>
            )}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-slate-100 space-y-2.5">
          {/* Urgent Help Button */}
          <button
            onClick={() => setIsEmergencyModalOpen(true)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors shadow-xs"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Need immediate help?</span>
          </button>

          {/* Privacy badge */}
          <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
            <Lock className="w-3 h-3" />
            <span>Privacy-Aware Architecture</span>
          </div>
        </div>
      </aside>
    </>
  );
}
