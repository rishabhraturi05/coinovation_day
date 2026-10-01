import React, { useState } from 'react';
import SignalBadge from './SignalBadge';
import Timeline from './Timeline';
import WellbeingChart from './WellbeingChart';
import { 
  User, 
  Sparkles, 
  MessageSquare, 
  CheckCircle, 
  AlertCircle, 
  Send, 
  Clock, 
  ShieldCheck,
  X,
  FileText,
  UserCheck
} from 'lucide-react';

export default function CaseDetail({ caseData, onClose, onUpdateStatus }) {
  const [updating, setUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'trajectory'

  if (!caseData) return null;

  const { request, latest_checkin, analysis } = caseData;
  const historyPoints = analysis?.history_summary?.points || [];

  // Generate timeline items for the case
  const timelineItems = historyPoints.map((pt, idx) => {
    let statusText = "Stable";
    let detail = `Stress: ${pt.stress}/5, Sleep: ${pt.sleep}/5, Workload: ${pt.workload}/5`;
    if (idx === 0) statusText = "Initial baseline check-in (Stable)";
    else if (pt.strain > 0.6) statusText = "Elevated strain & support requested";
    else if (pt.workload >= 4) statusText = "Workload increase detected";
    else if (pt.stress >= 4) statusText = "Stress increase detected";

    return {
      period: pt.date || `Week ${idx + 1}`,
      status: statusText,
      detail: detail,
      badge: pt.support_requested ? "Support Request Logged" : undefined
    };
  });

  const handleStatusChange = async (newStatus) => {
    setUpdating(true);
    try {
      await onUpdateStatus(request.id, { status: newStatus });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-float overflow-hidden flex flex-col max-h-[90vh]">
      {/* Top Modal Header */}
      <div className="p-5 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-sm">
            <User className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">Student {request.student_code}</h3>
              <SignalBadge status={analysis.status} size="sm" />
            </div>
            <p className="text-xs text-slate-500">
              {request.department} • {request.year} • Priority: <span className="font-semibold text-slate-700">{request.priority}</span>
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Tabs */}
      <div className="px-5 border-b border-slate-200 flex gap-4 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`py-3 border-b-2 transition-all ${
            activeTab === 'overview'
              ? 'border-sky-600 text-sky-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Signal Overview & AI Analysis
        </button>
        <button
          onClick={() => setActiveTab('trajectory')}
          className={`py-3 border-b-2 transition-all ${
            activeTab === 'trajectory'
              ? 'border-sky-600 text-sky-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Early Signal Timeline & Charts
        </button>
      </div>

      {/* Scrollable Body */}
      <div className="p-5 overflow-y-auto space-y-5 text-xs text-slate-700">
        {activeTab === 'overview' ? (
          <>
            {/* Current Signal Cards Grid */}
            <div>
              <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                Current Wellbeing Signals
              </h4>
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[11px] text-slate-500 block">Stress Level</span>
                  <span className="text-base font-bold text-rose-600">
                    {latest_checkin.stress_score}/5
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">High Stress</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[11px] text-slate-500 block">Academic Workload</span>
                  <span className="text-base font-bold text-amber-600">
                    {latest_checkin.workload_score}/5
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">High Volume</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[11px] text-slate-500 block">Sleep Quality</span>
                  <span className="text-base font-bold text-sky-600">
                    {latest_checkin.sleep_score}/5
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Declining Quality</span>
                </div>
              </div>
            </div>

            {/* AI Explainability Box */}
            <div className="p-4 bg-sky-50/70 border border-sky-100 rounded-xl space-y-2">
              <div className="flex items-center gap-1.5 text-sky-800 font-bold text-xs">
                <Sparkles className="w-4 h-4 text-sky-600" />
                <span>Explainable AI Insights</span>
              </div>
              <ul className="space-y-1.5 pl-5 list-disc text-slate-700">
                {analysis.reasons.map((reason, idx) => (
                  <li key={idx} className="leading-snug">{reason}</li>
                ))}
              </ul>
            </div>

            {/* Free Text Note & NLP Classification */}
            {latest_checkin.free_text && (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                    Student Self-Reported Note
                  </span>
                  <span className="text-[10px] bg-slate-200/70 text-slate-600 px-2 py-0.5 rounded-full">
                    Confidential
                  </span>
                </div>

                <blockquote className="italic text-slate-700 bg-white p-3 rounded-lg border border-slate-200/60 text-xs">
                  "{latest_checkin.free_text}"
                </blockquote>

                {/* NLP Topic Badge */}
                {analysis.text_topics && analysis.text_topics.length > 0 && (
                  <div className="pt-2 border-t border-slate-200/70 flex items-center gap-3">
                    <span className="text-[11px] font-semibold text-slate-500">NLP Topic Classification:</span>
                    {analysis.text_topics.map((t, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded text-[11px] font-medium">
                        <span className="capitalize">{t.topic || t.category}</span>
                        <span className="text-[10px] text-indigo-500">({Math.round((t.confidence || 0.85) * 100)}% conf)</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Recommended Action */}
            <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl">
              <span className="font-bold text-emerald-900 block mb-1">Recommended Support Action:</span>
              <p className="text-emerald-800 text-xs leading-relaxed">
                Connect student with Academic Advising for coursework pacing and recommend peer tutoring support. Send follow-up check-in invitation for next week.
              </p>
            </div>
          </>
        ) : (
          <>
            {/* Trajectory Tab */}
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                Wellbeing Strain Trajectory (0 to 1.0)
              </h4>
              <WellbeingChart data={historyPoints} height={200} type="composite" />
            </div>

            <Timeline items={timelineItems} title="Change Detected Over Time" />
          </>
        )}
      </div>

      {/* Staff Action Footer */}
      <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-[11px] text-slate-500">
          <ShieldCheck className="w-4 h-4 text-slate-400" />
          <span>Case Status: <strong className="text-slate-800">{request.status}</strong></span>
        </div>

        <div className="flex items-center gap-2">
          {request.status !== 'Assigned' && (
            <button
              disabled={updating}
              onClick={() => handleStatusChange('Assigned')}
              className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors flex items-center gap-1"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Assign to Advisor</span>
            </button>
          )}

          {request.status !== 'Contacted' && (
            <button
              disabled={updating}
              onClick={() => handleStatusChange('Contacted')}
              className="px-3 py-1.5 rounded-lg border border-sky-300 bg-sky-50 hover:bg-sky-100 text-sky-800 font-semibold text-xs transition-colors flex items-center gap-1"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Mark Contacted</span>
            </button>
          )}

          {request.status !== 'Resolved' && (
            <button
              disabled={updating}
              onClick={() => handleStatusChange('Resolved')}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors flex items-center gap-1 shadow-xs"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Resolve Case</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
