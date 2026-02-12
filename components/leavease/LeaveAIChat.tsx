import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, Send, User, Sparkles, Calendar, 
  Info, CheckCircle2, AlertTriangle, ArrowRight,
  Zap, Clock, LayoutGrid, ChevronRight, Plus,
  /* Added missing ShieldCheck import */
  ShieldCheck
} from 'lucide-react';
import { LeaveType } from '../../types';

interface Message {
  id: string;
  type: 'user' | 'ai';
  text: string;
  timestamp: string;
  component?: React.ReactNode;
}

const SUGGESTED_QUESTIONS = [
  "What's my leave balance?",
  "Can I take leave next Friday?",
  "Who's off next week?",
  "Explain the sandwich rule",
  "When does my leave expire?"
];

export const LeaveAIChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      text: "Hello! I'm your LeaveEase Assistant. I can help you check balances, verify dates, or explain company policies. What's on your mind?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
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

    const userMsg: Message = {
      id: Date.now().toString(),
      type: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Mock AI logic
    setTimeout(() => {
      let aiResponse: Partial<Message> = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      const query = text.toLowerCase();

      if (query.includes('balance')) {
        aiResponse.text = "You have 16 days of Annual Leave available. Here is your full breakdown:";
        aiResponse.component = (
          <div className="mt-4 space-y-3 w-full max-w-sm">
            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm space-y-3">
              {[
                { label: 'Annual Leave', val: 16, total: 24, color: 'bg-indigo-600' },
                { label: 'Sick Leave', val: 10, total: 12, color: 'bg-red-500' },
                { label: 'Casual Leave', val: 7, total: 10, color: 'bg-amber-500' },
              ].map(b => (
                <div key={b.label} className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold uppercase text-gray-400">
                    <span>{b.label}</span>
                    <span>{b.val} / {b.total} d</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${b.color}`} style={{ width: `${(b.val/b.total)*100}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full py-2.5 bg-[#3E3B6F] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-900/10">
              <Plus size={14} /> Apply Leave Now
            </button>
          </div>
        );
      } else if (query.includes('friday') || query.includes('can i')) {
        aiResponse.text = "I've checked the schedule for next Friday (Jan 24). It looks good!";
        aiResponse.component = (
          <div className="mt-4 bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-4 w-full max-w-sm">
            <div className="flex items-center gap-3 text-emerald-600 font-bold text-sm">
              <CheckCircle2 size={18} /> Jan 24 is Available
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Your Balance</span>
                <span className="font-bold text-gray-800">OK (16d)</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Team Coverage</span>
                <span className="font-bold text-gray-800">80% (OK)</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Blackout Periods</span>
                <span className="font-bold text-gray-800">None</span>
              </div>
            </div>
            <button className="w-full py-2 bg-indigo-50 text-[#3E3B6F] rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-indigo-100 transition-all">
              Draft Request for Jan 24
            </button>
          </div>
        );
      } else if (query.includes('who') || query.includes('off')) {
        aiResponse.text = "Next week, 3 members from the Engineering team are scheduled to be away:";
        aiResponse.component = (
          <div className="mt-4 bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-4 w-full max-w-sm">
            <div className="flex gap-1 mb-2">
               {[0,0,1,0,2,0,0].map((v, i) => (
                 <div key={i} className={`flex-1 h-6 rounded ${v === 0 ? 'bg-gray-50' : v === 1 ? 'bg-indigo-200' : 'bg-indigo-500'}`} />
               ))}
            </div>
            <div className="space-y-3">
               <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-lg bg-accent-peach flex items-center justify-center font-bold text-[10px]">SM</div>
                 <div><p className="text-xs font-bold text-gray-800">Sara Miller</p><p className="text-[9px] text-gray-400">Mon - Annual Leave</p></div>
               </div>
               <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center font-bold text-[10px] text-indigo-600">AK</div>
                 <div><p className="text-xs font-bold text-gray-800">Ahmed Khan</p><p className="text-[9px] text-gray-400">Wed to Fri - Sick Leave</p></div>
               </div>
            </div>
          </div>
        );
      } else if (query.includes('sandwich')) {
        aiResponse.text = "The 'Sandwich Rule' ensures continuity in work schedules. Here's how it works:";
        aiResponse.component = (
          <div className="mt-4 bg-indigo-50 border border-indigo-100 rounded-2xl p-5 space-y-3 w-full max-w-sm">
            <p className="text-xs text-indigo-900 leading-relaxed font-medium">
              If you take leave on <span className="font-bold underline">Friday</span> and <span className="font-bold underline">Monday</span>, the intervening Saturday and Sunday are also counted as leave days.
            </p>
            <div className="bg-white p-3 rounded-xl text-[10px] font-bold text-indigo-400 flex items-center gap-2">
              <Info size={14} /> Example: 2 applied days becomes 4 deducted days.
            </div>
          </div>
        );
      } else {
        aiResponse.text = "That's a great question! I'm still learning some of the finer details of the 2025 policy, but I can definitely check your balances or show you the team calendar.";
      }

      setMessages(prev => [...prev, aiResponse as Message]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="h-full flex flex-col bg-[#F5F5F5] font-['League_Spartan'] max-w-5xl mx-auto border-x border-gray-200 shadow-2xl animate-in fade-in duration-500">
      {/* Chat Header */}
      <div className="bg-white px-8 py-5 border-b border-gray-100 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-[#E8D5A3] shadow-lg shadow-indigo-900/20">
              <Bot size={28} />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-4 border-white shadow-sm" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-gray-900">Policy Copilot</h3>
              <span className="bg-[#E8D5A3] text-[#3E3B6F] px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest">AI Expert</span>
            </div>
            <p className="text-xs text-gray-400 font-medium">Ask me anything about leave and attendance</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
           <button className="p-2 text-gray-400 hover:text-[#3E3B6F] hover:bg-gray-50 rounded-lg transition-all"><LayoutGrid size={20}/></button>
           <button className="p-2 text-gray-400 hover:text-[#3E3B6F] hover:bg-gray-50 rounded-lg transition-all"><Clock size={20}/></button>
        </div>
      </div>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-8 space-y-8 scroll-smooth"
      >
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
            <div className={`flex gap-4 max-w-[85%] ${msg.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                msg.type === 'user' ? 'bg-[#3E3B6F] text-white' : 'bg-white text-indigo-600'
              }`}>
                {msg.type === 'user' ? <User size={18} /> : <Bot size={18} />}
              </div>
              <div className="space-y-2">
                <div className={`px-5 py-3.5 rounded-3xl shadow-sm text-sm leading-relaxed ${
                  msg.type === 'user' 
                    ? 'bg-[#3E3B6F] text-white rounded-tr-none' 
                    : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
                }`}>
                  {msg.text}
                </div>
                {msg.component && msg.component}
                <p className={`text-[10px] font-bold text-gray-400 uppercase tracking-tighter ${msg.type === 'user' ? 'text-right' : 'text-left'}`}>
                  {msg.timestamp}
                </p>
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start animate-in fade-in">
            <div className="flex gap-4">
              <div className="w-9 h-9 rounded-xl bg-white text-indigo-600 flex items-center justify-center border border-gray-100 shadow-sm">
                <Bot size={18} />
              </div>
              <div className="bg-white px-5 py-4 rounded-3xl rounded-tl-none border border-gray-100 flex gap-1.5 shadow-sm">
                 <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" />
                 <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                 <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Bar Section */}
      <div className="p-8 bg-white border-t border-gray-100 shrink-0 space-y-6">
        {/* Suggested Questions */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide no-scrollbar">
          {SUGGESTED_QUESTIONS.map(q => (
            <button
              key={q}
              onClick={() => handleSend(q)}
              className="whitespace-nowrap px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-[#3E3B6F] text-xs font-bold rounded-xl border border-indigo-100 transition-all active:scale-95"
            >
              {q}
            </button>
          ))}
        </div>

        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
             <Sparkles size={20} className="text-[#3E3B6F]" />
          </div>
          <input 
            type="text" 
            placeholder="Type your question here (e.g. 'Can I take leave on Jan 24?')..." 
            className="w-full pl-12 pr-16 py-4 bg-gray-50 border-2 border-transparent rounded-[24px] focus:bg-white focus:border-[#3E3B6F] outline-none transition-all font-medium text-gray-800 shadow-inner"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
          />
          <button 
            onClick={() => handleSend(input)}
            disabled={!input.trim()}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-[#3E3B6F] text-white rounded-2xl hover:bg-[#4A4680] transition-all disabled:opacity-50 disabled:grayscale shadow-lg shadow-[#3E3B6F]/20 active:scale-90"
          >
            <Send size={20} />
          </button>
        </div>
        
        <p className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] flex items-center justify-center gap-2">
          {/* Corrected: This icon was using a name not available in scope before adding the import */}
          <ShieldCheck size={12} className="text-emerald-500" /> Securely accessing John Doe's profile for 2025
        </p>
      </div>

      <style>
        {`
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}
      </style>
    </div>
  );
};