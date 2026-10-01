import React, { useState, useRef, useEffect } from 'react';
import { api } from '../services/api';
import { useRole } from '../context/RoleContext';
import { MessageSquare, Send, X, Sparkles, Shield, Bot } from 'lucide-react';

export default function ChatAssistant() {
  const { isCompanionOpen, setIsCompanionOpen, currentStudent } = useRole();
  const [messages, setMessages] = useState([
    {
      sender: 'assistant',
      text: `Hi ${currentStudent?.name?.split(' ')[0] || 'there'}! I'm Campus Companion, your university support guide. How are you feeling today, or what can I help you navigate?`,
      actions: ["I have three exams and too much coursework", "Struggling with sleep lately", "Need financial fee advice"]
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    if (isCompanionOpen) {
      endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isCompanionOpen]);

  if (!isCompanionOpen) return null;

  const handleSend = async (messageText) => {
    const textToSend = messageText || input;
    if (!textToSend.trim()) return;

    const userMsg = { sender: 'user', text: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    if (!messageText) setInput('');
    setLoading(true);

    try {
      const response = await api.sendCompanionMessage(textToSend, currentStudent?.id);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: response.reply,
          actions: response.suggested_actions || []
        }
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: "Campus support services are available around the clock. You can speak with a confidential Wellbeing Advisor or visit the Academic Support center.",
          actions: ["Explore Academic Support", "Connect with Wellbeing Advisor"]
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 max-w-[calc(100vw-2rem)] h-[520px] bg-white rounded-2xl shadow-float border border-slate-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-sky-600 to-indigo-600 text-white flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center backdrop-blur-xs">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="text-sm font-bold leading-tight">Campus Companion</h4>
            <p className="text-[11px] text-sky-100">Support Navigation Assistant</p>
          </div>
        </div>

        <button
          onClick={() => setIsCompanionOpen(false)}
          className="w-7 h-7 rounded-lg hover:bg-white/20 flex items-center justify-center transition-colors text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-sky-600 text-white rounded-br-none'
                  : 'bg-slate-100 text-slate-800 rounded-bl-none border border-slate-200/60'
              }`}
            >
              {m.text}
            </div>

            {/* Suggested action chips */}
            {m.actions && m.actions.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2 max-w-[90%]">
                {m.actions.map((act, aIdx) => (
                  <button
                    key={aIdx}
                    onClick={() => handleSend(act)}
                    className="text-[11px] font-medium bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200/80 px-2.5 py-1 rounded-full text-left transition-colors"
                  >
                    {act}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-slate-400 text-xs italic p-2">
            <Sparkles className="w-3.5 h-3.5 animate-spin-slow text-sky-500" />
            <span>Thinking...</span>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Non-diagnostic disclaimer */}
      <div className="px-3 py-1.5 bg-slate-50 border-t border-slate-100 text-[10px] text-slate-400 flex items-center justify-center gap-1">
        <Shield className="w-3 h-3 text-slate-400" />
        <span>Non-diagnostic navigation. Not a substitute for medical care.</span>
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about academic, sleep, or personal support..."
          className="flex-1 text-xs px-3 py-2 bg-slate-100 border border-transparent rounded-xl focus:bg-white focus:border-sky-500 focus:outline-none transition-colors"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="w-8 h-8 rounded-xl bg-sky-600 hover:bg-sky-700 disabled:opacity-40 text-white flex items-center justify-center transition-colors shrink-0"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}
