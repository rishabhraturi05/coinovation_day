import React from 'react';
import { useRole, ROLES } from '../context/RoleContext';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, ShieldAlert, BarChart3, X, Sparkles, Check } from 'lucide-react';

export default function RoleSwitcherModal() {
  const { currentRole, setCurrentRole, isRoleModalOpen, setIsRoleModalOpen } = useRole();
  const navigate = useNavigate();

  if (!isRoleModalOpen) return null;

  const roles = [
    {
      id: ROLES.STUDENT,
      title: 'Student',
      description: 'Experience 30-sec check-in, explainable signals, and support routing.',
      route: '/student',
      icon: GraduationCap,
      badge: 'Alex Rivera (CP1042)',
      color: 'hover:border-sky-500 hover:bg-sky-50/50 text-sky-700'
    },
    {
      id: ROLES.STAFF,
      title: 'Support Staff',
      description: 'Triage incoming cases, review explainable signals, and coordinate human outreach.',
      route: '/staff',
      icon: ShieldAlert,
      badge: 'Wellbeing Operations',
      color: 'hover:border-amber-500 hover:bg-amber-50/50 text-amber-700'
    },
    {
      id: ROLES.ADMIN,
      title: 'University Admin',
      description: 'Analyze aggregated cohort demand, pacing bottlenecks, and resource allocations.',
      route: '/admin',
      icon: BarChart3,
      badge: 'Aggregated & Anonymized',
      color: 'hover:border-indigo-500 hover:bg-indigo-50/50 text-indigo-700'
    }
  ];

  const handleSelect = (roleId, route) => {
    setCurrentRole(roleId);
    navigate(route);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-float border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-6 text-center border-b border-slate-100 relative">
          <button
            onClick={() => setIsRoleModalOpen(false)}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-12 h-12 rounded-2xl bg-sky-500 text-white flex items-center justify-center mx-auto mb-3 shadow-md shadow-sky-500/20">
            <Sparkles className="w-6 h-6" />
          </div>

          <h3 className="text-xl font-bold text-slate-900 tracking-tight">CampusPulse</h3>
          <p className="text-xs text-slate-500 mt-1">
            How would you like to continue?
          </p>
        </div>

        <div className="p-5 space-y-3">
          {roles.map((r) => {
            const Icon = r.icon;
            const isSelected = currentRole === r.id;
            return (
              <button
                key={r.id}
                onClick={() => handleSelect(r.id, r.route)}
                className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3.5 group relative ${
                  isSelected
                    ? 'border-sky-500 bg-sky-50/60 ring-2 ring-sky-200 shadow-xs'
                    : `border-slate-200 bg-white ${r.color}`
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 ${
                  isSelected ? 'bg-sky-600 text-white border-transparent' : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-900 group-hover:text-sky-700 transition-colors">
                      {r.title}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200/60">
                      {r.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 leading-snug">
                    {r.description}
                  </p>
                </div>

                {isSelected && (
                  <div className="absolute top-4 right-3 text-sky-600">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
            Demo Mode • Switch Anytime
          </span>
        </div>
      </div>
    </div>
  );
}
