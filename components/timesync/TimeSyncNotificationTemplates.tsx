import React, { useState, useMemo } from 'react';
import { 
  Bell, 
  Smartphone, 
  Mail, 
  MessageSquare, 
  Zap, 
  Search, 
  ChevronRight, 
  Save, 
  Send, 
  History, 
  Info, 
  Clock, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle,
  Layers,
  Code,
  // Added missing Plus icon import
  Plus
} from 'lucide-react';

type Category = 'Punch Events' | 'Anomalies' | 'Approvals' | 'Scheduling' | 'System';
type Channel = 'in_app' | 'push' | 'email' | 'sms';

interface NotificationEvent {
  id: string;
  category: Category;
  name: string;
  description: string;
  templates: Record<Channel, {
    enabled: boolean;
    subject?: string;
    body: string;
  }>;
}

const MOCK_EVENTS: NotificationEvent[] = [
  {
    id: 'punch.success',
    category: 'Punch Events',
    name: 'Punch Successful',
    description: 'Triggered when an employee records a valid punch.',
    templates: {
      in_app: { enabled: true, body: 'Success! Your {{punch_type}} was recorded at {{time}}.' },
      push: { enabled: true, body: 'Punch Recorded: {{time}} ({{location}})' },
      email: { enabled: false, subject: 'Punch Confirmation', body: 'Hi {{employee_name}}, your punch at {{time}} on {{date}} was successful.' },
      sms: { enabled: false, body: 'TimeSync: Punch recorded at {{time}}.' }
    }
  },
  {
    id: 'anomaly.late_beyond_tolerance',
    category: 'Anomalies',
    name: 'Late Arrival Alert',
    description: 'Triggered when employee exceeds the allowed grace period.',
    templates: {
      in_app: { enabled: true, body: 'You arrived at {{time}}, which is {{mins_late}}m beyond your grace period.' },
      push: { enabled: true, body: 'Late Arrival Detected: {{time}}' },
      email: { enabled: true, subject: 'Attendance Alert: Late Arrival', body: 'Dear {{employee_name}}, our records show a late arrival on {{date}} at {{time}}.' },
      sms: { enabled: true, body: 'Alert: You have exceeded the late arrival grace period for today.' }
    }
  },
  {
    id: 'ot.request_approved',
    category: 'Approvals',
    name: 'OT Approved',
    description: 'Sent when a manager authorizes extra work hours.',
    templates: {
      in_app: { enabled: true, body: 'Good news! Your OT request for {{hours}}h on {{date}} was approved.' },
      push: { enabled: true, body: 'OT Approved: {{hours}} hours' },
      email: { enabled: true, subject: 'Overtime Request Approved', body: 'Your request for {{hours}} hours of overtime on {{date}} has been authorized.' },
      sms: { enabled: false, body: 'TimeSync: Your OT for {{date}} has been approved.' }
    }
  },
  {
    id: 'roster.published',
    category: 'Scheduling',
    name: 'Roster Published',
    description: 'Triggered when a new roster is finalized for the period.',
    templates: {
      in_app: { enabled: true, body: 'A new roster has been published for {{period}}.' },
      push: { enabled: true, body: 'New Schedule Available: {{period}}' },
      email: { enabled: true, subject: 'Your New Work Schedule', body: 'The schedule for {{period}} is now available in TimeSync.' },
      sms: { enabled: true, body: 'Your new work schedule for {{period}} is live. Check the app for details.' }
    }
  }
];

const CATEGORIES: { name: Category; count: number }[] = [
  { name: 'Punch Events', count: 5 },
  { name: 'Anomalies', count: 8 },
  { name: 'Approvals', count: 6 },
  { name: 'Scheduling', count: 5 },
  { name: 'System', count: 3 }
];

const CHANNEL_UI: Record<Channel, { label: string; icon: React.ReactNode; color: string }> = {
  in_app: { label: 'In-App', icon: <Bell size={14} />, color: 'text-blue-600' },
  push: { label: 'Push', icon: <Smartphone size={14} />, color: 'text-purple-600' },
  email: { label: 'Email', icon: <Mail size={14} />, color: 'text-orange-600' },
  sms: { label: 'SMS', icon: <MessageSquare size={14} />, color: 'text-green-600' },
};

export const TimeSyncNotificationTemplates: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category>('Punch Events');
  const [selectedEventId, setSelectedEventId] = useState<string>(MOCK_EVENTS[0].id);
  const [activeChannel, setActiveChannel] = useState<Channel>('in_app');
  const [searchQuery, setSearchQuery] = useState('');

  const selectedEvent = useMemo(() => 
    MOCK_EVENTS.find(e => e.id === selectedEventId) || MOCK_EVENTS[0]
  , [selectedEventId]);

  const variables = ['employee_name', 'date', 'time', 'location', 'punch_type', 'hours', 'period', 'mins_late'];

  return (
    <div className="flex h-[calc(100vh-120px)] animate-in fade-in duration-500 overflow-hidden bg-white rounded-3xl border border-gray-200 shadow-sm">
      {/* SIDEBAR */}
      <div className="w-80 border-r border-gray-100 flex flex-col shrink-0 bg-gray-50/30">
        <div className="p-6 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            <input 
              type="text" 
              placeholder="Search events..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-medium outline-none focus:ring-4 focus:ring-[#3E3B6F]/5"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-6">
          {CATEGORIES.map(cat => (
            <div key={cat.name} className="space-y-1">
              <button 
                onClick={() => setSelectedCategory(cat.name)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all ${selectedCategory === cat.name ? 'bg-[#3E3B6F] text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'}`}
              >
                <span className="text-[10px] font-black uppercase tracking-widest">{cat.name}</span>
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${selectedCategory === cat.name ? 'bg-white/20' : 'bg-gray-100 text-gray-400'}`}>
                  {cat.count}
                </span>
              </button>
              
              {selectedCategory === cat.name && (
                <div className="pl-2 space-y-1 animate-in slide-in-from-left-2 duration-300">
                  {MOCK_EVENTS.filter(e => e.category === cat.name).map(event => (
                    <button 
                      key={event.id}
                      onClick={() => setSelectedEventId(event.id)}
                      className={`w-full text-left px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center justify-between group ${selectedEventId === event.id ? 'text-[#3E3B6F] bg-white border border-[#3E3B6F]/10' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                      <span className="truncate">{event.name}</span>
                      <ChevronRight size={14} className={` ${selectedEventId === event.id ? 'opacity-100' : ''}`} />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* EDITOR AREA */}
      <div className="flex-1 flex flex-col overflow-hidden bg-white">
        <div className="p-8 border-b border-gray-100 flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h3 className="text-xl font-bold text-gray-800">{selectedEvent.name}</h3>
              <code className="text-[10px] font-black bg-gray-100 text-gray-500 px-2 py-0.5 rounded lowercase tracking-tighter">
                {selectedEvent.id}
              </code>
            </div>
            <p className="text-sm text-gray-500 font-medium italic">{selectedEvent.description}</p>
          </div>
          <div className="flex gap-3">
             <button className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-200 transition-all">
                <Send size={16} /> Test Send
             </button>
             <button className="flex items-center gap-2 px-6 py-2.5 bg-[#3E3B6F] text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-[#3E3B6F]/20 hover:scale-[1.02] active:scale-95 transition-all">
                <Save size={18} /> Save Template
             </button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden flex">
          {/* CONTENT EDITOR */}
          <div className="flex-1 overflow-y-auto p-10 custom-scrollbar space-y-8">
            {/* CHANNEL SELECTOR */}
            <div className="flex gap-2">
              {(Object.keys(selectedEvent.templates) as Channel[]).map(ch => (
                <button 
                  key={ch}
                  onClick={() => setActiveChannel(ch)}
                  className={`flex items-center gap-3 px-6 py-3 rounded-2xl border-2 transition-all ${
                    activeChannel === ch 
                      ? 'border-[#3E3B6F] bg-[#3E3B6F]/5 shadow-inner' 
                      : 'border-gray-50 bg-white hover:border-gray-100'
                  }`}
                >
                  <div className={activeChannel === ch ? 'text-[#3E3B6F]' : 'text-gray-400'}>
                    {CHANNEL_UI[ch].icon}
                  </div>
                  <span className={`text-xs font-black uppercase tracking-widest ${activeChannel === ch ? 'text-[#3E3B6F]' : 'text-gray-400'}`}>
                    {CHANNEL_UI[ch].label}
                  </span>
                </button>
              ))}
            </div>

            <div className="space-y-6 bg-gray-50/50 p-8 rounded-3xl border border-gray-100">
               <div className="flex items-center justify-between mb-2">
                  <h4 className="text-[10px] font-black text-[#3E3B6F] uppercase tracking-widest flex items-center gap-2">
                    {CHANNEL_UI[activeChannel].icon} {CHANNEL_UI[activeChannel].label} Editor
                  </h4>
                  <div className="flex items-center gap-2">
                     <span className="text-[10px] font-bold text-gray-400 uppercase">Enable Channel</span>
                     <div className="w-10 h-5 bg-[#3E3B6F] rounded-full relative p-1 cursor-pointer">
                        <div className="w-3 h-3 bg-white rounded-full absolute right-1"></div>
                     </div>
                  </div>
               </div>

               {activeChannel === 'email' && (
                 <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Subject Line</label>
                    <input 
                      type="text" 
                      defaultValue={selectedEvent.templates.email.subject}
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-[#3E3B6F]/5 outline-none transition-all"
                    />
                 </div>
               )}

               <div className="space-y-2 animate-in slide-in-from-bottom-2 duration-300">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Message Body</label>
                  <div className="relative">
                    <textarea 
                      className="w-full bg-white border border-gray-200 rounded-2xl px-6 py-6 text-sm font-medium focus:ring-4 focus:ring-[#3E3B6F]/5 outline-none min-h-[160px] leading-relaxed shadow-sm"
                      value={selectedEvent.templates[activeChannel].body}
                      onChange={() => {}}
                    />
                    <div className="absolute bottom-4 right-4 flex gap-2">
                      <button className="p-2 bg-gray-50 text-gray-400 rounded-lg hover:text-[#3E3B6F] transition-colors"><Code size={14} /></button>
                    </div>
                  </div>
               </div>
            </div>

            {/* PREVIEW BOX */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <Layers size={14} /> Rendered Preview
              </h4>
              <div className="bg-gray-900 rounded-3xl p-8 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-4 opacity-10 text-white">
                   <CheckCircle2 size={120} />
                 </div>
                 <div className="max-w-md mx-auto bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-2xl relative z-10">
                   <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                        <Zap size={16} />
                      </div>
                      <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">TimeSync Preview</span>
                   </div>
                   <p className="text-white text-sm font-medium leading-relaxed italic">
                     "{selectedEvent.templates[activeChannel].body
                        .replace('{{employee_name}}', 'Sarah Jenkins')
                        .replace('{{date}}', 'Jan 15, 2025')
                        .replace('{{time}}', '09:02 AM')
                        .replace('{{punch_type}}', 'Punch-In')
                        .replace('{{location}}', 'Office HQ')
                     }"
                   </p>
                 </div>
              </div>
            </div>
          </div>

          {/* VARIABLES SIDEBAR */}
          <div className="w-72 border-l border-gray-100 p-8 flex flex-col bg-gray-50/50 shrink-0">
            <div className="flex items-center gap-2 mb-6 text-[#3E3B6F]">
              <Info size={16} />
              <h4 className="text-[10px] font-black uppercase tracking-widest">Available Tokens</h4>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pb-8">
              {variables.map(v => (
                <button 
                  key={v}
                  className="w-full flex items-center justify-between p-3 bg-white border border-gray-200 rounded-xl group hover:border-[#3E3B6F] transition-all"
                >
                  <code className="text-[11px] font-bold text-gray-400 group-hover:text-[#3E3B6F]">{"{{" + v + "}}"}</code>
                  <Plus size={12} className="text-gray-300 group-hover:text-[#3E3B6F]" />
                </button>
              ))}
            </div>

            <div className="p-4 bg-white border border-[#E8D5A3] rounded-2xl">
               <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-1">Expert Tip</p>
               <p className="text-[10px] text-gray-500 leading-relaxed font-medium">
                 Use variables to personalize every alert. Ensure your SMS templates are under <span className="font-bold">160 characters</span> to avoid multiple segments.
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};