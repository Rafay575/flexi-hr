import React, { useState, useRef, useEffect } from 'react';
import { 
  Cpu, 
  Send, 
  Bot, 
  User, 
  Zap, 
  ShieldCheck, 
  BarChart3, 
  Settings2, 
  CheckCircle2, 
  ArrowRight, 
  MessageSquare,
  Sparkles,
  Target,
  History,
  Info,
  Clock,
  Briefcase,
  Layers,
  ChevronRight,
  /* Added missing TrendingUp import */
  TrendingUp
} from 'lucide-react';

interface PolicyMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  type?: 'text' | 'policy_draft' | 'suggestion' | 'benchmark';
  data?: any;
}

const SUGGESTIONS = [
  "Create a factory attendance policy",
  "What grace period is standard?",
  "How to handle frequent lates?",
  "Optimize my current policy"
];

export const AIPolicyCopilot: React.FC = () => {
  const [messages, setMessages] = useState<PolicyMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm your AI Policy Copilot. I can help you design high-performance attendance policies, optimize existing ones, or benchmark against industry standards. How can I assist today?",
      type: 'text'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    const userMsg: PolicyMessage = { id: Date.now().toString(), role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulated AI Processing
    setTimeout(() => {
      let aiMsg: PolicyMessage = { id: (Date.now() + 1).toString(), role: 'assistant', content: '', type: 'text' };
      const query = text.toLowerCase();

      if (query.includes('factory')) {
        aiMsg.content = "Based on industrial standards for multi-shift factory environments, I've drafted a balanced policy focusing on strict punctuality and safety compliance:";
        aiMsg.type = 'policy_draft';
        aiMsg.data = {
          name: 'Factory Ops - Performance V1',
          thresholds: '9h Present / 5h Half Day',
          grace: '5 Minutes (Strict)',
          penalty: 'Proportional Salary Deduct',
          impact: 'Predicted 12% reduction in early exits.'
        };
      } else if (query.includes('standard') || query.includes('grace')) {
        aiMsg.content = "For IT and Service sectors, a 15-minute grace period is standard. However, I recommend a 'Cumulative Monthly Grace' model to discourage repetitive micro-tardiness.";
        aiMsg.type = 'benchmark';
        aiMsg.data = {
          industry: '92% of Tech Orgs',
          metric: '15m Daily Grace',
          recommendation: 'Enable "Quota based grace" (3 uses/month) instead of unlimited daily grace.'
        };
      } else if (query.includes('optimize') || query.includes('missing')) {
        aiMsg.content = "I noticed 24% of your current Engineering regularizations are for 'Missing Out' punches on Fridays.";
        aiMsg.type = 'suggestion';
        aiMsg.data = {
          issue: 'High Friday Regularizations',
          rootCause: 'Shift ends at 6:30 PM (Special Jummah timing)',
          fix: "Enable 'Auto-Out' at 6:30 PM for employees with an active 'In' punch on Fridays.",
          benefit: 'Reduces manual HR workload by ~40%.'
        };
      } else {
        aiMsg.content = "I'm analyzing your request. I can generate complete policy JSONs or provide data-backed suggestions. Try asking about 'factory policies' or 'industry benchmarks'.";
      }

      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] animate-in fade-in duration-500">
      {/* HEADER */}
      <div className="bg-white p-6 border-b border-gray-200 flex items-center justify-between rounded-t-3xl shadow-sm shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary-gradient rounded-2xl flex items-center justify-center text-white shadow-lg relative">
            <Cpu size={24} />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 rounded-full border-2 border-white flex items-center justify-center">
              <Sparkles size={8} className="text-white" />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800 tracking-tight">Policy Copilot</h2>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Logic Generation Engine</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="p-2 text-gray-400 hover:bg-gray-50 rounded-xl transition-all"><History size={20}/></button>
          <button className="p-2 text-gray-400 hover:bg-gray-50 rounded-xl transition-all"><Settings2 size={20}/></button>
        </div>
      </div>

      {/* CHAT VIEW */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-8 bg-gray-50/50 custom-scrollbar">
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

                {/* POLICY DRAFT CARD */}
                {msg.type === 'policy_draft' && (
                  <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-xl w-full max-w-md animate-in zoom-in-95 duration-300">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-orange-50 text-orange-600 rounded-xl"><Layers size={18} /></div>
                      <h4 className="text-sm font-black text-gray-800 uppercase tracking-widest">{msg.data.name}</h4>
                    </div>
                    <div className="space-y-3 mb-6">
                      {[
                        { label: 'Thresholds', val: msg.data.thresholds, icon: <Target size={12}/> },
                        { label: 'Grace Period', val: msg.data.grace, icon: <Clock size={12}/> },
                        { label: 'Deduction Rule', val: msg.data.penalty, icon: <ShieldCheck size={12}/> },
                      ].map(item => (
                        <div key={item.label} className="flex justify-between items-center p-3 bg-gray-50 rounded-2xl border border-gray-100">
                           <span className="text-[10px] font-black text-gray-400 uppercase flex items-center gap-2">{item.icon} {item.label}</span>
                           <span className="text-[11px] font-bold text-gray-700">{item.val}</span>
                        </div>
                      ))}
                    </div>
                    <div className="p-4 bg-green-50 border border-green-100 rounded-2xl flex gap-3 mb-6">
                       <Zap size={16} className="text-green-600 shrink-0 mt-0.5" />
                       <p className="text-[11px] text-green-700 font-medium leading-relaxed">{msg.data.impact}</p>
                    </div>
                    <button className="w-full py-3 bg-[#3E3B6F] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-[#3E3B6F]/20 hover:scale-[1.02] transition-all">
                      Apply to Policy Builder
                    </button>
                  </div>
                )}

                {/* SUGGESTION CARD */}
                {msg.type === 'suggestion' && (
                  <div className="bg-[#3E3B6F] text-white rounded-3xl p-6 shadow-xl w-full max-sm border border-white/10 animate-in zoom-in-95 duration-300">
                    <div className="flex items-center gap-3 mb-4 text-[#E8D5A3]">
                      <Sparkles size={18} />
                      <h4 className="text-[10px] font-black uppercase tracking-widest">Efficiency Suggestion</h4>
                    </div>
                    <h5 className="text-sm font-bold mb-2">{msg.data.issue}</h5>
                    <p className="text-[11px] text-white/70 mb-4 font-medium italic">Root: {msg.data.rootCause}</p>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-3 mb-6">
                      <p className="text-[11px] font-bold text-white/90 leading-relaxed">{msg.data.fix}</p>
                      <div className="flex items-center gap-2 text-green-400 font-black text-[10px] uppercase">
                        {/* Fixed: TrendingUp icon now exists via correct import */}
                        <TrendingUp size={12} /> {msg.data.benefit}
                      </div>
                    </div>
                    <button className="w-full py-3 bg-white text-[#3E3B6F] rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] transition-all">
                      Update Shift Rule
                    </button>
                  </div>
                )}

                {/* BENCHMARK CARD */}
                {msg.type === 'benchmark' && (
                  <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-xl w-full max-w-sm animate-in zoom-in-95 duration-300">
                     <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl"><BarChart3 size={18} /></div>
                        <h4 className="text-xs font-black text-gray-800 uppercase tracking-widest">Industry Benchmark</h4>
                     </div>
                     <div className="space-y-4">
                        <div className="flex justify-between">
                           <span className="text-[10px] font-bold text-gray-400 uppercase">Sector</span>
                           <span className="text-xs font-black text-[#3E3B6F]">{msg.data.industry}</span>
                        </div>
                        <div className="flex justify-between">
                           <span className="text-[10px] font-bold text-gray-400 uppercase">Standard</span>
                           <span className="text-xs font-black text-[#3E3B6F]">{msg.data.metric}</span>
                        </div>
                        <div className="pt-4 border-t border-gray-100">
                           <p className="text-[10px] font-black text-indigo-500 uppercase mb-2">Our Recommendation:</p>
                           <p className="text-[11px] text-gray-700 font-medium leading-relaxed border-l-2 border-indigo-200 pl-4">
                              {msg.data.recommendation}
                           </p>
                        </div>
                     </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-2xl bg-[#3E3B6F] flex items-center justify-center text-white shadow-md">
                <Bot size={20} />
              </div>
              <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex gap-1 items-center">
                <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce delay-100"></div>
                <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* QUICK SUGGESTIONS */}
      <div className="bg-white/50 border-t border-gray-100 p-4 shrink-0 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-3">
          <Sparkles size={14} className="text-purple-500 shrink-0" />
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest shrink-0">I can help you:</span>
          {SUGGESTIONS.map(s => (
            <button
              key={s}
              onClick={() => handleSend(s)}
              className="px-4 py-1.5 bg-white border border-gray-200 rounded-full text-xs font-bold text-[#3E3B6F] whitespace-nowrap hover:border-purple-400 hover:bg-purple-50 transition-all shadow-sm active:scale-95"
            >
              {s}
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
            placeholder="Ask Copilot to draft a policy or audit your current logic..." 
            className="w-full bg-gray-50 border-2 border-gray-100 rounded-3xl pl-6 pr-16 py-4 text-sm font-medium focus:ring-4 focus:ring-purple-500/5 focus:border-purple-400 focus:bg-white outline-none transition-all"
          />
          <button 
            type="submit"
            disabled={!input.trim()}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-purple-600 text-white rounded-2xl flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all disabled:opacity-30"
          >
            <Send size={18} />
          </button>
        </form>
        <div className="flex items-center justify-center gap-4 mt-4 opacity-50">
           <div className="flex items-center gap-1">
              <ShieldCheck size={12} className="text-green-600" />
              <span className="text-[8px] font-black uppercase text-gray-400">Compliance Verified</span>
           </div>
           <div className="flex items-center gap-1">
              <History size={12} className="text-blue-600" />
              <span className="text-[8px] font-black uppercase text-gray-400">Change Logged</span>
           </div>
        </div>
      </div>
    </div>
  );
};