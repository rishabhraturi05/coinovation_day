import React from 'react';
import { Check, Sparkles, ShieldCheck } from 'lucide-react';

export default function AIInsightCard({ reasons = [], title = "Why we're suggesting support" }) {
  if (!reasons || reasons.length === 0) {
    reasons = [
      "Wellbeing signals are within typical manageable ranges",
      "No sharp shifts detected across recent check-ins"
    ];
  }

  return (
    <div className="bg-gradient-to-br from-sky-50/70 to-indigo-50/50 rounded-2xl p-5 sm:p-6 border border-sky-100 shadow-subtle">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-lg bg-sky-600 text-white flex items-center justify-center shadow-sm">
          <Sparkles className="w-3.5 h-3.5" />
        </div>
        <h3 className="text-sm sm:text-base font-bold text-slate-800 tracking-tight">
          {title}
        </h3>
      </div>

      <ul className="space-y-2.5 my-4">
        {reasons.map((reason, idx) => (
          <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
            <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center shrink-0 mt-0.5">
              <Check className="w-3 h-3 stroke-[2.5]" />
            </span>
            <span className="leading-snug">{reason}</span>
          </li>
        ))}
      </ul>

      <div className="mt-4 pt-3 border-t border-sky-200/60 flex items-center gap-2 text-[11px] text-slate-500">
        <ShieldCheck className="w-4 h-4 text-sky-600 shrink-0" />
        <span>
          <strong>Explainable & Non-Diagnostic:</strong> Signals highlight operational trends to help you find appropriate human support earlier.
        </span>
      </div>
    </div>
  );
}
