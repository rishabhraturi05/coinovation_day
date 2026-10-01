import React from 'react';
import { BookOpen, HeartPulse, DollarSign, Users, Home, ExternalLink, ArrowRight } from 'lucide-react';

export default function SupportResourceCard({
  title,
  category,
  description,
  department,
  onSelect,
  isSelected,
  compact = false
}) {
  const getCategoryConfig = (cat) => {
    const c = (cat || '').toLowerCase();
    if (c.includes('academic') || c.includes('study')) {
      return { icon: BookOpen, color: 'text-indigo-600 bg-indigo-50 border-indigo-100', badge: 'Academic' };
    }
    if (c.includes('wellbeing') || c.includes('mind') || c.includes('health')) {
      return { icon: HeartPulse, color: 'text-rose-600 bg-rose-50 border-rose-100', badge: 'Wellbeing' };
    }
    if (c.includes('financial') || c.includes('money')) {
      return { icon: DollarSign, color: 'text-emerald-600 bg-emerald-50 border-emerald-100', badge: 'Financial' };
    }
    if (c.includes('social') || c.includes('peer') || c.includes('community')) {
      return { icon: Users, color: 'text-amber-600 bg-amber-50 border-amber-100', badge: 'Community' };
    }
    if (c.includes('accommodation') || c.includes('housing')) {
      return { icon: Home, color: 'text-teal-600 bg-teal-50 border-teal-100', badge: 'Housing' };
    }
    return { icon: HeartPulse, color: 'text-sky-600 bg-sky-50 border-sky-100', badge: 'General Support' };
  };

  const { icon: Icon, color, badge } = getCategoryConfig(category || title);

  if (compact) {
    return (
      <div 
        onClick={onSelect}
        className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
          isSelected 
            ? 'bg-sky-50/70 border-sky-300 ring-2 ring-sky-200' 
            : 'bg-white border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/50'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${color}`}>
            <Icon className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-slate-800">{title}</h4>
            <span className="text-[11px] text-slate-500">{badge}</span>
          </div>
        </div>
        <ArrowRight className="w-4 h-4 text-slate-400" />
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl p-5 border transition-all flex flex-col justify-between ${
      isSelected 
        ? 'border-sky-500 ring-2 ring-sky-200 shadow-card' 
        : 'border-slate-200/80 shadow-subtle hover:shadow-card hover:border-slate-300'
    }`}>
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${color}`}>
            <Icon className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
            {badge}
          </span>
        </div>

        <h3 className="text-sm font-semibold text-slate-900 mb-1.5">{title}</h3>
        <p className="text-xs text-slate-600 leading-relaxed mb-4">{description}</p>
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[11px] text-slate-400 font-medium">{department || 'University Services'}</span>
        {onSelect && (
          <button
            type="button"
            onClick={onSelect}
            className="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1 transition-colors"
          >
            <span>Connect</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
