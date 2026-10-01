import React, { useEffect, useState } from 'react';
import { Activity, Sparkles, Brain, Compass } from 'lucide-react';

export default function LoadingAnalysis({ onComplete, duration = 1800 }) {
  const [stepIndex, setStepIndex] = useState(0);

  const steps = [
    "Normalizing wellbeing indicators...",
    "Calculating multi-week trajectory and trend slope...",
    "Extracting support categories from notes...",
    "Synthesizing explainable recommendations..."
  ];

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setStepIndex((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, duration / steps.length);

    const timer = setTimeout(() => {
      if (onComplete) onComplete();
    }, duration);

    return () => {
      clearInterval(stepInterval);
      clearTimeout(timer);
    };
  }, [duration, onComplete]);

  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300">
      <div className="relative mb-6">
        {/* Outer pulsing ring */}
        <div className="w-20 h-20 rounded-full bg-sky-100 animate-ping absolute inset-0 opacity-40" />
        
        {/* Core rotating radar icon */}
        <div className="w-20 h-20 rounded-2xl bg-white border border-sky-200 shadow-float flex items-center justify-center relative z-10">
          <Activity className="w-10 h-10 text-sky-600 animate-pulse-subtle" />
        </div>
      </div>

      <h3 className="text-lg font-bold text-slate-900 mb-1">
        Analyzing Recent Wellbeing Signals...
      </h3>
      <p className="text-xs text-slate-500 max-w-sm mb-5">
        Connecting responses with your historical baseline to identify meaningful shifts.
      </p>

      {/* Progress pill */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-full text-xs font-medium text-slate-700">
        <Sparkles className="w-3.5 h-3.5 text-sky-600 animate-spin-slow" />
        <span>{steps[stepIndex]}</span>
      </div>
    </div>
  );
}
