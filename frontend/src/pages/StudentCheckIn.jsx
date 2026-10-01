import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRole } from '../context/RoleContext';
import { api } from '../services/api';
import CheckInSlider from '../components/CheckInSlider';
import CheckInQuestion from '../components/CheckInQuestion';
import LoadingAnalysis from '../components/LoadingAnalysis';
import PrivacyNotice from '../components/PrivacyNotice';
import { 
  ClipboardCheck, 
  Send, 
  Sparkles, 
  RotateCcw, 
  Check, 
  HelpCircle,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

export default function StudentCheckIn() {
  const navigate = useNavigate();
  const { currentStudent } = useRole();

  // Form state
  const [stress, setStress] = useState(3);
  const [sleep, setSleep] = useState(3);
  const [workload, setWorkload] = useState(3);
  const [social, setSocial] = useState(3);
  const [overwhelmed, setOverwhelmed] = useState(2);
  const [attendanceProblem, setAttendanceProblem] = useState(false);
  const [supportChoice, setSupportChoice] = useState("No, I'm okay for now");
  const [freeText, setFreeText] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [submittedCheckinId, setSubmittedCheckinId] = useState(null);

  // Pre-fill demo scenario (CP1042 Week 4)
  const handlePreFillDemo = () => {
    setStress(5);
    setSleep(1);
    setWorkload(5);
    setSocial(2);
    setOverwhelmed(5);
    setAttendanceProblem(true);
    setSupportChoice("I'd like academic support");
    setFreeText("I have three assignments due this week and two exams coming up. I am barely sleeping and I don't know how to manage everything.");
  };

  const supportOptions = [
    { id: "No, I'm okay for now", label: "No, I'm okay for now", desc: "Just logging my weekly reflection." },
    { id: "I'd like to talk to someone", label: "I'd like to talk to someone", desc: "Connect with a confidential wellbeing advisor." },
    { id: "I'd like academic support", label: "I'd like academic support", desc: "Help with study scheduling, tutoring, or coursework." },
    { id: "I'd like help finding resources", label: "I'd like help finding resources", desc: "Guidance navigating financial aid, housing, or student groups." },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const wantsSupport = supportChoice !== "No, I'm okay for now";

    const payload = {
      student_id: currentStudent.id,
      stress_score: stress,
      sleep_score: sleep,
      workload_score: workload,
      social_connection_score: social,
      overwhelmed_score: overwhelmed,
      attendance_problem: attendanceProblem,
      support_requested: wantsSupport,
      support_type: wantsSupport ? supportChoice : null,
      free_text: freeText.trim() || null
    };

    try {
      const res = await api.submitCheckIn(payload);
      setSubmittedCheckinId(res.id);
      // Trigger processing screen
      setAnalyzing(true);
    } catch (err) {
      console.error("Submission failed, continuing to analysis with local state:", err);
      setAnalyzing(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAnalysisComplete = () => {
    navigate('/student/result', { 
      state: { 
        checkinId: submittedCheckinId,
        studentId: currentStudent.id 
      } 
    });
  };

  if (analyzing) {
    return <LoadingAnalysis onComplete={handleAnalysisComplete} duration={1900} />;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Header & Demo Pre-fill Pill */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 text-xs font-semibold mb-1">
            <ClipboardCheck className="w-3.5 h-3.5" />
            <span>Weekly Check-in</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            How are you doing this week?
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Your responses are confidential and help guide early human support.
          </p>
        </div>

        {/* Demo Scenario Button */}
        <button
          type="button"
          onClick={handlePreFillDemo}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold rounded-xl transition-colors shadow-xs"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Pre-fill CP1042 Demo Scenario</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Q1: Stress */}
        <CheckInQuestion number={1} total={7}>
          <CheckInSlider
            id="q1-stress"
            label="How stressed have you felt this week?"
            description="Reflect on emotional tension and day-to-day pressure."
            value={stress}
            onChange={setStress}
            min={1}
            max={5}
            minLabel="Minimal Stress"
            maxLabel="High Pressure"
            stepLabels={["Very Low", "Manageable", "Moderate", "High", "Very High"]}
          />
        </CheckInQuestion>

        {/* Q2: Sleep */}
        <CheckInQuestion number={2} total={7}>
          <CheckInSlider
            id="q2-sleep"
            label="How would you rate your sleep quality?"
            description="Consider whether you wake up feeling rested and recharged."
            value={sleep}
            onChange={setSleep}
            min={1}
            max={5}
            minLabel="Poor / Restless"
            maxLabel="Restorative & Deep"
            stepLabels={["Severely Disrupted", "Poor", "Fair", "Good", "Excellent"]}
          />
        </CheckInQuestion>

        {/* Q3: Academic Workload */}
        <CheckInQuestion number={3} total={7}>
          <CheckInSlider
            id="q3-workload"
            label="How manageable has your academic workload been?"
            description="Assignments, lab sessions, readings, and exam preparations."
            value={workload}
            onChange={setWorkload}
            min={1}
            max={5}
            minLabel="Very Light"
            maxLabel="Extremely Heavy"
            stepLabels={["Very Light", "Comfortable", "Moderate", "Heavy", "Overwhelming"]}
          />
        </CheckInQuestion>

        {/* Q4: Social Connection */}
        <CheckInQuestion number={4} total={7}>
          <CheckInSlider
            id="q4-social"
            label="How connected have you felt to people around you?"
            description="Peers, faculty, campus societies, family, or friends."
            value={social}
            onChange={setSocial}
            min={1}
            max={5}
            minLabel="Isolated"
            maxLabel="Strongly Connected"
            stepLabels={["Very Isolated", "Somewhat Distant", "Neutral", "Connected", "Very Supported"]}
          />
        </CheckInQuestion>

        {/* Q5: Overwhelmed */}
        <CheckInQuestion number={5} total={7}>
          <CheckInSlider
            id="q5-overwhelmed"
            label="How often have you felt overwhelmed?"
            description="Times where demands felt like too much to handle."
            value={overwhelmed}
            onChange={setOverwhelmed}
            min={1}
            max={5}
            minLabel="Never"
            maxLabel="Constantly"
            stepLabels={["Never", "Rarely", "Occasionally", "Frequently", "Constantly"]}
          />
        </CheckInQuestion>

        {/* Q6: Struggling with classes/work (Yes/No) */}
        <CheckInQuestion number={6} total={7}>
          <label className="block text-sm font-semibold text-slate-800 mb-1">
            Have you been struggling to keep up with classes or coursework?
          </label>
          <p className="text-xs text-slate-500 mb-3">
            Missing lectures, falling behind on problem sets, or struggling with deadlines.
          </p>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setAttendanceProblem(false)}
              className={`p-3.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                !attendanceProblem
                  ? 'bg-sky-50 border-sky-400 text-sky-800 ring-2 ring-sky-200'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>No, staying on track</span>
            </button>

            <button
              type="button"
              onClick={() => setAttendanceProblem(true)}
              className={`p-3.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                attendanceProblem
                  ? 'bg-amber-50 border-amber-400 text-amber-800 ring-2 ring-amber-200'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>Yes, struggling to keep up</span>
            </button>
          </div>
        </CheckInQuestion>

        {/* Q7: Would you like support */}
        <CheckInQuestion number={7} total={7}>
          <label className="block text-sm font-semibold text-slate-800 mb-1">
            Would you like support from someone?
          </label>
          <p className="text-xs text-slate-500 mb-3">
            You can always request support at any time, even if you feel okay today.
          </p>

          <div className="space-y-2">
            {supportOptions.map((opt) => {
              const isSelected = supportChoice === opt.id;
              return (
                <div
                  key={opt.id}
                  onClick={() => setSupportChoice(opt.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-sky-50/80 border-sky-400 ring-2 ring-sky-200 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                  }`}
                >
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">{opt.label}</span>
                    <span className="text-[11px] text-slate-500">{opt.desc}</span>
                  </div>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    isSelected ? 'bg-sky-600 border-sky-600 text-white' : 'border-slate-300 bg-white'
                  }`}>
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </div>
              );
            })}
          </div>
        </CheckInQuestion>

        {/* Free text note */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-subtle space-y-2">
          <label htmlFor="free-text-note" className="block text-sm font-semibold text-slate-800">
            Anything else you'd like us to know? <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <p className="text-xs text-slate-500">
            Our local NLP model identifies broad support topics (e.g. academic, financial) to tailor your options.
          </p>
          <textarea
            id="free-text-note"
            rows={3}
            value={freeText}
            onChange={(e) => setFreeText(e.target.value)}
            placeholder="Tell us about anything that has been affecting you recently..."
            className="w-full text-xs p-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-sky-500 focus:outline-none transition-colors"
          />
        </div>

        {/* Privacy Note */}
        <PrivacyNotice variant="student" />

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-md shadow-sky-600/20 transition-all flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>{submitting ? 'Submitting Responses...' : 'Submit Check-in'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
