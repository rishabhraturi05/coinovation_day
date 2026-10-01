import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRole } from '../context/RoleContext';
import { api } from '../services/api';
import SignalBadge from '../components/SignalBadge';
import SupportResourceCard from '../components/SupportResourceCard';
import PrivacyNotice from '../components/PrivacyNotice';
import { 
  ClipboardCheck, 
  ArrowRight, 
  Clock, 
  Sparkles, 
  Activity, 
  CheckCircle2, 
  AlertTriangle,
  MessageSquare
} from 'lucide-react';

export default function StudentHome() {
  const navigate = useNavigate();
  const { currentStudent, setIsCompanionOpen } = useRole();
  const [analysis, setAnalysis] = useState(null);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [analysisData, resourcesData] = await Promise.all([
          api.getStudentAnalysis(currentStudent.id).catch(() => null),
          api.getResources().catch(() => [])
        ]);
        setAnalysis(analysisData);
        setResources(resourcesData || []);
      } catch (err) {
        console.error("Failed to load student home data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [currentStudent.id]);

  const defaultResources = [
    {
      title: "Confidential Wellbeing Advisor",
      category: "wellbeing",
      description: "Book a 1-on-1 private conversation to discuss stress, workload balance, or personal issues.",
      department: "Student Wellbeing"
    },
    {
      title: "Academic Support & Peer Tutoring",
      category: "academic",
      description: "Assistance with study planning, breaking down heavy assignments, and exam preparation.",
      department: "Academic Affairs"
    },
    {
      title: "Student Financial Advisory",
      category: "financial",
      description: "Confidential guidance on emergency hardship bursaries, campus living costs, and fee installments.",
      department: "Financial Aid"
    },
    {
      title: "Student Community & Clubs",
      category: "social",
      description: "Connect with peer mentors, student-led interest clubs, and low-pressure community meetups.",
      department: "Student Life"
    }
  ];

  const displayResources = resources.length > 0 ? resources.slice(0, 4) : defaultResources;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Greeting Header */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Good morning, {currentStudent?.name?.split(' ')[0] || 'Alex'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Your weekly wellbeing check-in takes less than 30 seconds.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg border border-slate-200">
              {currentStudent.department} • {currentStudent.year}
            </span>
          </div>
        </div>
      </div>

      {/* Main CTA Check-in Card */}
      <div className="bg-gradient-to-br from-sky-600 to-indigo-700 rounded-3xl p-6 sm:p-8 text-white shadow-float relative overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute right-12 top-6 text-white/10 hidden sm:block pointer-events-none">
          <Activity className="w-36 h-36" />
        </div>

        <div className="relative z-10 max-w-xl space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-xs rounded-full text-xs font-semibold text-sky-100">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Weekly Pulse Check-in</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
            How are you doing this week?
          </h2>

          <p className="text-xs sm:text-sm text-sky-100 leading-relaxed">
            Take a moment to reflect on your stress, workload, and rest. Your responses help detect subtle trends earlier and connect you with timely support.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate('/student/check-in')}
              className="px-6 py-3.5 bg-white hover:bg-slate-50 text-sky-800 font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center gap-2 group"
            >
              <ClipboardCheck className="w-4 h-4 text-sky-600" />
              <span>Start Check-in</span>
              <ArrowRight className="w-4 h-4 text-sky-600 group-hover:translate-x-0.5 transition-transform" />
            </button>

            <button
              onClick={() => navigate('/student/history')}
              className="px-4 py-3.5 bg-sky-500/30 hover:bg-sky-500/50 text-white font-semibold text-xs sm:text-sm rounded-xl backdrop-blur-xs transition-colors flex items-center gap-2"
            >
              <Clock className="w-4 h-4" />
              <span>View History</span>
            </button>
          </div>
        </div>
      </div>

      {/* Snapshot Bar: Last check-in & current trend */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-subtle flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 text-slate-600 flex items-center justify-center">
              <Clock className="w-5 h-5 text-sky-600" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-400 block">Last Check-in</span>
              <span className="text-sm font-bold text-slate-800">5 days ago</span>
            </div>
          </div>
          <span className="text-[11px] font-semibold text-sky-600 bg-sky-50 px-2.5 py-1 rounded-lg">
            Active Baseline
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-subtle flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 text-slate-600 flex items-center justify-center">
              <Activity className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-400 block">Current Wellbeing Trend</span>
              <span className="text-sm font-bold text-slate-800">
                {analysis?.status ? analysis.status.replace(/_/g, ' ') : 'Emerging Concern'}
              </span>
            </div>
          </div>
          <SignalBadge status={analysis?.status || 'emerging_concern'} size="sm" />
        </div>
      </div>

      {/* Your Support Options */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">Your Support Options</h3>
            <p className="text-xs text-slate-500">Accessible services available to you across campus anytime.</p>
          </div>
          <button
            onClick={() => setIsCompanionOpen(true)}
            className="text-xs font-semibold text-sky-600 hover:text-sky-800 flex items-center gap-1"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Ask Campus Companion</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {displayResources.map((res, idx) => (
            <SupportResourceCard
              key={idx}
              title={res.title}
              category={res.category}
              description={res.description}
              department={res.department}
              onSelect={() => navigate('/student/check-in')}
            />
          ))}
        </div>
      </div>

      {/* Privacy Notice Card */}
      <PrivacyNotice variant="student" />
    </div>
  );
}
