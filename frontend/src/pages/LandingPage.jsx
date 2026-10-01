import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRole, ROLES } from '../context/RoleContext';
import { 
  Activity, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Users, 
  TrendingUp, 
  HeartHandshake, 
  Lock, 
  BarChart3,
  CheckCircle2
} from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const { setCurrentRole } = useRole();

  const handleStartStudent = () => {
    setCurrentRole(ROLES.STUDENT);
    navigate('/student');
  };

  const handleStartStaff = () => {
    setCurrentRole(ROLES.STAFF);
    navigate('/staff');
  };

  const handleStartAdmin = () => {
    setCurrentRole(ROLES.ADMIN);
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-sky-50/30 flex flex-col justify-between">
      {/* Navbar */}
      <header className="px-6 py-5 max-w-7xl mx-auto w-full flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center shadow-md shadow-sky-600/20">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-slate-900 leading-tight">
              Campus<span className="text-sky-600">Pulse</span>
            </h1>
            <p className="text-[11px] text-slate-500 font-medium">Early Wellbeing Signal System</p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={handleStartStaff}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-2 rounded-xl transition-colors"
          >
            Staff Portal
          </button>
          <button
            onClick={handleStartAdmin}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-2 rounded-xl transition-colors hidden sm:block"
          >
            Admin View
          </button>
          <button
            onClick={handleStartStudent}
            className="text-xs font-bold bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <span>Student Demo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-5xl mx-auto px-6 py-12 sm:py-16 text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-50 border border-sky-200/80 text-sky-800 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-sky-600" />
          <span>Track 02 — Early Warning System: Spot students before crisis</span>
        </div>

        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
          See the change.<br />
          <span className="bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent">
            Offer support earlier.
          </span>
        </h2>

        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          A privacy-aware early wellbeing signal platform that helps students find support and helps universities respond to emerging needs earlier.
        </p>

        {/* Demo CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={handleStartStudent}
            className="px-6 py-3.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm rounded-xl shadow-md shadow-sky-600/20 transition-all flex items-center gap-2 group"
          >
            <span>Explore as Student</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button
            onClick={handleStartStaff}
            className="px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm rounded-xl border border-slate-300 shadow-subtle transition-all flex items-center gap-2"
          >
            <span>View Staff Demo</span>
          </button>

          <button
            onClick={handleStartAdmin}
            className="px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm rounded-xl border border-slate-300 shadow-subtle transition-all flex items-center gap-2"
          >
            <span>University Admin</span>
          </button>
        </div>

        {/* 5-Step Journey Diagram Pill */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-card max-w-4xl mx-auto mt-10 text-left">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-3 text-center sm:text-left">
            End-to-End Prototype Flow
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="w-6 h-6 rounded-full bg-sky-600 text-white flex items-center justify-center text-xs font-bold mx-auto mb-1.5">1</span>
              <span className="text-xs font-bold text-slate-800 block">30s Check-in</span>
              <span className="text-[10px] text-slate-500">Student reports status</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="w-6 h-6 rounded-full bg-sky-600 text-white flex items-center justify-center text-xs font-bold mx-auto mb-1.5">2</span>
              <span className="text-xs font-bold text-slate-800 block">ML Signal Detection</span>
              <span className="text-[10px] text-slate-500">Trajectory & NLP topics</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="w-6 h-6 rounded-full bg-sky-600 text-white flex items-center justify-center text-xs font-bold mx-auto mb-1.5">3</span>
              <span className="text-xs font-bold text-slate-800 block">Explainable AI</span>
              <span className="text-[10px] text-slate-500">Human-readable reasons</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="w-6 h-6 rounded-full bg-sky-600 text-white flex items-center justify-center text-xs font-bold mx-auto mb-1.5">4</span>
              <span className="text-xs font-bold text-slate-800 block">Support Triage</span>
              <span className="text-[10px] text-slate-500">Authorized staff queue</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 col-span-2 sm:col-span-1">
              <span className="w-6 h-6 rounded-full bg-sky-600 text-white flex items-center justify-center text-xs font-bold mx-auto mb-1.5">5</span>
              <span className="text-xs font-bold text-slate-800 block">Cohort Insights</span>
              <span className="text-[10px] text-slate-500">Aggregated admin data</span>
            </div>
          </div>
        </div>

        {/* 3 Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 text-left">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-subtle hover:shadow-card transition-all">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-4">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Early Signals</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Identifies meaningful shifts across repeated weekly check-ins instead of relying on students reaching crisis breaking points.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-subtle hover:shadow-card transition-all">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Human Support</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Connects students directly to appropriate university resources — academic tutoring, advisors, bursaries, and peer networks.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-subtle hover:shadow-card transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Actionable Insights</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Helps university leadership address bottlenecks like mid-semester exam load before waitlists grow to multiple weeks.
            </p>
          </div>
        </div>
      </main>

      {/* Footer & Disclaimer */}
      <footer className="border-t border-slate-200/80 bg-white py-6 px-6 mt-12 text-center space-y-2">
        <p className="text-xs text-slate-500 max-w-xl mx-auto">
          <strong>Important Principle:</strong> CampusPulse is a hackathon prototype for support navigation and early wellbeing signals. It is not a diagnostic system and does not predict or diagnose mental illness.
        </p>
        <p className="text-[11px] text-slate-400">
          CampusPulse • Innovation Hackathon 2026 • University Student Wellbeing Track
        </p>
      </footer>
    </div>
  );
}
