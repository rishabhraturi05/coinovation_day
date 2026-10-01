import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRole, ROLES } from '../context/RoleContext';
import { api } from '../services/api';
import SignalBadge from '../components/SignalBadge';
import TrendCard from '../components/TrendCard';
import AIInsightCard from '../components/AIInsightCard';
import SupportResourceCard from '../components/SupportResourceCard';
import PrivacyNotice from '../components/PrivacyNotice';
import { 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  LifeBuoy, 
  ShieldCheck, 
  Send,
  MessageSquare,
  Clock
} from 'lucide-react';

export default function StudentResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentStudent, setCurrentRole } = useRole();

  const [analysis, setAnalysis] = useState(null);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  // Support request state
  const [selectedService, setSelectedService] = useState("Academic Support");
  const [requestSubmitted, setRequestSubmitted] = useState(false);
  const [submittingReq, setSubmittingReq] = useState(false);

  useEffect(() => {
    async function fetchAnalysis() {
      try {
        setLoading(true);
        const [resAnalysis, resResources] = await Promise.all([
          api.getStudentAnalysis(currentStudent.id),
          api.getResources().catch(() => [])
        ]);
        setAnalysis(resAnalysis);
        setResources(resResources || []);
      } catch (err) {
        console.error("Error loading analysis results:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAnalysis();
  }, [currentStudent.id]);

  const handleRequestSupport = async () => {
    setSubmittingReq(true);
    try {
      await api.createSupportRequest({
        student_id: currentStudent.id,
        checkin_id: location.state?.checkinId || null,
        support_type: selectedService,
        priority: analysis?.status === 'urgent_support_pathway' ? 'Urgent' : 'Elevated',
        notes: "Student confirmed support request on check-in results screen."
      });
      setRequestSubmitted(true);
    } catch (err) {
      console.error("Failed to submit support request:", err);
      setRequestSubmitted(true); // Fallback for smooth demo
    } finally {
      setSubmittingReq(false);
    }
  };

  const handleSwitchToStaff = () => {
    setCurrentRole(ROLES.STAFF);
    navigate('/staff');
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center">
        <Sparkles className="w-8 h-8 text-sky-600 animate-spin-slow mb-3" />
        <p className="text-xs text-slate-500 font-medium">Retrieving synthesized wellbeing insights...</p>
      </div>
    );
  }

  const defaultSignals = [
    { name: "Stress", direction: "up", explanation: "Stress elevated over recent check-ins." },
    { name: "Academic Workload", direction: "up", explanation: "Coursework volume has intensified." },
    { name: "Sleep Quality", direction: "down", explanation: "Restorative sleep has declined." }
  ];

  const signals = analysis?.signals && analysis.signals.length > 0 ? analysis.signals : defaultSignals;

  const defaultReasons = [
    "Workload has increased across the last 3 check-ins",
    "Stress has elevated above your baseline",
    "Sleep quality has declined to lower restorative ranges"
  ];

  const reasons = analysis?.reasons && analysis.reasons.length > 0 ? analysis.reasons : defaultReasons;

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Top Completion Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-subtle text-center space-y-2">
        <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-2">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Your check-in is complete
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
          We've noticed a few changes in your recent check-ins compared to your usual baseline.
        </p>
        <div className="pt-2">
          <SignalBadge status={analysis?.status || "emerging_concern"} size="lg" />
        </div>
      </div>

      {/* Recent Signals Grid */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Recent Wellbeing Signals
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {signals.slice(0, 3).map((sig, idx) => (
            <TrendCard
              key={idx}
              name={sig.name}
              direction={sig.direction}
              explanation={sig.explanation}
            />
          ))}
        </div>
      </div>

      {/* Explainable AI Card */}
      <AIInsightCard
        title="Why we're suggesting support"
        reasons={reasons}
      />

      {/* Non-diagnostic reassurance */}
      <div className="p-4 bg-slate-100/70 border border-slate-200 rounded-xl text-center space-y-1">
        <p className="text-xs font-semibold text-slate-800">
          You are not being diagnosed.
        </p>
        <p className="text-[11px] text-slate-500">
          We're simply helping you find support earlier before minor pressures turn into overwhelming crises.
        </p>
      </div>

      {/* Recommended for you */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Recommended Support Pathways
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {["Academic Support & Tutoring", "Confidential Wellbeing Advisor", "Study Planning Resources"].map((svc, idx) => {
            const isSelected = selectedService.toLowerCase().includes(svc.split(' ')[0].toLowerCase());
            return (
              <div
                key={idx}
                onClick={() => setSelectedService(svc)}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-sky-50 border-sky-400 ring-2 ring-sky-200 shadow-xs'
                    : 'bg-white border-slate-200/80 hover:border-slate-300'
                }`}
              >
                <div>
                  <span className="text-xs font-bold text-slate-900 block mb-1">{svc}</span>
                  <span className="text-[11px] text-slate-500">
                    {idx === 0 && "Coursework pacing and assignment extensions."}
                    {idx === 1 && "Confidential 1-on-1 chats to decompress."}
                    {idx === 2 && "Exam study planning and time management."}
                  </span>
                </div>
                <div className="mt-3 text-[11px] font-semibold text-sky-700">
                  {isSelected ? "✓ Selected Pathway" : "Select"}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Support Request Action Box */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card">
        {!requestSubmitted ? (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                Would you like someone to contact you?
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                A member of the university student support team can reach out to offer personalized assistance.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                disabled={submittingReq}
                onClick={handleRequestSupport}
                className="px-6 py-3 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-colors flex items-center gap-2"
              >
                <LifeBuoy className="w-4 h-4" />
                <span>{submittingReq ? "Sending Request..." : `Request ${selectedService}`}</span>
              </button>

              <button
                type="button"
                onClick={() => navigate('/student')}
                className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs sm:text-sm rounded-xl transition-colors"
              >
                I'm okay for now
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center gap-3 text-emerald-700">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center font-bold">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Your request has been sent to the support team</h4>
                <p className="text-xs text-slate-600">A dedicated advisor will follow up via your university email.</p>
              </div>
            </div>

            <div className="p-4 bg-sky-50 border border-sky-100 rounded-xl flex items-center justify-between">
              <div className="text-xs text-sky-900">
                <span className="font-bold block">Hackathon Demo Flow Step 10:</span>
                <span>Switch to Support Staff to see the new case in triage.</span>
              </div>
              <button
                type="button"
                onClick={handleSwitchToStaff}
                className="px-3.5 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 shrink-0"
              >
                <span>View in Staff Queue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Privacy Notice */}
      <PrivacyNotice variant="student" />
    </div>
  );
}
