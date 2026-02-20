import React, { useState } from 'react';
import { 
  Bell, Mail, MessageSquare, Smartphone, Zap, Search, 
  ChevronRight, Save, RotateCcw, Send, Info, Eye,
  Layout, List, Database, CheckSquare, Plane, Gift,
  Settings, Type, Bold, Italic, Link, Code,
  // Renamed History to HistoryIcon to avoid collision with global History type
  History as HistoryIcon
} from 'lucide-react';

interface TemplateEvent {
  id: string;
  label: string;
  description: string;
  defaultRecipients: string;
  status: 'configured' | 'default';
}

interface Category {
  id: string;
  label: string;
  icon: any;
  events: TemplateEvent[];
}

// Fixed: Moved Calendar declaration here to prevent "used before declaration" error
const Calendar = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

const CATEGORIES: Category[] = [
  {
    id: 'requests', label: 'Leave Requests', icon: Calendar,
    events: [
      { id: 'leave.submitted', label: 'Request Submitted', description: 'Triggered when a new leave application is created.', defaultRecipients: 'Manager', status: 'configured' },
      { id: 'leave.approved', label: 'Request Approved', description: 'Sent when leave request is approved.', defaultRecipients: 'Requester', status: 'configured' },
      { id: 'leave.rejected', label: 'Request Rejected', description: 'Sent when leave request is denied.', defaultRecipients: 'Requester', status: 'default' },
      { id: 'leave.cancelled', label: 'Request Cancelled', description: 'Triggered upon cancellation by requester or admin.', defaultRecipients: 'Approver, HR', status: 'default' },
    ]
  },
  {
    id: 'balances', label: 'Balances', icon: Database,
    events: [
      { id: 'balance.low', label: 'Low Balance Warning', description: 'Triggered when balance falls below threshold.', defaultRecipients: 'Employee', status: 'default' },
      { id: 'balance.expiry', label: 'Balance Expiry Alert', description: 'Sent before carry-forward days expire.', defaultRecipients: 'Employee', status: 'configured' },
    ]
  },
  {
    id: 'approvals', label: 'Approvals', icon: CheckSquare,
    events: [
      { id: 'approval.reminder', label: 'SLA Reminder', description: 'Sent to approver when request is near SLA breach.', defaultRecipients: 'Approver', status: 'configured' },
      { id: 'approval.escalation', label: 'SLA Escalation', description: 'Sent when request breaches SLA time.', defaultRecipients: 'Manager of Approver, HR', status: 'default' },
    ]
  },
  {
    id: 'compoff', label: 'Comp-Off', icon: Zap,
    events: [
      { id: 'co.credited', label: 'Credit Awarded', description: 'Sent when extra work is verified as credit.', defaultRecipients: 'Employee', status: 'configured' },
    ]
  }
];

const VARIABLES = [
  '{{employee_name}}', '{{leave_type}}', '{{start_date}}', '{{end_date}}', 
  '{{duration}}', '{{balance}}', '{{approver_name}}', '{{request_id}}'
];

export const LeaveNotificationTemplates = () => {
  const [selectedEventId, setSelectedEventId] = useState('leave.approved');
  const [activeChannel, setActiveChannel] = useState<'Email' | 'In-App' | 'Push'>('Email');
  const [channels, setChannels] = useState({
    'In-App': true,
    'Push': true,
    'Email': true,
    'SMS': false
  });
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const selectedEvent = CATEGORIES.flatMap(c => c.events).find(e => e.id === selectedEventId);

  return (
    <div className="flex h-full bg-[#F5F5F5] font-['League_Spartan'] overflow-hidden">
      {/* Sidebar - Events List */}
      <aside className="w-80 bg-white border-r border-gray-200 flex flex-col shrink-0">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-[#3E3B6F]">Event Library</h2>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            <input 
              type="text" 
              placeholder="Search events..." 
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-transparent rounded-xl text-xs outline-none focus:bg-white focus:border-indigo-200 transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scroll">
          {CATEGORIES.map(cat => (
            <div key={cat.id} className="space-y-2">
              <div className="flex items-center gap-2 px-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                <cat.icon size={12} /> {cat.label} ({cat.events.length})
              </div>
              <div className="space-y-1">
                {cat.events.map(event => (
                  <button
                    key={event.id}
                    onClick={() => setSelectedEventId(event.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl transition-all group relative flex items-center justify-between ${
                      selectedEventId === event.id ? 'bg-indigo-50 text-[#3E3B6F]' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${event.status === 'configured' ? 'bg-emerald-500' : 'bg-gray-200'}`} title={event.status} />
                      <span className="text-xs font-bold">{event.label}</span>
                    </div>
                    <ChevronRight size={14} className={`text-gray-300 group-hover:translate-x-0.5 transition-transform ${selectedEventId === event.id ? 'opacity-100' : 'opacity-0'}`} />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Editor Panel */}
      <main className="flex-1 overflow-y-auto flex flex-col relative bg-[#F9FAFB]">
        {selectedEvent ? (
          <>
            {/* Header Info */}
            <header className="bg-white px-10 py-8 border-b border-gray-100 flex items-center justify-between sticky top-0 z-10 shadow-sm">
              <div className="flex items-center gap-6">
                <div className="p-4 bg-indigo-50 text-[#3E3B6F] rounded-[24px]">
                  <Bell size={32} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{selectedEvent.label}</h1>
                  <p className="text-sm text-gray-400 font-medium italic mt-1">ID: {selectedEvent.id} • {selectedEvent.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                 <button 
                  onClick={() => setIsPreviewMode(!isPreviewMode)}
                  className={`px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${isPreviewMode ? 'bg-[#3E3B6F] text-white shadow-lg' : 'bg-white border border-gray-200 text-gray-600'}`}
                 >
                   <Eye size={18} /> {isPreviewMode ? 'Edit Mode' : 'Preview Result'}
                 </button>
                 <button className="p-2.5 bg-gray-50 text-gray-400 hover:text-indigo-600 rounded-xl transition-all border border-transparent hover:border-gray-100">
                    <Settings size={20}/>
                 </button>
              </div>
            </header>

            <div className="p-10 flex gap-8 flex-1">
              <div className="flex-1 space-y-8">
                {/* Channel Selector */}
                <section className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-sm">
                  <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-6">Delivery Channels</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(channels).map(([name, enabled]) => (
                      <button 
                        key={name}
                        onClick={() => setActiveChannel(name as any)}
                        className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all text-left ${
                          activeChannel === name ? 'border-[#3E3B6F] bg-indigo-50/30' : 'border-gray-50 hover:border-gray-100'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-all ${enabled ? 'bg-[#3E3B6F] border-[#3E3B6F]' : 'border-gray-300'}`}>
                           {enabled && <CheckSquare className="text-[#E8D5A3]" size={14} />}
                        </div>
                        <div className="flex items-center gap-3">
                           {name === 'Email' ? <Mail size={18}/> : name === 'Push' ? <Smartphone size={18}/> : name === 'In-App' ? <Zap size={18}/> : <MessageSquare size={18}/>}
                           <span className="text-sm font-bold text-gray-700">{name}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </section>

                {/* Editor Surface */}
                <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
                  <div className="p-8 border-b border-gray-100 bg-gray-50/30 flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <div className="px-3 py-1 bg-[#3E3B6F] text-white text-[10px] font-bold uppercase rounded-lg tracking-widest">{activeChannel} Template</div>
                        <p className="text-xs text-gray-400 italic">Editing default version for all staff</p>
                     </div>
                     <div className="flex gap-2">
                        <button className="p-2 text-gray-400 hover:text-[#3E3B6F] rounded-lg"><RotateCcw size={16}/></button>
                        <button className="p-2 text-gray-400 hover:text-[#3E3B6F] rounded-lg"><Save size={16}/></button>
                     </div>
                  </div>

                  <div className="flex-1 p-8 space-y-6">
                    {activeChannel === 'Email' && (
                      <div className="space-y-2 animate-in fade-in duration-300">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email Subject</label>
                        <input 
                          type="text" 
                          className="w-full p-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-indigo-100 rounded-2xl outline-none font-bold text-gray-800 transition-all"
                          defaultValue="Your {{leave_type}} request has been approved"
                        />
                      </div>
                    )}

                    <div className="space-y-2 flex-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Notification Body</label>
                      <div className="border border-gray-100 rounded-3xl overflow-hidden flex flex-col h-full bg-gray-50">
                         {/* Rich Text Controls Mock */}
                         <div className="px-4 py-2 border-b border-gray-100 bg-white flex items-center gap-4">
                            <div className="flex gap-1 border-r pr-4">
                               <button className="p-1.5 hover:bg-gray-50 rounded text-gray-500"><Bold size={16}/></button>
                               <button className="p-1.5 hover:bg-gray-50 rounded text-gray-500"><Italic size={16}/></button>
                               <button className="p-1.5 hover:bg-gray-50 rounded text-gray-500"><Link size={16}/></button>
                            </div>
                            <div className="flex gap-1">
                               <button className="p-1.5 hover:bg-gray-50 rounded text-gray-500"><Type size={16}/></button>
                               <button className="p-1.5 hover:bg-gray-50 rounded text-gray-500"><List size={16}/></button>
                               <button className="p-1.5 hover:bg-gray-50 rounded text-gray-500"><Code size={16}/></button>
                            </div>
                         </div>
                         <textarea 
                          className="w-full flex-1 p-6 bg-transparent outline-none text-sm leading-relaxed font-medium text-gray-700 resize-none h-64"
                          placeholder="Write your message here..."
                          defaultValue={`Dear {{employee_name}},

Your request for {{leave_type}} from {{start_date}} to {{end_date}} ({{duration}}) has been approved by {{approver_name}}.

Your remaining balance is now {{balance}} days.

Best regards,
Flexi HR System`}
                         />
                      </div>
                    </div>
                  </div>

                  {/* Variables Cloud */}
                  <div className="p-8 border-t border-gray-100 bg-white">
                    <div className="flex items-center gap-2 mb-4">
                       <Info size={14} className="text-indigo-400" />
                       <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Click to insert variables</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                       {VARIABLES.map(v => (
                         <button 
                          key={v}
                          className="px-3 py-1.5 bg-indigo-50 hover:bg-[#3E3B6F] hover:text-white text-[#3E3B6F] text-[10px] font-bold rounded-lg border border-indigo-100 transition-all active:scale-95"
                         >
                           {v}
                         </button>
                       ))}
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="flex gap-4">
                  <button className="px-8 py-4 bg-white border border-gray-200 text-gray-500 font-bold rounded-3xl hover:bg-gray-50 transition-all flex items-center gap-2">
                    <RotateCcw size={18} /> Reset to Default
                  </button>
                  <button className="flex-1 py-4 bg-[#3E3B6F] text-white font-bold rounded-3xl shadow-xl shadow-[#3E3B6F]/20 hover:bg-[#4A4680] transition-all flex items-center justify-center gap-2 active:scale-95">
                    <Save size={18} /> Save Template Configuration
                  </button>
                  <button className="px-8 py-4 bg-emerald-600 text-white font-bold rounded-3xl shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 transition-all flex items-center gap-2">
                    <Send size={18} /> Test Send
                  </button>
                </div>
              </div>

              {/* Right Side: Quick Info */}
              <div className="w-80 space-y-6 shrink-0">
                <div className="bg-[#3E3B6F] rounded-[32px] p-8 text-white relative overflow-hidden shadow-xl">
                   <div className="relative z-10 space-y-4">
                      <h4 className="text-sm font-bold uppercase tracking-widest text-indigo-300 flex items-center gap-2"><Zap size={14}/> Auto-Recipient</h4>
                      <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
                        <p className="text-[10px] font-bold uppercase text-white/50 mb-1">Send to</p>
                        <p className="text-sm font-bold">{selectedEvent.defaultRecipients}</p>
                      </div>
                      <p className="text-[11px] text-white/60 leading-relaxed italic">"Dynamic mapping based on request ownership and hierarchical structures."</p>
                   </div>
                   <Database size={150} className="absolute -bottom-12 -right-12 text-white/5 rotate-12" />
                </div>

                <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-6">
                   <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                     {/* Fixed: Use HistoryIcon renamed from lucide-react to avoid collision with global type */}
                     <HistoryIcon size={14}/> Recent Modifications
                   </h4>
                   <div className="space-y-6 relative pl-4 before:content-[''] before:absolute before:left-0 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
                      {[
                        { user: 'Sarah Admin', time: '2h ago', action: 'Updated Email Subject' },
                        { user: 'System', time: 'Jan 15', action: 'Draft Created' },
                      ].map((log, i) => (
                        <div key={i} className="relative">
                          <div className="absolute -left-[19px] top-1.5 w-2 h-2 rounded-full bg-indigo-500 border-2 border-white shadow-sm" />
                          <p className="text-xs font-bold text-gray-800">{log.action}</p>
                          <p className="text-[10px] text-gray-400 uppercase font-medium">{log.user} • {log.time}</p>
                        </div>
                      ))}
                   </div>
                </div>

                <div className="p-6 bg-indigo-50/50 rounded-[32px] border border-indigo-100 flex items-start gap-4">
                   <Info size={18} className="text-indigo-600 shrink-0 mt-0.5" />
                   <p className="text-[10px] text-indigo-800 leading-relaxed font-bold uppercase">
                     Templates support localization. Add Pakistan/Urdu translations in Language Settings.
                   </p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-12 space-y-6">
            <div className="w-24 h-24 bg-white rounded-[32px] border border-gray-100 shadow-sm flex items-center justify-center text-gray-200">
              <Layout size={48} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">Select an Event</h3>
              <p className="text-sm text-gray-400 max-w-xs mx-auto mt-2 leading-relaxed">Choose an event from the library on the left to configure its notification triggers and templates.</p>
            </div>
          </div>
        )}
      </main>

      <style>
        {`
          .custom-scroll::-webkit-scrollbar { width: 4px; }
          .custom-scroll::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 10px; }
        `}
      </style>
    </div>
  );
};