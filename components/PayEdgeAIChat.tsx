
import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, Send, Sparkles, TrendingUp, AlertTriangle, 
  Search, Users, Calculator, PieChart, 
  ArrowRight, X, User, MessageSquare, 
  ChevronRight, Database, ShieldCheck, 
  RefreshCw, Terminal, Bookmark,
  // Added missing icon imports
  Settings, AlertCircle
} from 'lucide-react';

interface Message {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  type?: 'text' | 'analysis' | 'alert' | 'table';
  data?: any;
}

const SUGGESTIONS = [
  "Why is January payroll higher than December?",
  "Find employees with >20% salary changes",
  "What is the total tax liability for Engineering?",
  "Compare last 3 months payroll trends",
  "Identify anomalies in bank details"
];

export const PayEdgeAIChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: '1', 
      role: 'assistant', 
      content: 'Hello! I am your PayEdge Intelligence Assistant. I have indexed the Jan 2025 payroll cycle. How can I help you analyze the data today?',
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

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Mock AI responses based on keywords
    setTimeout(() => {
      let response: Message;
      const lowerText = text.toLowerCase();

      if (lowerText.includes('higher') || lowerText.includes('increase')) {
        response = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'The 3.1% increase in January payroll (PKR 1.2M) is primarily driven by three factors:',
          type: 'analysis',
          data: {
            breakdown: [
              { label: 'New Joiners (13)', impact: '+625,000', perc: 52 },
              { label: 'Annual Increments', impact: '+450,000', perc: 37 },
              { label: 'Karachi OT Spike', impact: '+125,000', perc: 11 }
            ]
          }
        };
      } else if (lowerText.includes('anomaly') || lowerText.includes('issue')) {
        response = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'I have detected 3 critical anomalies in the current run that require your immediate attention:',
          type: 'alert',
          data: {
            issues: [
              { severity: 'CRITICAL', title: 'Invalid IBAN', detail: 'EMP-1102 IBAN checksum failed SCB verification.' },
              { severity: 'CRITICAL', title: 'Negative Payout', detail: 'EMP-1089 deductions exceed gross by PKR 5,400.' },
              { severity: 'WARNING', title: 'Missing NTN', detail: 'EMP-1256 is missing NTN for Annex-C filing.' }
            ]
          }
        };
      } else if (lowerText.includes('tax') || lowerText.includes('liability')) {
        response = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'The projected tax liability for Jan 2025 across departments is as follows:',
          type: 'table',
          data: {
            headers: ['Dept', 'Taxable Gross', 'WHT Amount'],
            rows: [
              ['Engineering', '18.5M', '1.85M'],
              ['Operations', '12.2M', '0.95M'],
              ['Human Resources', '2.8M', '0.22M']
            ]
          }
        };
      } else {
        response = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: "I've analyzed the request. Based on the Jan 2025 records, the data aligns with the G18 grade structure and FBR 2024-25 tax slabs. Would you like a detailed breakdown of specific cost centers?",
          type: 'text'
        };
      }
      
      setMessages(prev => [...prev, response]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-160px)] animate-in fade-in duration-500">
      {/* Header */}
      <div className="bg-white p-6 rounded-t-3xl border border-gray-100 shadow-sm flex items-center justify-between relative z-10">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-100">
            <Bot size={24} />
          </div>
          <div>
            <h2 className="text-xl font-black text-gray-800 tracking-tight flex items-center gap-2">
              PayEdge AI Assistant
              <span className="bg-indigo-100 text-indigo-600 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest">Enterprise PRO</span>
            </h2>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-tighter flex items-center gap-1.5">
               <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
               NLP Engine v4.2 Active • Jan 2025 Context Loaded
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <button className="p-2 text-gray-400 hover:text-primary transition-all"><RefreshCw size={20}/></button>
           <button className="p-2 text-gray-400 hover:text-primary transition-all"><Settings size={20}/></button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden bg-white border-x border-gray-100">
        {/* Sidebar: Suggested/Recent */}
        <aside className="w-80 border-r border-gray-50 bg-gray-50/30 p-6 hidden xl:block">
           <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[2px] mb-6">Suggested Queries</h3>
           <div className="space-y-3">
              {SUGGESTIONS.map((s, i) => (
                <button 
                  key={i}
                  onClick={() => handleSend(s)}
                  className="w-full text-left p-4 bg-white border border-gray-100 rounded-2xl text-xs font-bold text-gray-600 hover:border-primary hover:text-primary hover:shadow-md transition-all group"
                >
                   {s}
                   <ChevronRight size={14} className="float-right opacity-0 group-hover:opacity-100 transition-all" />
                </button>
              ))}
           </div>
           <div className="mt-12 space-y-4">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[2px]">Pinned Analysis</h3>
              <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
                 <div className="flex items-center gap-2 text-primary font-black text-[10px] mb-1">
                    <Bookmark size={12} fill="currentColor" /> Tax Projection Q1
                 </div>
                 <p className="text-[11px] text-primary/70 leading-relaxed font-medium">Auto-updated following the Dec 31st closure.</p>
              </div>
           </div>
        </aside>

        {/* Chat Interface */}
        <main className="flex-1 flex flex-col relative bg-white">
           <div 
             ref={scrollRef}
             className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar scroll-smooth"
           >
              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''} animate-in slide-in-from-bottom-2 duration-300`}>
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border ${
                    msg.role === 'assistant' ? 'bg-primary text-white border-primary' : 'bg-gray-100 text-gray-400 border-gray-200'
                  }`}>
                    {msg.role === 'assistant' ? <Bot size={20} /> : <User size={20} />}
                  </div>
                  
                  <div className={`max-w-[85%] space-y-4 ${msg.role === 'user' ? 'text-right' : ''}`}>
                    <div className={`p-5 rounded-3xl inline-block text-sm font-medium leading-relaxed shadow-sm border ${
                      msg.role === 'assistant' 
                      ? 'bg-gray-50 border-gray-100 text-gray-800 rounded-tl-none' 
                      : 'bg-primary text-white border-primary rounded-tr-none'
                    }`}>
                      {msg.content}
                    </div>

                    {/* Rich Response Types */}
                    {msg.type === 'analysis' && (
                      <div className="grid grid-cols-1 gap-3 animate-in fade-in duration-700 delay-300">
                        {msg.data.breakdown.map((item: any, i: number) => (
                          <div key={i} className="bg-white border border-gray-100 p-4 rounded-2xl flex items-center justify-between shadow-sm">
                             <div className="flex items-center gap-3">
                                <div className="w-1.5 h-8 bg-primary rounded-full"></div>
                                <div>
                                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.label}</p>
                                   <p className="text-sm font-black text-gray-800">{item.impact}</p>
                                </div>
                             </div>
                             <div className="text-right">
                                <p className="text-xs font-black text-primary">{item.perc}%</p>
                                <div className="w-20 h-1 bg-gray-100 rounded-full mt-1">
                                   <div className="h-full bg-primary rounded-full" style={{ width: `${item.perc}%` }}></div>
                                </div>
                             </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {msg.type === 'alert' && (
                      <div className="space-y-2 animate-in fade-in duration-700 delay-300">
                        {msg.data.issues.map((issue: any, i: number) => (
                          <div key={i} className={`p-4 rounded-2xl border-l-4 flex items-start gap-4 ${
                            issue.severity === 'CRITICAL' ? 'bg-red-50 border-red-500' : 'bg-orange-50 border-orange-500'
                          }`}>
                             {issue.severity === 'CRITICAL' ? <AlertTriangle className="text-red-500 shrink-0" size={18} /> : <AlertCircle className="text-orange-500 shrink-0" size={18} />}
                             <div>
                                <p className="text-[10px] font-black uppercase tracking-widest leading-none mb-1 text-gray-400">{issue.title}</p>
                                <p className="text-xs font-bold text-gray-700">{issue.detail}</p>
                             </div>
                             <button className="ml-auto p-1 hover:bg-black/5 rounded text-gray-400 transition-all"><ChevronRight size={16}/></button>
                          </div>
                        ))}
                      </div>
                    )}

                    {msg.type === 'table' && (
                      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm animate-in fade-in duration-700 delay-300">
                         <table className="w-full text-left text-xs">
                            <thead>
                               <tr className="bg-gray-50 border-b">
                                  {msg.data.headers.map((h: string) => (
                                    <th key={h} className="px-4 py-3 font-black text-[9px] text-gray-400 uppercase tracking-widest">{h}</th>
                                  ))}
                               </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                               {msg.data.rows.map((row: any[], i: number) => (
                                 <tr key={i} className="hover:bg-gray-50/50">
                                    {row.map((cell, j) => (
                                      <td key={j} className={`px-4 py-3 font-bold ${j === 0 ? 'text-gray-800' : 'font-mono text-primary'}`}>{cell}</td>
                                    ))}
                                 </tr>
                               ))}
                            </tbody>
                         </table>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex gap-4 animate-pulse">
                  <div className="w-10 h-10 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-300">
                    <Bot size={20} />
                  </div>
                  <div className="bg-gray-50 p-4 rounded-2xl rounded-tl-none border border-gray-100 flex gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-300 animate-bounce"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-300 animate-bounce delay-75"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-300 animate-bounce delay-150"></div>
                  </div>
                </div>
              )}
           </div>

           {/* Input Bar */}
           <div className="p-6 bg-white border-t border-gray-100 sticky bottom-0">
              <div className="max-w-4xl mx-auto relative group">
                 <input 
                   type="text" 
                   value={input}
                   onChange={(e) => setInput(e.target.value)}
                   onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
                   placeholder="Ask me anything about Jan 2025 payroll..."
                   className="w-full pl-12 pr-14 py-4 bg-gray-50 border border-gray-200 rounded-3xl text-sm font-medium outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary focus:bg-white transition-all shadow-inner"
                 />
                 <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 text-primary opacity-40 group-focus-within:opacity-100 transition-opacity" size={20} />
                 <button 
                   onClick={() => handleSend(input)}
                   disabled={!input.trim()}
                   className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2.5 bg-primary text-white rounded-2xl hover:bg-primary/90 disabled:opacity-30 disabled:grayscale transition-all shadow-lg shadow-primary/20 active:scale-90"
                 >
                    <Send size={18} />
                 </button>
              </div>
              <p className="text-center text-[9px] font-black text-gray-300 uppercase tracking-[2px] mt-4">
                 PayEdge AI may verify calculations using the FBR Ordinance 2001 knowledge base.
              </p>
           </div>
        </main>
      </div>

      {/* Footer / Status */}
      <div className="bg-gray-50 p-4 rounded-b-3xl border border-gray-100 flex items-center justify-between text-[10px] font-black uppercase text-gray-400 tracking-widest">
         <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5"><Terminal size={14}/> Query Latency: 450ms</div>
            <div className="flex items-center gap-1.5"><Database size={14}/> 4.2M Records Indexed</div>
         </div>
         <div className="flex items-center gap-1.5 text-primary">
            <ShieldCheck size={14}/> SOC-2 Compliance Verified
         </div>
      </div>
    </div>
  );
};

const formatFullPKR = (val: number) => `PKR ${val.toLocaleString()}`;
