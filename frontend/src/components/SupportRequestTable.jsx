import React from 'react';
import SignalBadge from './SignalBadge';
import { ArrowUpRight, ArrowRight, ArrowDownRight, Clock, User, ChevronRight } from 'lucide-react';

export default function SupportRequestTable({ requests = [], onSelectCase, activeCaseId }) {
  const getTrendIcon = (trend = '') => {
    const t = trend.toLowerCase();
    if (t.includes('worsen') || t.includes('rapid') || t.includes('decline')) {
      return (
        <span className="inline-flex items-center gap-1 text-rose-600 font-medium">
          <ArrowUpRight className="w-3.5 h-3.5" />
          <span>Worsening</span>
        </span>
      );
    }
    if (t.includes('improv')) {
      return (
        <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
          <ArrowDownRight className="w-3.5 h-3.5" />
          <span>Improving</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-slate-500 font-medium">
        <ArrowRight className="w-3.5 h-3.5" />
        <span>Stable</span>
      </span>
    );
  };

  const getStatusBadge = (status = '') => {
    const s = status.toLowerCase();
    const styleMap = {
      new: 'bg-rose-50 text-rose-700 border-rose-200',
      assigned: 'bg-amber-50 text-amber-700 border-amber-200',
      contacted: 'bg-sky-50 text-sky-700 border-sky-200',
      resolved: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    };
    return (
      <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${styleMap[s] || 'bg-slate-100 text-slate-700'}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-subtle overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
              <th className="py-3 px-4">Student</th>
              <th className="py-3 px-4">Signal</th>
              <th className="py-3 px-4">Trend</th>
              <th className="py-3 px-4">Support Requested</th>
              <th className="py-3 px-4">Logged</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {requests.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-8 text-center text-slate-400">
                  No support cases matching criteria.
                </td>
              </tr>
            ) : (
              requests.map((item) => {
                const isSelected = activeCaseId === item.id;
                return (
                  <tr
                    key={item.id}
                    onClick={() => onSelectCase(item.id)}
                    className={`cursor-pointer transition-colors ${
                      isSelected 
                        ? 'bg-sky-50/80 font-medium' 
                        : 'hover:bg-slate-50/80'
                    }`}
                  >
                    <td className="py-3.5 px-4 font-semibold text-slate-900 flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-[10px]">
                        <User className="w-3 h-3" />
                      </div>
                      <span>{item.student_code}</span>
                      <span className="text-[10px] text-slate-400 font-normal">({item.department})</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <SignalBadge status={item.signal} size="sm" />
                    </td>
                    <td className="py-3.5 px-4">
                      {getTrendIcon(item.trend)}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-700">
                      {item.support_requested || "General Support"}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {item.time}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {getStatusBadge(item.status)}
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <button
                        type="button"
                        className="text-sky-600 hover:text-sky-800 font-semibold inline-flex items-center gap-0.5 text-xs"
                      >
                        <span>Review</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
