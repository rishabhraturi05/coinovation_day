import React from 'react';
import { Calendar, AlertCircle, CheckCircle, TrendingUp, HelpCircle } from 'lucide-react';

export default function Timeline({ items = [], title = "Change detected over time" }) {
  const getIconAndColor = (statusText = '') => {
    const s = statusText.toLowerCase();
    if (s.includes('urgent')) {
      return { icon: AlertCircle, color: 'text-rose-600 bg-rose-50 border-rose-200' };
    }
    if (s.includes('support') || s.includes('declin') || s.includes('increas') || s.includes('worsen') || s.includes('strain')) {
      return { icon: TrendingUp, color: 'text-amber-600 bg-amber-50 border-amber-200' };
    }
    return { icon: CheckCircle, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' };
  };

  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-subtle">
      {title && (
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-sky-600" />
          {title}
        </h4>
      )}

      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
        {items.map((item, idx) => {
          const { icon: Icon, color } = getIconAndColor(item.status || item.summary);
          return (
            <div key={idx} className="relative group">
              {/* Timeline marker */}
              <div className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full border flex items-center justify-center ${color} bg-white shadow-xs`}>
                <div className="w-2 h-2 rounded-full bg-current" />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-900">{item.period || item.date}</span>
                  {item.badge && (
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {item.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs font-medium text-slate-700 mt-0.5">{item.status || item.title}</p>
                {item.detail && (
                  <p className="text-[11px] text-slate-500 mt-0.5">{item.detail}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
