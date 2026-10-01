import React from 'react';

export default function StatCard({ title, value, change, isPositiveChange, subtitle, icon: Icon, tag }) {
  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-subtle hover:shadow-card transition-all">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</span>
        {Icon && (
          <div className="w-9 h-9 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-2 mb-1">
        <span className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">{value}</span>
        {change && (
          <span className={`text-xs font-semibold px-1.5 py-0.5 rounded ${
            isPositiveChange === undefined
              ? 'text-slate-600 bg-slate-100'
              : isPositiveChange
              ? 'text-emerald-700 bg-emerald-50'
              : 'text-amber-700 bg-amber-50'
          }`}>
            {change}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
      )}

      {tag && (
        <span className="mt-3 inline-block text-[10px] uppercase font-bold text-slate-400 bg-slate-50 border border-slate-200/60 px-1.5 py-0.5 rounded">
          {tag}
        </span>
      )}
    </div>
  );
}
