import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, Send, Sparkles, Zap, ShieldCheck, 
  BarChart3, FileText, Globe, FlaskConical,
  Plus, ArrowRight, MessageSquare, Save,
  RotateCcw, Download, Info, CheckCircle2,
  AlertTriangle, Calculator, Search, Trash2,
  History as HistoryIcon, Settings, User
} from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'ai';
  text: string;
  component?: React.ReactNode;
}

const SUGGESTED_PROMPTS = [
  "Create a maternity leave policy for Pakistan",
  "What if we increase casual leave to 12 days?",
  "Compare our policy with industry standards",
  "Generate test cases for sandwich rule"
];

export const PolicyCopilot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      text: "Hello! I'm PolicyCopilot. I can help you generate new leave types, simulate policy changes, verify legal compliance, or create test scenarios for your simulator. How can I assist you today?"
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), type: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulated AI Processing
    setTimeout(() => {
      let aiResponse: Partial<Message> = {
        id: (Date.now() + 1).toString(),
        type: 'ai'
      };

      const query = text.toLowerCase();

      if (query.includes('maternity') || query.includes('create')) {
        aiResponse.text = "I've drafted a maternity leave policy compliant with Pakistan Labor Laws (Maternity Benefit Act). Here's the configuration:";
        aiResponse.component = (
          <div className="mt-4 space-y-4 w-full max-w-md animate-in slide-in-from-bottom-4">
            <div className="bg-white rounded-2xl border border-indigo-100 p-5 shadow-sm space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-gray-50">
                <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">New Leave Type</span>
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded">Compliant</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-[9px] text-gray-400 uppercase">Code</p><p className="text-xs font-bold">MAT_PK</p></div>
                <div><p className="text-[9px] text-gray-400 uppercase">Duration</p><p className="text-xs font-bold">90 Days</p></div>
                <div><p className="text-[9px] text-gray-400 uppercase">Type</p><p className="text-xs font-bold">Paid (100%)</p></div>
                <div><p className="text-[9px] text-gray-400 uppercase">Accrual</p><p className="text-xs font-bold">On Event</p></div>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 py-2 bg-[#3E3B6F] text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-[#4A4680] transition-all">Apply to Leave Types</button>
              <button className="flex-1 py-2 bg-white border border-gray-200 text-gray-600 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-gray-50 transition-all">Export Draft</button>
            </div>
          </div>
        );
      } else if (query.includes('12 days') || query.includes('increase')) {
        aiResponse.text = "I've analyzed the impact of increasing Casual Leave from 10 to 12 days:";
        aiResponse.component = (
          <div className="mt-4 space-y-4 w-full max-w-md animate-in slide-in-from-bottom-4">
            <div className="bg-[#3E3B6F] rounded-2xl p-6 text-white space-y-6 shadow-xl relative overflow-hidden">
              <div className="grid grid-cols-2 gap-6 relative z-10">
                <div className="space-y-1">
                  <p className="text-[9px] text-white/50 uppercase font-bold">Employees Affected</p>
                  <p className="text-2xl font-bold">450</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] text-white/50 uppercase font-bold">Annual Volume</p>
                  <p className="text-2xl font-bold">+900 d</p>
                </div>
                <div className="col-span-2 pt-4 border-t border-white/10 space-y-1">
                  <p className="text-[9px] text-[#E8D5A3] uppercase font-bold">Estimated Cost Impact</p>
                  <p className="text-xl font-bold text-[#E8D5A3]">PKR 4.5M / Year</p>
                </div>
              </div>
              <Calculator size={100} className="absolute -bottom-6 -right-6 text-white/5" />
            </div>
            <button className="w-full py-3 bg-white border border-gray-200 text-[#3E3B6F] rounded-2xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-indigo-50 transition-all">
              <FlaskConical size={14} /> Create Simulation Scenario
            </button>
          </div>
        );
      } else if (query.includes('compliant')) {
        aiResponse.text = "Analysis against current Pakistan Labor Laws:";
        aiResponse.component = (
          <div className="mt-4 space-y-3 w-full max-w-md animate-in slide-in-from-bottom-4">
            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-start gap-3">
              <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-emerald-900">Maternity Benefit Act</p>
                <p className="text-[11px] text-emerald-700">✓ Your 90-day policy meets the provincial legal requirement.</p>
              </div>
            </div>
            <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex items-start gap-3">
              <AlertTriangle size={18} className="text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-amber-900">Medical Documentation</p>
                <p className="text-[11px] text-amber-700">⚠ Recommendation: Tighten proof-of-birth requirements for better audit trails.</p>
              </div>
            </div>
          </div>
        );
      } else if (query.includes('test case')) {
        aiResponse.text = "Generated 4 test scenarios for the Sandwich Rule simulator:";
        aiResponse.component = (
          <div className="mt-4 space-y-2 w-full max-w-md animate-in slide-in-from-bottom-4">
            {[
              "Friday + Monday leave (Should deduct 4 days)",
              "Thursday + Friday (Should deduct 2 days)",
              "Friday leave + Public Holiday Monday (Check override)",
              "Mid-week leave spanning Public Holiday"
            ].map((test, i) => (
              <div key={i} className="bg-white p-3 border border-gray-100 rounded-xl text-xs font-medium text-gray-700 flex items-center gap-3">
                <span className="w-5 h-5 bg-indigo-50 text-[#3E3B6F] flex items-center justify-center rounded-lg text-[10px] font-bold">{i+1}</span>
                {test}
              </div>
            ))}
            <button className="w-full mt-2 py-3 bg-gray-900 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-black active:scale-95 transition-all">
              Run All Tests in Simulator
            </button>
          </div>
        );
      } else {
        aiResponse.text = "I'm not quite sure how to handle that specific request yet. I can assist with policy creation, impact analysis, or compliance audits. Try one of the suggestions below!";
      }

      setMessages(prev => [...prev, aiResponse as Message]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="h-full flex flex-col bg-[#F5F5F5] font-['League_Spartan'] overflow-hidden">
      {/* Copilot Header */}
      <div className="bg-white px-8 py-5 border-b border-gray-100 flex items-center justify-between shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-[#E8D5A3] shadow-lg shadow-indigo-900/20">
              <Bot size={28} />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-4 border-white shadow-sm" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-gray-900 uppercase tracking-tight">PolicyCopilot</h3>
              <span className="bg-[#E8D5A3] text-[#3E3B6F] px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest">HR EXPERT AI</span>
            </div>
            <p className="text-xs text-gray-400 font-medium">Drafting, Simulating & Auditing Organization Policy</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
           <div className="text-right mr-4 hidden sm:block">
              <p className="text-[10px] font-bold text-gray-400 uppercase">Context Active</p>
              <p className="text-xs font-bold text-indigo-600 uppercase">Pakistan Labor Law 2025</p>
           </div>
           <button className="p-2.5 bg-gray-50 text-gray-400 hover:text-[#3E3B6F] hover:bg-white rounded-xl transition-all border border-transparent hover:border-gray-100"><HistoryIcon size={20}/></button>
           <button className="p-2.5 bg-gray-50 text-gray-400 hover:text-[#3E3B6F] hover:bg-white rounded-xl transition-all border border-transparent hover:border-gray-100"><Settings size={20}/></button>
        </div>
      </div>

      {/* Main Chat Feed */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 scroll-smooth">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
            <div className={`flex gap-4 max-w-[85%] ${msg.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                msg.type === 'user' ? 'bg-[#3E3B6F] text-white' : 'bg-white text-indigo-600 border border-gray-100'
              }`}>
                {msg.type === 'user' ? <User size={20} /> : <Bot size={20} />}
              </div>
              <div className="space-y-3">
                <div className={`px-6 py-4 rounded-3xl shadow-sm text-sm leading-relaxed ${
                  msg.type === 'user' 
                    ? 'bg-[#3E3B6F] text-white rounded-tr-none' 
                    : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
                }`}>
                  {msg.text}
                </div>
                {msg.component && msg.component}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start animate-in fade-in">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 text-indigo-600 flex items-center justify-center shadow-sm">
                <Bot size={20} />
              </div>
              <div className="bg-white px-6 py-4 rounded-3xl rounded-tl-none border border-gray-100 flex gap-1.5 shadow-sm items-center">
                 <div className="w-1.5 h-1.5 bg-[#3E3B6F]/40 rounded-full animate-bounce [animation-delay:0s]" />
                 <div className="w-1.5 h-1.5 bg-[#3E3B6F]/40 rounded-full animate-bounce [animation-delay:0.2s]" />
                 <div className="w-1.5 h-1.5 bg-[#3E3B6F]/40 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Section */}
      <div className="p-8 bg-white border-t border-gray-100 shrink-0 space-y-6 z-10">
        {/* Suggested Prompts */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide no-scrollbar">
          {SUGGESTED_PROMPTS.map(q => (
            <button
              key={q}
              onClick={() => handleSend(q)}
              className="whitespace-nowrap px-4 py-2 bg-indigo-50/50 hover:bg-indigo-100 text-[#3E3B6F] text-xs font-bold rounded-xl border border-indigo-100/50 transition-all active:scale-95 flex items-center gap-2"
            >
              <Sparkles size={12} className="text-[#E8D5A3]" /> {q}
            </button>
          ))}
        </div>

        <div className="relative">
          <div className="absolute left-5 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
             <Zap size={22} className="text-indigo-400" />
          </div>
          <input 
            type="text" 
            placeholder="Ask Copilot to generate, analyze or audit a policy..." 
            className="w-full pl-14 pr-16 py-5 bg-gray-50 border-2 border-transparent rounded-[28px] focus:bg-white focus:border-[#3E3B6F] outline-none transition-all font-medium text-gray-800 shadow-inner text-sm"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
          />
          <button 
            onClick={() => handleSend(input)}
            disabled={!input.trim()}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 p-3 bg-[#3E3B6F] text-white rounded-2xl hover:bg-[#4A4680] transition-all disabled:opacity-30 shadow-lg shadow-[#3E3B6F]/20 active:scale-90"
          >
            <Send size={20} />
          </button>
        </div>
        
        <p className="text-center text-[10px] font-bold text-gray-300 uppercase tracking-[0.25em] flex items-center justify-center gap-2">
          <ShieldCheck size={12} className="text-emerald-500" /> AI Suggestions are logged for compliance audit trail
        </p>
      </div>

      <style>
        {`
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
          .scrollbar-hide::-webkit-scrollbar { display: none; }
        `}
      </style>
    </div>
  );
};