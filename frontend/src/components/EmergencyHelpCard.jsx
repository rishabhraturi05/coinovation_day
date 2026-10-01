import React from 'react';
import { PhoneCall, AlertCircle, ShieldAlert, X, HeartHandshake } from 'lucide-react';

export default function EmergencyHelpCard({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-float border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-5 bg-rose-50 border-b border-rose-100 flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-rose-950">Immediate Support & Emergency</h3>
              <p className="text-xs text-rose-700">24/7 Human Campus Crisis Contacts</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg text-rose-400 hover:text-rose-700 hover:bg-rose-100 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs text-slate-700">
          <p className="leading-relaxed">
            If you are in acute crisis, distress, or feel unsafe right now, please reach out to dedicated human responders immediately. You do not have to wait for an appointment.
          </p>

          <div className="space-y-2.5">
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block text-xs">Student Support Helpline</span>
                <span className="text-[11px] text-slate-500">24/7 Free & Confidential</span>
              </div>
              <span className="font-mono font-bold text-sky-700 bg-sky-50 border border-sky-200 px-2.5 py-1 rounded-lg">
                +91-XXXXXXXXXX
              </span>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block text-xs">Campus Security & Emergency</span>
                <span className="text-[11px] text-slate-500">On-campus immediate dispatch</span>
              </div>
              <span className="font-mono font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-lg">
                +91-XXXXXXXXXX
              </span>
            </div>
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2 text-[11px] text-amber-800">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
            <span>
              <strong>Demo Placeholder:</strong> These numbers are fictional demo contacts for hackathon evaluation purposes. In real-world university deployment, local emergency services are plugged in.
            </span>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs rounded-xl transition-colors"
          >
            Close Emergency Panel
          </button>
        </div>
      </div>
    </div>
  );
}
