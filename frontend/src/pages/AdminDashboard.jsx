import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import StatCard from '../components/StatCard';
import PrivacyNotice from '../components/PrivacyNotice';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Building2, 
  Sparkles, 
  Lightbulb, 
  AlertCircle,
  ShieldCheck,
  CheckCircle,
  Users
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAdminData() {
      try {
        setLoading(true);
        const res = await api.getAdminDashboard();
        setData(res);
      } catch (err) {
        console.error("Failed to load admin dashboard:", err);
      } finally {
        setLoading(false);
      }
    }
    loadAdminData();
  }, []);

  const COLORS = ['#0ea5e9', '#6366f1', '#10b981', '#f59e0b', '#ec4899'];

  return (
    <div className="space-y-7 pb-12 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
              DEMO DATA
            </span>
            <span className="text-xs text-slate-400 font-semibold">• University Leadership Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            University Wellbeing Intelligence
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Aggregated, anonymized cohort patterns to guide institutional resource planning and policy.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Strict Student Anonymization Active</span>
          </span>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Check-ins This Month"
          value={data?.stats?.checkins_this_month || "3,824"}
          change="72% Cohort Rate"
          isPositiveChange={true}
          subtitle="University-wide engagement"
          icon={Users}
        />
        <StatCard
          title="Support Demand Shift"
          value={data?.stats?.support_demand_change || "+18%"}
          change="Mid-semester spike"
          isPositiveChange={false}
          subtitle="Vs. baseline month"
          icon={TrendingUp}
        />
        <StatCard
          title="Average Response Time"
          value={data?.stats?.average_response_time || "1.7 days"}
          change="Target: < 2 days"
          isPositiveChange={true}
          subtitle="From triage to outreach"
          icon={Clock}
        />
        <StatCard
          title="Rising Demand Depts"
          value={data?.stats?.departments_with_rising_demand || 4}
          change="STEM clusters"
          subtitle="Out of 12 faculties"
          icon={Building2}
        />
      </div>

      {/* Admin Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Support Demand Over Time */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-subtle space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Monthly Support Demand vs. Check-in Volume</h3>
              <p className="text-xs text-slate-500">Correlation between participation and support requests.</p>
            </div>
            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
              Aggregated
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.monthly_trends || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} stroke="#cbd5e1" />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} stroke="#cbd5e1" />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
                <Bar dataKey="support_requests" name="Support Requests" fill="#0284c7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Support Topic Distribution */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-subtle space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Support Topic Distribution</h3>
            <p className="text-xs text-slate-500">Primary categorical breakdown across requests.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data?.topic_distribution || [
                      { name: "Academic Workload", value: 42 },
                      { name: "Wellbeing", value: 31 },
                      { name: "Financial", value: 15 },
                      { name: "Social", value: 8 },
                      { name: "Accommodation", value: 4 }
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {(data?.topic_distribution || []).map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2 text-xs">
              {(data?.topic_distribution || [
                { name: "Academic Workload", value: 42 },
                { name: "Wellbeing", value: 31 },
                { name: "Financial", value: 15 },
                { name: "Social", value: 8 },
                { name: "Accommodation", value: 4 }
              ]).map((t, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-700 font-medium">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                    {t.name}
                  </span>
                  <span className="font-bold text-slate-900">{t.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Cohort & Department Trend Table */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-subtle space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Broad Student Cohort Observations</h3>
          <p className="text-xs text-slate-500">
            Detected clusters by faculty and stage of university transition.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(data?.cohort_observations || [
            { cohort: "Engineering Faculty", trend: "Academic workload elevated", signal_direction: "up", context: "Cluster of assignments converging in weeks 6-8." },
            { cohort: "First-Year Students", trend: "Social adjustment & belonging queries", signal_direction: "up", context: "Initial transition from high school to autonomous university routine." },
            { cohort: "Hostel Residents", trend: "Social & sleep environment feedback", signal_direction: "up", context: "Noise complaints and sleep cycle disruptions reported in campus halls." }
          ]).map((item, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">{item.cohort}</span>
                <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  {item.trend}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed pt-1">
                {item.context}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Admin Action Insights Card */}
      <div className="bg-gradient-to-br from-indigo-50/80 via-sky-50/60 to-white rounded-2xl p-6 border border-indigo-200/80 shadow-subtle space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-indigo-900">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
              <Lightbulb className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold">Operational Action Insight</h3>
              <span className="text-[10px] font-semibold text-indigo-600 uppercase tracking-widest">
                Prototype Insight • Non-Diagnostic
              </span>
            </div>
          </div>

          <span className="text-xs font-semibold px-2.5 py-1 bg-white border border-indigo-200 text-indigo-800 rounded-lg">
            High Confidence Cohort Signal
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 bg-white rounded-xl border border-indigo-100 shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Emerging Pattern
            </span>
            <p className="text-xs sm:text-sm font-semibold text-slate-900">
              "Academic workload-related support requests increased 23% across STEM departments over the last 4 weeks."
            </p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-emerald-100 shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 block mb-1">
              Possible Operational Response
            </span>
            <p className="text-xs sm:text-sm font-semibold text-emerald-950">
              "Consider increasing academic advising availability and scheduling study pacing workshops before the mid-term examination period."
            </p>
          </div>
        </div>
      </div>

      {/* Privacy Notice */}
      <PrivacyNotice variant="admin" />
    </div>
  );
}
