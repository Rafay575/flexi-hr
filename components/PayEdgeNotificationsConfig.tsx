
import React, { useState } from 'react';
import { 
  Bell, Mail, Smartphone, MessageSquare, Save, Eye, 
  ChevronRight, Info, Calculator, User, ShieldAlert,
  Search, Filter, Check, Terminal, Layout, Send,
  Globe, Clock, AlertTriangle, CheckCircle2,
  /* Added missing icon import */
  RefreshCw
} from 'lucide-react';

type Channel = 'inApp' | 'email' | 'push' | 'sms';
type EventCategory = 'PAYROLL' | 'EMPLOYEE' | 'ADMIN';

interface NotificationEvent {
  id: string;
  name: string;
  category: EventCategory;
  inApp: boolean;
  email: boolean;
  push: boolean;
  sms: boolean;
  templateSubject: string;
  templateBody: string;
}

const INITIAL_EVENTS: NotificationEvent[] = [
  // PAYROLL
  { id: 'pay_01', name: 'Run Created', category: 'PAYROLL', inApp: true, email: false, push: false, sms: false, templateSubject: 'Payroll Run Initiated: {{run_id}}', templateBody: 'A new payroll run for {{period}} has been created by {{user}}.' },
  { id: 'pay_02', name: 'Critical Exceptions', category: 'PAYROLL', inApp: true, email: true, push: true, sms: false, templateSubject: 'Action Required: Exceptions in {{run_id}}', templateBody: 'High severity exceptions detected in the current run. Please resolve before proceeding.' },
  { id: 'pay_03', name: 'Run Submitted', category: 'PAYROLL', inApp: true, email: true, push: false, sms: false, templateSubject: 'Payroll Submitted for Approval: {{run_id}}', templateBody: 'Run {{run_id}} for {{period}} has been submitted by {{user}} and is awaiting your review.' },
  { id: 'pay_04', name: 'Run Approved', category: 'PAYROLL', inApp: true, email: true, push: true, sms: false, templateSubject: 'Payroll Approved: {{run_id}}', templateBody: 'The payroll run for {{period}} has been approved by {{approver}}.' },
  { id: 'pay_05', name: 'Run Published', category: 'PAYROLL', inApp: true, email: true, push: true, sms: true, templateSubject: 'Payroll Cycle Finalized: {{period}}', templateBody: 'Payroll processing is complete and payslips are now available.' },
  
  // EMPLOYEE
  { id: 'emp_01', name: 'Payslip Available', category: 'EMPLOYEE', inApp: true, email: true, push: true, sms: false, templateSubject: 'Your Payslip for {{month}} {{year}} is Ready', templateBody: 'Hello {{emp_name}}, your digital payslip is now available on the ESS portal.' },
  { id: 'emp_02', name: 'Salary Credited', category: 'EMPLOYEE', inApp: true, email: false, push: true, sms: true, templateSubject: 'Salary Credited', templateBody: 'Dear {{emp_name}}, your salary for {{period}} has been transferred to your bank account.' },
  { id: 'emp_03', name: 'Tax Certificate', category: 'EMPLOYEE', inApp: true, email: true, push: false, sms: false, templateSubject: 'Annual Tax Certificate {{fy}}', templateBody: 'Your tax withholding certificate for the assessment year {{fy}} is now available for download.' },
  { id: 'emp_04', name: 'Loan EMI Recovery', category: 'EMPLOYEE', inApp: true, email: false, push: true, sms: false, templateSubject: 'Loan Installment Recovered', templateBody: 'EMI of PKR {{amount}} has been recovered from your salary for Loan ID {{loan_id}}.' },

  // ADMIN
  { id: 'adm_01', name: 'Period Lock', category: 'ADMIN', inApp: true, email: true, push: false, sms: false, templateSubject: 'Payroll Period Locked: {{period}}', templateBody: 'Governance alert: The payroll period {{period}} has been successfully locked.' },
  { id: 'adm_02', name: 'Statutory Due', category: 'ADMIN', inApp: true, email: true, push: true, sms: false, templateSubject: 'Deadline Alert: {{statutory_type}} Filing', templateBody: 'The filing deadline for {{statutory_type}} for {{period}} is in {{days}} days.' },
  { id: 'adm_03', name: 'Unlock Requested', category: 'ADMIN', inApp: true, email: true, push: true, sms: false, templateSubject: 'Period Unlock Request: {{period}}', templateBody: '{{user}} has requested to unlock period {{period}}. Justification: {{reason}}' },
];

export const PayEdgeNotificationsConfig: React.FC = () => {
  const [events, setEvents] = useState<NotificationEvent[]>(INITIAL_EVENTS);
  const [selectedEvent, setSelectedEvent] = useState<NotificationEvent | null>(INITIAL_EVENTS[0]);
  const [isSaving, setIsSaving] = useState(false);

  const handleToggle = (id: string, channel: Channel) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, [channel]: !e[channel] } : e));
    if (selectedEvent?.id === id) {
      setSelectedEvent(prev => prev ? { ...prev, [channel]: !prev[channel] } : null);
    }
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1000);
  };

  const getCategoryIcon = (cat: EventCategory) => {
    switch (cat) {
      case 'PAYROLL': return <Calculator size={14} />;
      case 'EMPLOYEE': return <User size={14} />;
      case 'ADMIN': return <ShieldAlert size={14} />;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary text-white rounded-2xl shadow-xl shadow-primary/20">
            <Bell size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 tracking-tight flex items-center gap-2">
              Communication Settings
              <span className="bg-primary/10 text-primary text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest border border-primary/20">Channels</span>
            </h2>
            <p className="text-sm text-gray-500 font-medium">Configure multi-channel alerts and automated payroll notifications</p>
          </div>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="bg-primary text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-primary/90 shadow-xl shadow-primary/20 transition-all active:scale-95 disabled:opacity-50"
        >
          {isSaving ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} />}
          Save Configuration
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Event Matrix */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden">
            <div className="p-6 border-b bg-gray-50/50 flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    <input type="text" placeholder="Search events..." className="pl-9 pr-4 py-1.5 bg-white border border-gray-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-primary w-48" />
                 </div>
                 <button className="p-2 text-gray-400 hover:text-primary transition-all"><Filter size={18}/></button>
              </div>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Notification Matrix</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b text-[9px] font-black text-gray-400 uppercase tracking-widest">
                    <th className="px-8 py-5">Event Detail</th>
                    <th className="px-4 py-5 text-center">In-App</th>
                    <th className="px-4 py-5 text-center">Email</th>
                    <th className="px-4 py-5 text-center">Push</th>
                    <th className="px-4 py-5 text-center">SMS</th>
                    <th className="px-8 py-5 text-right">Template</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {(['PAYROLL', 'EMPLOYEE', 'ADMIN'] as EventCategory[]).map(cat => (
                    <React.Fragment key={cat}>
                       <tr className="bg-gray-50/80">
                          <td colSpan={6} className="px-8 py-2 text-[10px] font-black text-primary/60 uppercase tracking-widest border-y border-gray-100">
                             <div className="flex items-center gap-2">{getCategoryIcon(cat)} {cat} EVENTS</div>
                          </td>
                       </tr>
                       {events.filter(e => e.category === cat).map(event => (
                         <tr key={event.id} className={`hover:bg-gray-50 transition-colors group ${selectedEvent?.id === event.id ? 'bg-primary/5' : ''}`}>
                            <td className="px-8 py-4">
                               <p className="font-bold text-gray-700 leading-none mb-1">{event.name}</p>
                               <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tight">{event.id}</p>
                            </td>
                            <td className="px-4 py-4"><ChannelToggle active={event.inApp} icon={Globe} color="text-indigo-600" onClick={() => handleToggle(event.id, 'inApp')} /></td>
                            <td className="px-4 py-4"><ChannelToggle active={event.email} icon={Mail} color="text-blue-500" onClick={() => handleToggle(event.id, 'email')} /></td>
                            <td className="px-4 py-4"><ChannelToggle active={event.push} icon={Smartphone} color="text-purple-600" onClick={() => handleToggle(event.id, 'push')} /></td>
                            <td className="px-4 py-4"><ChannelToggle active={event.sms} icon={MessageSquare} color="text-green-600" onClick={() => handleToggle(event.id, 'sms')} /></td>
                            <td className="px-8 py-4 text-right">
                               <button 
                                onClick={() => setSelectedEvent(event)}
                                className={`p-2 rounded-lg transition-all ${selectedEvent?.id === event.id ? 'bg-primary text-white' : 'text-gray-300 hover:text-primary hover:bg-white border border-transparent hover:border-gray-200'}`}
                               >
                                  <ChevronRight size={18} />
                               </button>
                            </td>
                         </tr>
                       ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right: Template Editor */}
        <div className="lg:col-span-4 space-y-6">
           {selectedEvent ? (
             <div className="bg-white rounded-3xl shadow-xl border-2 border-primary/20 overflow-hidden animate-in slide-in-from-right-4 duration-500 flex flex-col min-h-[600px]">
                <div className="p-6 border-b bg-primary text-white flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/10 rounded-xl"><Layout size={20}/></div>
                      <div>
                        <h4 className="font-black uppercase text-sm tracking-tight">Template Editor</h4>
                        <p className="text-[10px] text-accent font-black tracking-widest uppercase">{selectedEvent.name}</p>
                      </div>
                   </div>
                   <button className="p-2 hover:bg-white/10 rounded-lg transition-all"><Settings2 size={18}/></button>
                </div>

                <div className="flex-1 p-8 space-y-6">
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Notification Subject</label>
                      <input 
                        type="text" 
                        value={selectedEvent.templateSubject}
                        onChange={(e) => setEvents(prev => prev.map(ev => ev.id === selectedEvent.id ? {...ev, templateSubject: e.target.value} : ev))}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 focus:ring-2 focus:ring-primary/10 outline-none" 
                      />
                   </div>

                   <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Template Body (Markdown)</label>
                      <textarea 
                        rows={8}
                        value={selectedEvent.templateBody}
                        onChange={(e) => setEvents(prev => prev.map(ev => ev.id === selectedEvent.id ? {...ev, templateBody: e.target.value} : ev))}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 leading-relaxed outline-none focus:ring-2 focus:ring-primary/10 resize-none h-48"
                      />
                   </div>

                   <div className="space-y-3">
                      <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <Terminal size={14} /> Available Data Tokens
                      </h5>
                      <div className="flex flex-wrap gap-2">
                         {['emp_name', 'run_id', 'period', 'amount', 'approver', 'lwd'].map(token => (
                           <button 
                            key={token}
                            onClick={() => {
                              const textarea = document.querySelector('textarea');
                              if (textarea) {
                                const start = textarea.selectionStart;
                                const text = selectedEvent.templateBody;
                                const updated = text.slice(0, start) + `{{${token}}}` + text.slice(textarea.selectionEnd);
                                setEvents(prev => prev.map(ev => ev.id === selectedEvent.id ? {...ev, templateBody: updated} : ev));
                              }
                            }}
                            className="px-2 py-1 bg-gray-100 hover:bg-primary hover:text-white rounded border border-gray-200 text-[9px] font-mono font-bold transition-all"
                           >
                             {token}
                           </button>
                         ))}
                      </div>
                   </div>
                </div>

                <div className="p-6 bg-gray-50 border-t flex gap-3">
                   <button className="flex-1 py-3 bg-white border border-gray-200 text-gray-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 flex items-center justify-center gap-2 transition-all">
                      <Eye size={16} /> Preview
                   </button>
                   <button className="flex-1 py-3 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:bg-primary/90 flex items-center justify-center gap-2 transition-all active:scale-95">
                      <Send size={16} /> Test Sent
                   </button>
                </div>
             </div>
           ) : (
             <div className="h-full min-h-[500px] rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center p-12">
                <Bell size={48} className="text-gray-300 mb-4 opacity-20" />
                <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Select an event from the matrix to edit templates</p>
             </div>
           )}

           <div className="p-5 bg-blue-50 border border-blue-100 rounded-3xl flex items-start gap-4 shadow-sm">
              <Info size={24} className="text-blue-500 mt-0.5 shrink-0" />
              <div className="space-y-1">
                 <h5 className="text-xs font-black text-blue-900 uppercase tracking-tight">Channel Routing Rule</h5>
                 <p className="text-[10px] text-blue-700 leading-relaxed font-medium uppercase">
                    SMS alerts are only routed if the event is marked <span className="font-black">Critical</span> or specifically enabled for mobile wallet disbursements.
                 </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const ChannelToggle = ({ active, icon: Icon, color, onClick }: { active: boolean, icon: any, color: string, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`mx-auto w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
      active ? `${color} bg-white border-2 border-current shadow-sm` : 'bg-gray-50 text-gray-300 border border-gray-100'
    }`}
  >
    <Icon size={18} />
    {active && <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />}
  </button>
);

const Settings2 = ({ size, className }: { size?: number, className?: string }) => (
  <svg 
    width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" 
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
    className={className}
  >
    <path d="M20 7h-9" /><path d="M14 17H5" /><circle cx="17" cy="17" r="3" /><circle cx="7" cy="7" r="3" />
  </svg>
);
