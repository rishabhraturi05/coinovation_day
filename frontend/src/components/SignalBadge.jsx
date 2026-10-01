import React from 'react';
import { AlertCircle, CheckCircle2, AlertTriangle, LifeBuoy } from 'lucide-react';

export default function SignalBadge({ status, size = 'md' }) {
  const normStatus = (status || '').toLowerCase().replace(/\s+/g, '_');

  const configs = {
    stable: {
      label: 'Stable',
      bgColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      dotColor: 'bg-emerald-500',
      icon: CheckCircle2,
    },
    emerging_concern: {
      label: 'Emerging Concern',
      bgColor: 'bg-amber-50 text-amber-700 border-amber-200',
      dotColor: 'bg-amber-500',
      icon: AlertTriangle,
    },
    support_recommended: {
      label: 'Support Recommended',
      bgColor: 'bg-sky-50 text-sky-700 border-sky-200',
      dotColor: 'bg-sky-500',
      icon: AlertCircle,
    },
    urgent_support_pathway: {
      label: 'Urgent Support Pathway',
      bgColor: 'bg-rose-50 text-rose-700 border-rose-200',
      dotColor: 'bg-rose-500',
      icon: LifeBuoy,
    },
  };

  const config = configs[normStatus] || {
    label: status || 'General',
    bgColor: 'bg-slate-100 text-slate-700 border-slate-200',
    dotColor: 'bg-slate-400',
    icon: AlertCircle,
  };

  const sizeClasses = size === 'sm' 
    ? 'text-xs px-2 py-0.5' 
    : size === 'lg' 
    ? 'text-sm px-3.5 py-1.5' 
    : 'text-xs px-2.5 py-1';

  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${config.bgColor} ${sizeClasses}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor}`} />
      <span>{config.label}</span>
    </span>
  );
}
