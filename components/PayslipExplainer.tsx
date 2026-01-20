
import React, { useState, useMemo } from 'react';
import { 
  Bot, Sparkles, Send, Calendar, ArrowRight, 
  Info, TrendingUp, TrendingDown, HelpCircle,
  ChevronRight, X, User, MessageSquare, 
  Wallet, ShieldCheck, Zap, Calculator
} from 'lucide-react';

interface ComponentDetail {
  name: string;
  amount: number;
  explanation: string;
  type: 'EARNING' | 'DEDUCTION';
}

const MOCK_MONTHS = ['January 2025', 'December 2024', 'November 2024'];

const COMPONENT_GLOSSARY: Record<string, ComponentDetail> = {
  'Basic Salary': { name: 'Basic Salary', amount: 107500, type: 'EARNING', explanation: 'The core amount of your compensation before any allowances or deductions. This forms the base for your PF and Gratuity calculations.' },
  'House Rent (HRA)': { name: 'House Rent (HRA)', amount: 48375, type: 'EARNING', explanation: 'Tax-exempt allowance (up to 45% of basic) provided to cover housing costs as per Pakistan statutory guidelines.' },
  'Utilities': { name: 'Utilities', amount: 10750, type: 'EARNING', explanation: 'Allowance provided to cover electricity, gas, and water expenses. Fully taxable as per FBR rules.' },
  'Overtime': { name: 'Overtime', amount: 15000, type: 'EARNING', explanation: 'Payment for extra hours worked beyond standard shift, calculated at 2.0x hourly rate.' },
  'Income Tax': { name: 'Income Tax', amount: 22500, type: 'DEDUCTION', explanation: 'Withholding tax deducted at source and deposited with FBR based on your annual projected taxable income slab.' },
  'Provident Fund': { name: 'Provident Fund', amount: 8954, type: 'DEDUCTION', explanation: 'Your 8.33% contribution towards the retirement fund. The company matches this amount 1:1.' }
};

export const PayslipExplainer: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState('January 2025');
  const [selectedComp, setSelectedComp] = useState<ComponentDetail | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! I've analyzed your January payslip. Your net pay increased by PKR 6,000 this month. Would you like to know why?" }
  ]);

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setChatInput('');
    
    setTimeout(() => {
      let response = "I can help with that. Your January tax was higher because the overtime payout pushed you into a higher monthly bracket, though your annual slab remains unchanged.";
      if (text.toLowerCase().includes('overtime')) {
        response = "You were paid for 22 hours of overtime this month at a rate of PKR 682/hr.";
      }
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    }, 1000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary text-white rounded-2xl shadow-lg shadow-primary/20">
            <Sparkles size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Payslip Explainer</h2>
            <p className="text-sm text-gray-500 font-medium">Plain-English breakdown of your earnings and taxes</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <select 
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="pl-10 pr-8 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-primary/10 appearance-none min-w-[200px] shadow-sm"
            >
              {MOCK_MONTHS.map(m => <option key={m}>{m}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Quick Explanation & Breakdown */}
        <div className="lg:col-span-7 space-y-8">
          {/* Quick Summary Card */}
          <div className="bg-gradient-to-br from-indigo-900 to-primary p-8 rounded-3xl text-white shadow-xl relative overflow-hidden group">
            <div className="relative z-10 space-y-6">
              <div className="flex justify-between items-start">
                <p className="text-[10px] font-black text-accent uppercase tracking-[2px]">Net Change Summary</p>
                <span className="bg-green-500 text-white text-[10px] font-black px-2 py-1 rounded-lg flex items-center gap-1 shadow-lg">
                  <TrendingUp size={12} /> +PKR 6,000
                </span>
              </div>
              <h3 className="text-xl font-bold leading-relaxed max-w-md">
                Your take-home increased this month primarily due to <span className="text-accent underline underline-offset-4">higher Overtime hours</span>.
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 p-4 rounded-2xl border border-white/5">
                  <p className="text-[9px] font-bold text-white/50 uppercase">OT Earned</p>
                  <p className="text-lg font-black text-white">+PKR 7,500</p>
                </div>
                <div className="bg-white/10 p-4 rounded-2xl border border-white/5">
                  <p className="text-[9px] font-bold text-white/50 uppercase">Tax Increase</p>
                  <p className="text-lg font-black text-red-300">-PKR 1,500</p>
                </div>
              </div>
            </div>
            <div className="absolute right-[-20px] top-[-20px] text-white/5 w-64 h-64 rotate-12 group-hover:scale-110 transition-transform duration-700" />
          </div>

          {/* Clickable Components */}
          <div className="space-y-4">
            <h3 className="text-sm font-black uppercase tracking-[2px] text-gray-400 flex items-center gap-2">
              <Calculator size={16} /> Interactive Breakdown
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {Object.values(COMPONENT_GLOSSARY).map((comp, i) => (
                 <button 
                  key={i}
                  onClick={() => setSelectedComp(comp)}
                  className={`p-5 rounded-2xl border-2 text-left transition-all group ${
                    selectedComp?.name === comp.name ? 'border-primary bg-primary/5 shadow-md' : 'bg-white border-gray-100 hover:border-gray-200'
                  }`}
                 >
                    <div className="flex justify-between items-start mb-2">
                       <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                         comp.type === 'EARNING' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                       }`}>{comp.type}</span>
                       <HelpCircle size={14} className="text-gray-300 group-hover:text-primary transition-colors" />
                    </div>
                    <p className="text-sm font-bold text-gray-800">{comp.name}</p>
                    <p className={`text-lg font-black font-mono mt-1 ${comp.type === 'EARNING' ? 'text-gray-700' : 'text-red-500'}`}>
                       {comp.type === 'DEDUCTION' ? '-' : ''}{comp.amount.toLocaleString()}
                    </p>
                 </button>
               ))}
            </div>
          </div>
        </div>

        {/* Right Column: AI Assistant & Detail */}
        <div className="lg:col-span-5 space-y-6">
          {/* Component Explanation Drawer/Panel */}
          <div className={`bg-white rounded-3xl shadow-md border-2 transition-all p-8 ${selectedComp ? 'border-primary' : 'border-gray-50 opacity-50'}`}>
            {selectedComp ? (
              <div className="space-y-4 animate-in slide-in-from-right-2">
                 <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${selectedComp.type === 'EARNING' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                       {selectedComp.type === 'EARNING' ? <Wallet size={20}/> : <ShieldCheck size={20}/>}
                    </div>
                    <h4 className="text-lg font-black text-gray-800">{selectedComp.name}</h4>
                 </div>
                 <p className="text-sm text-gray-600 leading-relaxed font-medium">
                    {selectedComp.explanation}
                 </p>
                 <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-[10px] font-black text-gray-400 uppercase">Calculated by: Rule G18-2025</span>
                    <button className="text-[10px] font-black text-primary uppercase hover:underline">View Formula</button>
                 </div>
              </div>
            ) : (
              <div className="text-center py-10 space-y-3">
                 <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
                    <Info size={32} />
                 </div>
                 <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Click a component to see its meaning</p>
              </div>
            )}
          </div>

          {/* AI Chat Bot */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 flex flex-col h-[400px] overflow-hidden">
            <div className="p-4 border-b bg-primary text-white flex items-center gap-3">
               <Bot size={20} className="text-accent" />
               <div>
                  <p className="text-xs font-black uppercase tracking-widest leading-none">AI Assistant</p>
                  <p className="text-[8px] font-bold text-white/60 mt-1 uppercase">Jan 2025 Context Loaded</p>
               </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-gray-50/30">
               {messages.map((msg, i) => (
                 <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${msg.role === 'assistant' ? 'bg-primary text-white' : 'bg-white border border-gray-200 text-gray-400'}`}>
                       {msg.role === 'assistant' ? <Bot size={14}/> : <User size={14}/>}
                    </div>
                    <div className={`p-4 rounded-2xl text-xs font-medium leading-relaxed max-w-[85%] ${
                      msg.role === 'assistant' ? 'bg-white border border-gray-100 text-gray-700 rounded-tl-none shadow-sm' : 'bg-primary text-white rounded-tr-none shadow-md'
                    }`}>
                       {msg.content}
                    </div>
                 </div>
               ))}
            </div>

            <div className="p-4 bg-white border-t border-gray-100">
               <div className="flex flex-wrap gap-2 mb-3">
                  {['Why is my tax high?', 'Explain OT', 'YTD Summary'].map(s => (
                    <button 
                      key={s}
                      onClick={() => handleSendMessage(s)}
                      className="px-3 py-1 bg-gray-100 hover:bg-primary hover:text-white rounded-full text-[10px] font-bold text-gray-500 transition-all border border-gray-200"
                    >
                      {s}
                    </button>
                  ))}
               </div>
               <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Ask a question about your pay..." 
                    className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-primary/10 outline-none transition-all"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(chatInput)}
                  />
                  <button 
                    onClick={() => handleSendMessage(chatInput)}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 p-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all"
                  >
                    <Send size={14} />
                  </button>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Compliance Disclaimer */}
      <div className="p-5 bg-blue-50 border border-blue-100 rounded-3xl flex items-start gap-4 shadow-sm max-w-4xl mx-auto">
         <div className="p-2 bg-white rounded-xl text-blue-500 shadow-sm border border-blue-50">
            <ShieldCheck size={24} />
         </div>
         <div className="space-y-1">
            <h5 className="text-sm font-black text-blue-900 uppercase tracking-tight leading-none">FBR Compliance Disclaimer</h5>
            <p className="text-xs text-blue-700 leading-relaxed font-medium">
              The explanations provided by the AI Assistant are for informational purposes based on current FBR Income Tax Ordinance 2001 rules. For official tax advisory, please consult with your certified accountant or the company treasury department.
            </p>
         </div>
      </div>
    </div>
  );
};
