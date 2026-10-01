import React from 'react';
import { useRole, ROLES } from '../context/RoleContext';
import { Menu, User, PhoneCall, Sparkles, MessageSquare, ChevronDown } from 'lucide-react';

export default function Topbar({ onToggleSidebar }) {
  const { 
    currentRole, 
    setIsRoleModalOpen, 
    setIsEmergencyModalOpen, 
    setIsCompanionOpen,
    currentStudent 
  } = useRole();

  return (
    <header className="h-16 bg-white border-b border-slate-200/90 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="w-9 h-9 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 flex items-center justify-center md:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:block">
          <span className="text-xs font-semibold text-slate-400">CampusPulse Early Signal System</span>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        {/* Student identity chip (if student mode) */}
        {currentRole === ROLES.STUDENT && (
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs">
            <div className="w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center text-[10px] font-bold">
              AR
            </div>
            <span className="font-semibold text-slate-800">{currentStudent.name}</span>
            <span className="text-slate-400 font-mono text-[11px]">({currentStudent.student_code})</span>
          </div>
        )}

        {/* Companion Chat button */}
        {currentRole === ROLES.STUDENT && (
          <button
            onClick={() => setIsCompanionOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 font-semibold text-xs rounded-xl border border-sky-200 transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Companion</span>
          </button>
        )}

        {/* Urgent help topbar link */}
        <button
          onClick={() => setIsEmergencyModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs rounded-xl border border-rose-200 transition-colors"
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Emergency Help</span>
        </button>

        {/* Role Switcher Button */}
        <button
          onClick={() => setIsRoleModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span className="capitalize">{currentRole} Mode</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </button>
      </div>
    </header>
  );
}
