import React, { useState, useMemo } from 'react';
import { 
  X, Plane, MapPin, Calendar, Clock, Phone, 
  FileText, Upload, ShieldCheck, AlertTriangle, 
  CheckCircle2, Info, ArrowRight, User, Plus,
  Trash2, Globe, CreditCard, Shield
} from 'lucide-react';

interface TravelLeg {
  id: string;
  from: string;
  to: string;
  date: string;
  mode: 'Flight' | 'Train' | 'Bus' | 'Car';
}

interface TravelRequestFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: any) => void;
}

export const TravelRequestForm: React.FC<TravelRequestFormProps> = ({ isOpen, onClose, onSubmit }) => {
  const [type, setType] = useState<'Local' | 'Inter-city' | 'International'>('Inter-city');
  const [legs, setLegs] = useState<TravelLeg[]>([
    { id: '1', from: '', to: '', date: '', mode: 'Flight' }
  ]);
  const [formData, setFormData] = useState({
    category: '',
    project: '',
    description: '',
    passportNumber: '',
    passportExpiry: '',
    visaStatus: 'Not Required',
    emergencyContactName: '',
    emergencyContactPhone: '',
    requestAdvance: false,
    advanceAmount: 0,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Move useMemo BEFORE any conditional returns
  const totalDuration = useMemo(() => {
    if (legs.length === 0 || !legs[0].date) return '0 days';
    const dates = legs.map(l => new Date(l.date).getTime()).filter(d => !isNaN(d));
    if (dates.length === 0) return '0 days';
    const min = new Date(Math.min(...dates));
    const max = new Date(Math.max(...dates));
    const diff = Math.ceil((max.getTime() - min.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return `${diff} day${diff > 1 ? 's' : ''} (${min.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}${diff > 1 ? ' - ' + max.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''})`;
  }, [legs]);

  // Only after ALL hooks are called, check for conditional return
  if (!isOpen) return null;

  const addLeg = () => {
    if (legs.length >= 10) return;
    setLegs([...legs, { id: Math.random().toString(36).substr(2, 9), from: '', to: '', date: '', mode: type === 'Local' ? 'Car' : 'Flight' }]);
  };

  const removeLeg = (id: string) => {
    if (legs.length === 1) return;
    setLegs(legs.filter(l => l.id !== id));
  };

  const updateLeg = (id: string, updates: Partial<TravelLeg>) => {
    setLegs(legs.map(l => l.id === id ? { ...l, ...updates } : l));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 1500));
    setIsSubmitting(false);
    if (onSubmit) onSubmit({ type, legs, ...formData });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-0 !m-0a">
      <div className="absolute inset-0 bg-[#3E3B6F]/40 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose} />
      
      <div className="relative bg-[#F5F5F5] rounded-[40px] w-full max-w-[750px] max-h-[95vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in duration-300">
        {/* Header */}
        <div className="bg-white px-10 py-8 border-b border-gray-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-50 text-[#3E3B6F] rounded-2xl">
              <Plane size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">New Travel Request</h3>
              <p className="text-sm text-gray-400 font-medium">Plan your business trip and request advances.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-10 space-y-10 custom-modal-scroll">
          {/* Section 1: Travel Type */}
          <section className="space-y-4">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Travel Category *</label>
            <div className="grid grid-cols-3 gap-3">
              {(['Local', 'Inter-city', 'International'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`px-4 py-4 rounded-2xl text-xs font-bold border-2 transition-all text-center ${
                    type === t 
                      ? 'border-[#3E3B6F] bg-indigo-50 text-[#3E3B6F]' 
                      : 'border-white bg-white text-gray-400 hover:border-gray-200 shadow-sm'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </section>

          {/* Section 2: Itinerary */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Itinerary / Legs</label>
              <span className="text-xs font-bold text-[#3E3B6F] bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                Total: {totalDuration}
              </span>
            </div>
            
            <div className="space-y-4">
              {legs.map((leg, index) => (
                <div key={leg.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative group animate-in slide-in-from-top-2">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold text-[#3E3B6F] uppercase tracking-widest">Leg {index + 1}</span>
                    {legs.length > 1 && (
                      <button type="button" onClick={() => removeLeg(leg.id)} className="text-red-400 hover:text-red-600">
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                       <input 
                        type="text" placeholder="From City" required
                        className="flex-1 p-3 bg-gray-50 rounded-xl text-sm font-bold outline-none focus:bg-white focus:ring-1 focus:ring-[#3E3B6F]/10"
                        value={leg.from} onChange={(e) => updateLeg(leg.id, { from: e.target.value })}
                       />
                       <ArrowRight size={14} className="text-gray-300" />
                       <input 
                        type="text" placeholder="To City" required
                        className="flex-1 p-3 bg-gray-50 rounded-xl text-sm font-bold outline-none focus:bg-white focus:ring-1 focus:ring-[#3E3B6F]/10"
                        value={leg.to} onChange={(e) => updateLeg(leg.id, { to: e.target.value })}
                       />
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex-1 relative">
                        <input 
                          type="date" required
                          className="w-full p-3 bg-gray-50 rounded-xl text-sm font-bold outline-none focus:bg-white"
                          value={leg.date} onChange={(e) => updateLeg(leg.id, { date: e.target.value })}
                        />
                        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" size={14} />
                      </div>
                      <select 
                        className="p-3 bg-gray-50 rounded-xl text-sm font-bold outline-none focus:bg-white"
                        value={leg.mode} onChange={(e) => updateLeg(leg.id, { mode: e.target.value as any })}
                      >
                        <option>Flight</option>
                        <option>Train</option>
                        <option>Bus</option>
                        <option>Car</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
              <button 
                type="button" onClick={addLeg}
                className="w-full py-4 border-2 border-dashed border-gray-200 rounded-3xl text-xs font-bold text-gray-400 flex items-center justify-center gap-2 hover:bg-white hover:border-[#3E3B6F] hover:text-[#3E3B6F] transition-all"
              >
                <Plus size={16} /> Add Travel Leg
              </button>
            </div>
          </section>

          {/* Section 3: Purpose */}
          <section className="space-y-6">
            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Travel Purpose</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-gray-500 uppercase">Category *</p>
                <select 
                  required className="w-full p-4 bg-white border border-gray-100 rounded-2xl font-bold text-gray-800 outline-none shadow-sm"
                  value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  <option value="">Select Category...</option>
                  <option>Project Work</option>
                  <option>Client Visit</option>
                  <option>Conference/Seminar</option>
                  <option>Training</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-gray-500 uppercase">Project / Client Name</p>
                <input 
                  type="text" placeholder="e.g. Project Orion / Client X"
                  className="w-full p-4 bg-white border border-gray-100 rounded-2xl font-bold text-gray-800 outline-none shadow-sm"
                  value={formData.project} onChange={(e) => setFormData({...formData, project: e.target.value})}
                />
              </div>
            </div>
            <textarea 
              required rows={3} placeholder="Provide detailed justification for travel..."
              className="w-full p-4 bg-white border border-gray-100 rounded-2xl text-sm font-medium outline-none shadow-sm"
              value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </section>

          {/* Section 5: International Specifics */}
          {type === 'International' && (
            <section className="space-y-6 p-8 bg-[#3E3B6F] rounded-[32px] text-white animate-in zoom-in duration-300 relative overflow-hidden">
               <Globe className="absolute -right-10 -bottom-10 text-white/5" size={200} />
               <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-[#E8D5A3] flex items-center gap-2">
                 <Shield size={18} /> Passport & Visa Details
               </h4>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                  <div className="space-y-2">
                    <p className="text-[10px] text-white/50 font-bold uppercase tracking-widest">Passport Number *</p>
                    <input 
                      type="text" required
                      className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-sm font-bold outline-none placeholder:text-white/20"
                      value={formData.passportNumber} onChange={(e) => setFormData({...formData, passportNumber: e.target.value.toUpperCase()})}
                    />
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] text-white/50 font-bold uppercase tracking-widest">Passport Expiry *</p>
                    <input 
                      type="date" required
                      className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-sm font-bold outline-none"
                      value={formData.passportExpiry} onChange={(e) => setFormData({...formData, passportExpiry: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] text-white/50 font-bold uppercase tracking-widest">Visa Status</p>
                    </div>
                  <div className="space-y-2">
                    <p className="text-[10px] text-white/50 font-bold uppercase tracking-widest">Visa Expiry</p>
                  </div>
               </div>
            </section>
          )}
        </form>
      </div>
    </div>
  );
}