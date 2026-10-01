import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRole } from '../context/RoleContext';
import { api } from '../services/api';
import WellbeingChart from '../components/WellbeingChart';
import Timeline from '../components/Timeline';
import PrivacyNotice from '../components/PrivacyNotice';
import { 
  Clock, 
  TrendingUp, 
  Sparkles, 
  HeartHandshake, 
  ArrowRight,
  Activity,
  CheckCircle2,
  Calendar
} from 'lucide-react';

export default function StudentHistory() {
  const navigate = useNavigate();
  const { currentStudent } = useRole();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chartMode, setChartMode] = useState('composite'); // 'composite' | 'breakdown'

  useEffect(() => {
    async function loadHistory() {
      try {
        setLoading(true);
        const data = await api.getStudentAnalysis(currentStudent.id);
        setAnalysis(data);
      } catch (err) {
        console.error("Failed to load history:", err);
      } finally {
        setLoading(false);
      }
    }
    loadHistory();
  }, [currentStudent.id]);

  const historyPoints = analysis?.history_summary?.points || [];

  // Generate timeline entries
  const timelineItems = historyPoints.length > 0 ? historyPoints.map((pt, idx) => {
    let title = "Stable";
    let detail = `Stress ${pt.stress}/5 • Sleep ${pt.sleep}/5 • Workload ${pt.workload}/5`;
    let badge = pt.date;

    if (idx === 0) {
      title = "Week 1: Stable baseline";
    } else if (idx === 1) {
      title = "Week 2: Workload increasing";
    } else if (idx === 2) {
      title = "Week 3: Stress increasing & sleep declining";
    } else {
      title = "Week 4: Elevated strain — Support recommended";
    }

    return {
      period: pt.date || `Week ${idx + 1}`,
      status: title,
      detail: detail,
      badge: pt.support_requested ? "Support Requested" : undefined
    };
  }) : [
    { period: "Week 1", status: "Stable baseline", detail: "Stress 2/5 • Sleep 4/5 • Workload 2/5" },
    { period: "Week 2", status: "Workload increasing", detail: "Stress 3/5 • Sleep 3/5 • Workload 3/5" },
    { period: "Week 3", status: "Stress increasing", detail: "Stress 4/5 • Sleep 2/5 • Workload 4/5" },
    { period: "Week 4", status: "Support recommended", detail: "Stress 5/5 • Sleep 1/5 • Workload 5/5", badge: "Support Requested" },
  ];

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 text-xs font-semibold mb-1">
            <Clock className="w-3.5 h-3.5" />
            <span>Reflective History</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Your Wellbeing Journey
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Observing changes over time helps you recognize when demands exceed your rest.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/student')}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>View Support Options</span>
          </button>
        </div>
      </div>

      {/* Encouraging Affirmation Banner */}
      <div className="bg-gradient-to-r from-emerald-500/10 via-sky-500/10 to-indigo-500/10 rounded-2xl p-5 border border-sky-100 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-700 space-y-1">
          <p className="font-bold text-slate-900">
            University life is demanding. Peaks and valleys in workload and rest are natural.
          </p>
          <p className="text-slate-600">
            Tracking your weekly check-ins helps the university offer resources before you feel burnt out. You are always in control of when to request support.
          </p>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-subtle space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              {chartMode === 'composite' ? 'Composite Wellbeing Strain Trajectory' : 'Individual Indicators Breakdown'}
            </h3>
            <p className="text-xs text-slate-500">
              {chartMode === 'composite'
                ? 'Unified strain metric (0.0 = low strain, 1.0 = elevated support signal).'
                : 'Trends for Stress, Academic Workload, and Sleep Quality (Scale 1-5).'}
            </p>
          </div>

          {/* Toggle buttons */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setChartMode('composite')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                chartMode === 'composite' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Overall Strain
            </button>
            <button
              onClick={() => setChartMode('breakdown')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                chartMode === 'breakdown' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Metrics Breakdown
            </button>
          </div>
        </div>

        <WellbeingChart
          data={historyPoints}
          type={chartMode}
          height={280}
        />
      </div>

      {/* Timeline Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Timeline items={timelineItems} title="Weekly Change Progression" />
        </div>

        {/* Quick summary card */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-subtle space-y-4 flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Trajectory Summary
            </span>
            <h4 className="text-sm font-bold text-slate-900 mb-1">
              Consecutive Shift Detected
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Self-reported workload and stress have increased over the last 3 check-ins, accompanied by a drop in restorative sleep.
            </p>

            <div className="mt-4 p-3 bg-sky-50 rounded-xl border border-sky-100 text-xs text-sky-800">
              <span className="font-bold block mb-1">Recommended Pathway:</span>
              <span>Connect with Academic Tutoring for exam prep assistance.</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/student/check-in')}
            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Log New Check-in</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <PrivacyNotice variant="student" />
    </div>
  );
}
