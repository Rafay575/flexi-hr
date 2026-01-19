import React, { useState, useRef, useEffect } from 'react';
import { 
  Cpu, 
  Send, 
  User, 
  Bot, 
  Clock, 
  Calendar, 
  AlertTriangle, 
  TrendingUp, 
  ChevronRight, 
  Zap,
  MoreHorizontal,
  History,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  type?: 'text' | 'status_card' | 'schedule_card' | 'team_card' | 'action_card';
  data?: any;
}

const SUGGESTED_QUESTIONS = [
  "Why was I marked late yesterday?",
  "What's my schedule this week?",
  "How much OT do I have?",
  "Who's late today?",
  "Show attendance issues"
];

export const TimeSyncAIChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm your TimeSync AI assistant. I can help you with your attendance, schedules, and team compliance. What would you like to know today?",
      type: 'text'
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

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate AI thinking
    setTimeout(() => {
      let aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '',
        type: 'text'
      };

      const query = text.toLowerCase();

      if (query.includes('late yesterday')) {
        aiResponse.content = "Here is your attendance analysis for yesterday (Jan 09, 2025):";
        aiResponse.type = 'status_card';
        aiResponse.data = {
          date: 'Jan 09, 2025',
          status: 'LATE',
          inTime: '09:25 AM',
          outTime: '06:30 PM',
          hours: '8h 05m',
          reason: 'You punched in at 9:25 AM, which is 10 minutes beyond your 15-minute grace period.'
        };
      } else if (query.includes('schedule this week')) {
        aiResponse.content = "I've retrieved your roster for this week:";
        aiResponse.type = 'schedule_card';
      } else if (query.includes('who\'s late') || query.includes('team attendance')) {
        aiResponse.content = "Current team presence for today, Jan 10:";
        aiResponse.type = 'team_card';
        aiResponse.data = {
          present: 12,
          total: 15,
          late: 2,
          absent: 1,
          lateNames: ['Michael Chen', 'Sarah Chen']
        };
      } else if (query.includes('ot') || query.includes('overtime')) {
        aiResponse.content = "You have accumulated 8.5 hours of approved overtime this cycle. This is 12% higher than your average.";
        aiResponse.type = 'action_card';
      } else {
        aiResponse.content = "I understand you're asking about " + text + ". I'm currently connected to the TimeSync Core Engine to provide real-time data. Could you try one of the suggested questions for a detailed data view?";
      }

      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] animate-in fade-in duration-500">
      {/* CHAT HEADER */}
      <div className="bg-white p-6 border-b border-gray-200 flex items-center justify-between rounded-t-3xl shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary-gradient rounded-2xl flex items-center justify-center text-white shadow-lg">
            <Cpu size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800 tracking-tight">TimeSync Intelligence</h2>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Neural Engine</span>
            </div>
          </div>
        </div>
        <button className="p-2 text-gray-400 hover:bg-gray-50 rounded-xl transition-all">
          <History size={20} />
        </button>
      </div>

      {/* MESSAGES AREA */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-8 bg-gray-50/50 custom-scrollbar"
      >
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
            <div className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-10 h-10 rounded-2xl shrink-0 flex items-center justify-center shadow-md ${
                msg.role === 'user' ? 'bg-[#E8B4A0] text-[#3E3B6F]' : 'bg-[#3E3B6F] text-white'
              }`}>
                {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
              </div>
              <div className="space-y-4">
                <div className={`p-4 rounded-3xl shadow-sm border ${
                  msg.role === 'user' 
                    ? 'bg-[#3E3B6F] text-white border-[#3E3B6F]' 
                    : 'bg-white text-gray-800 border-gray-100'
                }`}>
                  <p className="text-sm font-medium leading-relaxed">{msg.content}</p>
                </div>

                {/* CONDITIONAL CARDS */}
                {msg.type === 'status_card' && (
                  <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-xl animate-in zoom-in-95 duration-300 w-full max-w-sm">
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100 uppercase tracking-widest">{msg.data.date}</span>
                      <span className="text-[10px] font-black text-red-600 bg-red-50 px-2.5 py-1 rounded-full border border-red-100 uppercase tracking-widest">{msg.data.status}</span>
                    </div>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-[9px] font-black text-gray-400 uppercase">Punch In</p>
                          <p className="text-sm font-black text-gray-800">{msg.data.inTime}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[9px] font-black text-gray-400 uppercase">Net Hours</p>
                          <p className="text-sm font-black text-gray-800">{msg.data.hours}</p>
                        </div>
                      </div>
                      <div className="p-4 bg-orange-50 border border-orange-100 rounded-2xl flex gap-3">
                        <AlertTriangle size={16} className="text-orange-500 shrink-0 mt-0.5" />
                        <p className="text-[11px] text-orange-700 font-medium leading-relaxed">{msg.data.reason}</p>
                      </div>
                      <button className="w-full py-3 bg-[#3E3B6F] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-[#3E3B6F]/20 hover:scale-[1.02] transition-all">
                        Request Regularization
                      </button>
                    </div>
                  </div>
                )}

                {msg.type === 'schedule_card' && (
                  <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-xl animate-in zoom-in-95 duration-300 w-full max-w-md">
                    <div className="bg-indigo-50 p-4 border-b border-indigo-100 flex items-center gap-2">
                      <Calendar size={16} className="text-indigo-600" />
                      <span className="text-xs font-black text-indigo-900 uppercase tracking-widest">Weekly Roster</span>
                    </div>
                    <div className="p-4 space-y-2">
                       {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day, i) => (
                         <div key={day} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-xl transition-colors">
                            <span className="text-xs font-bold text-gray-400 w-8">{day}</span>
                            <div className="flex-1 flex items-center gap-3">
                               <div className="h-1.5 w-1.5 rounded-full bg-[#3E3B6F]"></div>
                               <span className="text-xs font-bold text-gray-800">Morning Shift</span>
                            </div>
                            <span className="text-[10px] font-black text-indigo-600 tabular-nums">09:00 — 18:00</span>
                         </div>
                       ))}
                    </div>
                    <div className="p-3 bg-gray-50 border-t border-gray-100 flex justify-center">
                      <button className="text-[10px] font-black text-[#3E3B6F] uppercase tracking-widest hover:underline">Full Schedule View</button>
                    </div>
                  </div>
                )}

                {msg.type === 'team_card' && (
                  <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-xl animate-in zoom-in-95 duration-300 w-full max-w-sm">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-green-50 text-green-600 rounded-xl"><CheckCircle2 size={18} /></div>
                      <h4 className="text-sm font-black text-gray-800 uppercase tracking-widest">Team Adherence</h4>
                    </div>
                    <div className="grid grid-cols-3 gap-3 mb-6">
                      <div className="p-3 bg-gray-50 rounded-2xl text-center">
                        <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Present</p>
                        <p className="text-base font-black text-gray-800">{msg.data.present}</p>
                      </div>
                      <div className="p-3 bg-orange-50 rounded-2xl text-center">
                        <p className="text-[9px] font-black text-orange-400 uppercase mb-1">Late</p>
                        <p className="text-base font-black text-orange-600">{msg.data.late}</p>
                      </div>
                      <div className="p-3 bg-red-50 rounded-2xl text-center">
                        <p className="text-[9px] font-black text-red-400 uppercase mb-1">Absent</p>
                        <p className="text-base font-black text-red-600">{msg.data.absent}</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Late Today:</p>
                      {msg.data.lateNames.map((name: string) => (
                        <div key={name} className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl group hover:bg-orange-50 transition-all">
                          <div className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-[10px] font-black text-gray-400 group-hover:text-orange-500 border border-gray-100 group-hover:border-orange-200">{name[0]}</div>
                            <span className="text-xs font-bold text-gray-700">{name}</span>
                          </div>
                          <ChevronRight size={14} className="text-gray-300" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start animate-pulse">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-2xl bg-[#3E3B6F] flex items-center justify-center text-white shadow-md">
                <Bot size={20} />
              </div>
              <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex gap-1">
                <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce delay-100"></div>
                <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SUGGESTED QUESTIONS */}
      <div className="bg-white/50 border-t border-gray-100 p-4 shrink-0 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-3">
          <Zap size={14} className="text-yellow-500 shrink-0" />
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest shrink-0">Quick Queries:</span>
          {SUGGESTED_QUESTIONS.map(q => (
            <button
              key={q}
              onClick={() => handleSend(q)}
              className="px-4 py-1.5 bg-white border border-gray-200 rounded-full text-xs font-bold text-[#3E3B6F] whitespace-nowrap hover:border-[#3E3B6F] hover:bg-indigo-50/30 transition-all shadow-sm active:scale-95"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* INPUT BAR */}
      <div className="p-6 bg-white border-t border-gray-200 rounded-b-3xl shrink-0 shadow-inner">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
          className="relative group"
        >
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything about attendance, policies, or team metrics..." 
            className="w-full bg-gray-50 border-2 border-gray-100 rounded-3xl pl-6 pr-16 py-4 text-sm font-medium focus:ring-4 focus:ring-[#3E3B6F]/5 focus:border-[#3E3B6F] focus:bg-white outline-none transition-all"
          />
          <button 
            type="submit"
            disabled={!input.trim()}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#3E3B6F] text-white rounded-2xl flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all disabled:opacity-30 disabled:hover:scale-100"
          >
            <Send size={18} />
          </button>
        </form>
        <p className="text-center text-[10px] text-gray-400 font-medium mt-4 tracking-tighter">
          TimeSync AI may occasionally provide inaccurate reports. Always verify with the <span className="font-bold underline">Official Ledger</span>.
        </p>
      </div>
    </div>
  );
};
