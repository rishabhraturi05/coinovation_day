import React from 'react';
import { ArrowUpRight, ArrowDownRight, ArrowRight, Activity, Moon, BookOpen, Users, Compass } from 'lucide-react';

export default function TrendCard({ name, direction, explanation }) {
  // Determine if this direction is concerning or positive based on signal type
  const isStressOrWorkload = ['stress', 'academic workload', 'overwhelm'].some(k => name.toLowerCase().includes(k));
  const isSleepOrSocial = ['sleep', 'social'].some(k => name.toLowerCase().includes(k));

  let isNegative = false;
  let isPositive = false;

  if (isStressOrWorkload) {
    if (direction === 'up') isNegative = true;
    if (direction === 'down') isPositive = true;
  } else if (isSleepOrSocial) {
    if (direction === 'down') isNegative = true;
    if (direction === 'up') isPositive = true;
  }

  // Get matching icon
  const getIcon = () => {
    const n = name.toLowerCase();
    if (n.includes('stress')) return Activity;
    if (n.includes('sleep')) return Moon;
    if (n.includes('workload')) return BookOpen;
    if (n.includes('social')) return Users;
    return Compass;
  };

  const Icon = getIcon();

  return (
    <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-subtle hover:shadow-card transition-all">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600">
            <Icon className="w-4 h-4 text-sky-600" />
          </div>
          <span className="font-medium text-slate-800 text-sm">{name}</span>
        </div>

        <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md ${
          isNegative
            ? 'bg-rose-50 text-rose-700'
            : isPositive
            ? 'bg-emerald-50 text-emerald-700'
            : 'bg-slate-100 text-slate-600'
        }`}>
          {direction === 'up' && <ArrowUpRight className="w-3.5 h-3.5" />}
          {direction === 'down' && <ArrowDownRight className="w-3.5 h-3.5" />}
          {direction === 'stable' && <ArrowRight className="w-3.5 h-3.5" />}
          <span className="capitalize">{direction}</span>
        </div>
      </div>

      <p className="text-xs text-slate-600 leading-relaxed mt-1">
        {explanation}
      </p>
    </div>
  );
}
