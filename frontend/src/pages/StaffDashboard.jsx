import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import StatCard from '../components/StatCard';
import SupportRequestTable from '../components/SupportRequestTable';
import CaseDetail from '../components/CaseDetail';
import PrivacyNotice from '../components/PrivacyNotice';
import { 
  Users, 
  LifeBuoy, 
  Clock, 
  AlertTriangle, 
  Activity, 
  Filter, 
  Search,
  Sparkles,
  BarChart2,
  TrendingUp,
  Layers
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

export default function StaffDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCaseId, setSelectedCaseId] = useState(null);
  const [caseDetail, setCaseDetail] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Filters
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const res = await api.getStaffDashboard();
      setData(res);
    } catch (err) {
      console.error("Failed to load staff dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleSelectCase = async (caseId) => {
    setSelectedCaseId(caseId);
    setLoadingDetail(true);
    try {
      const detail = await api.getSupportRequestDetail(caseId);
      setCaseDetail(detail);
    } catch (err) {
      console.error("Failed to load case detail:", err);
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleUpdateStatus = async (caseId, updatePayload) => {
    try {
      await api.updateSupportRequest(caseId, updatePayload);
      // Reload dashboard and active case
      await loadDashboard();
      if (selectedCaseId === caseId) {
        const detail = await api.getSupportRequestDetail(caseId);
        setCaseDetail(detail);
      }
    } catch (err) {
      console.error("Failed to update case:", err);
    }
  };

  const rawQueue = data?.case_queue || [];
  const filteredQueue = rawQueue.filter((item) => {
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    const matchesPriority = priorityFilter === 'All' || item.priority === priorityFilter;
    const matchesSearch = searchQuery === '' || 
      item.student_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.support_requested?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesPriority && matchesSearch;
  });

  return (
    <div className="space-y-7 pb-12 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
              DEMO DATA
            </span>
            <span className="text-xs text-slate-400 font-semibold">• Authorized Support Operations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Support Operations
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Triage emerging student signals and coordinate timely, non-clinical human support.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadDashboard}
            className="px-3.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-xs font-semibold rounded-xl text-slate-700 transition-colors shadow-xs"
          >
            Refresh Queue
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <StatCard
          title="Students Checked In"
          value={data?.stats?.students_checked_in || "1,284"}
          subtitle="This academic term"
          icon={Users}
        />
        <StatCard
          title="Support Requests"
          value={data?.stats?.support_requests_active || "96"}
          change="+14%"
          isPositiveChange={false}
          subtitle="Total logged"
          icon={LifeBuoy}
        />
        <StatCard
          title="Follow-ups Pending"
          value={data?.stats?.followups_pending || "31"}
          subtitle="Requiring outreach"
          icon={Clock}
        />
        <StatCard
          title="Emerging Signals"
          value={data?.stats?.emerging_support_signals || "18"}
          change="Needs review"
          subtitle="Multi-checkin strain"
          icon={AlertTriangle}
        />
        <StatCard
          title="Avg Response Time"
          value={data?.stats?.average_response_time || "1.7 days"}
          change="-0.3d improvement"
          isPositiveChange={true}
          subtitle="Triage to contact"
          icon={Activity}
        />
      </div>

      {/* Operational Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Support demand over 30 days */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-subtle space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Support Requests Trend (30 Days)</h3>
              <p className="text-xs text-slate-500">Incoming requests and resolution volume.</p>
            </div>
            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
              Demo series
            </span>
          </div>

          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.daily_trend || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="reqGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748b' }} stroke="#cbd5e1" />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} stroke="#cbd5e1" />
                <Tooltip />
                <Area type="monotone" dataKey="requests" stroke="#0ea5e9" strokeWidth={2.5} fillOpacity={1} fill="url(#reqGradient)" name="Requests" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Major Support Topics */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-subtle space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Major Support Topics</h3>
            <p className="text-xs text-slate-500">Distribution across self-reported categories.</p>
          </div>

          <div className="space-y-3 pt-1">
            {(data?.support_topics || [
              { topic: "Academic Workload", percentage: 42 },
              { topic: "Wellbeing & Stress", percentage: 31 },
              { topic: "Financial Advisory", percentage: 15 },
              { topic: "Social Belonging", percentage: 8 },
              { topic: "Accommodation", percentage: 4 }
            ]).map((t, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-700">{t.topic}</span>
                  <span className="font-bold text-slate-900">{t.percentage}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-sky-600 rounded-full transition-all duration-500"
                    style={{ width: `${t.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Case Queue Section */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Support Triage Queue</h2>
            <p className="text-xs text-slate-500">
              Review flagged check-in trends and prioritized student outreach requests.
            </p>
          </div>

          {/* Filters & Search */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search ID, dept..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-xs pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-sky-500"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="New">New</option>
              <option value="Assigned">Assigned</option>
              <option value="Contacted">Contacted</option>
              <option value="Resolved">Resolved</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-none"
            >
              <option value="All">All Priorities</option>
              <option value="Urgent">Urgent</option>
              <option value="Elevated">Elevated</option>
              <option value="Standard">Standard</option>
            </select>
          </div>
        </div>

        {/* Table Component */}
        <SupportRequestTable
          requests={filteredQueue}
          onSelectCase={handleSelectCase}
          activeCaseId={selectedCaseId}
        />
      </div>

      {/* Case Detail Modal / Drawer */}
      {selectedCaseId && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-2xl">
            {loadingDetail ? (
              <div className="bg-white p-8 rounded-2xl text-center">
                <Sparkles className="w-6 h-6 animate-spin-slow text-sky-600 mx-auto mb-2" />
                <span className="text-xs text-slate-500 font-medium">Loading case details & historical signals...</span>
              </div>
            ) : (
              <CaseDetail
                caseData={caseDetail}
                onClose={() => setSelectedCaseId(null)}
                onUpdateStatus={handleUpdateStatus}
              />
            )}
          </div>
        </div>
      )}

      {/* Staff Privacy Notice */}
      <PrivacyNotice variant="staff" />
    </div>
  );
}
