import React from 'react';
import { Lock, ShieldCheck, EyeOff } from 'lucide-react';

export default function PrivacyNotice({ variant = 'student', className = '' }) {
  const configs = {
    student: {
      icon: Lock,
      title: 'Your privacy matters',
      text: 'Your responses are private. You control when you request support. University-wide insights are shown only in aggregated form.',
      style: 'bg-slate-50 border-slate-200/80 text-slate-600',
      iconColor: 'text-sky-600'
    },
    staff: {
      icon: ShieldCheck,
      title: 'Authorized Staff Access Only',
      text: 'Student-level information is visible only to authorized support staff to coordinate timely, consensual help.',
      style: 'bg-amber-50/70 border-amber-200 text-amber-900',
      iconColor: 'text-amber-600'
    },
    admin: {
      icon: EyeOff,
      title: 'Aggregated & Anonymized Privacy Guarantee',
      text: 'Student-level information is intentionally excluded. These insights are purely cohort-level aggregated signals.',
      style: 'bg-indigo-50/70 border-indigo-200 text-indigo-900',
      iconColor: 'text-indigo-600'
    }
  };

  const { icon: Icon, title, text, style, iconColor } = configs[variant] || configs.student;

  return (
    <div className={`rounded-xl border p-4 flex items-start gap-3 text-xs ${style} ${className}`}>
      <div className={`mt-0.5 shrink-0 ${iconColor}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <h5 className="font-bold tracking-tight mb-0.5">{title}</h5>
        <p className="leading-relaxed opacity-90">{text}</p>
      </div>
    </div>
  );
}
