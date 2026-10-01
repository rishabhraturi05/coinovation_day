import React from 'react';

export default function CheckInQuestion({ number, total, children, className = "" }) {
  return (
    <div className={`bg-white rounded-xl p-5 sm:p-6 border border-slate-200/90 shadow-subtle ${className}`}>
      {number && total && (
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[11px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-100">
            Question {number} of {total}
          </span>
        </div>
      )}
      {children}
    </div>
  );
}
