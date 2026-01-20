
import React, { useState, useMemo } from 'react';
import { 
  FileText, Mail, Printer, Download, User, 
  Calendar, Layers, ChevronRight, CheckCircle2, 
  Eye, Signature, Building2, Info, Search, 
  Filter, Check, Send, Layout, DownloadCloud
} from 'lucide-react';

interface LetterEmployee {
  id: string;
  name: string;
  dept: string;
  designation: string;
  prevGross: number;
  newGross: number;
  incrementPerc: number;
  selected: boolean;
}

const MOCK_REVISION_DATA: LetterEmployee[] = [
  { id: 'EMP-1001', name: 'Arsalan Khan', dept: 'Engineering', designation: 'Senior Lead', prevGross: 180000, newGross: 215000, incrementPerc: 19.4, selected: true },
  { id: 'EMP-1005', name: 'Mustafa Kamal', dept: 'Engineering', designation: 'Director', prevGross: 550000, newGross: 649000, incrementPerc: 18.0, selected: true },
  { id: 'EMP-1102', name: 'Saira Ahmed', dept: 'HR', designation: 'Manager', prevGross: 125000, newGross: 137500, incrementPerc: 10.0, selected: false },
  { id: 'EMP-1004', name: 'Zainab Bibi', dept: 'Operations', designation: 'Analyst', prevGross: 92000, newGross: 96600, incrementPerc: 5.0, selected: false },
];

export const IncrementLetterGenerator: React.FC = () => {
  const [selectedCycle, setSelectedCycle] = useState('Annual Review 2025');
  const [config, setConfig] = useState({
    template: 'Standard Corporate v2',
    includeBreakdown: true,
    digitalSign: true,
    letterDate: '2025-01-15'
  });
  const [employees, setEmployees] = useState(MOCK_REVISION_DATA);
  const [previewEmpId, setPreviewEmpId] = useState('EMP-1001');

  const previewEmp = useMemo(() => 
    employees.find(e => e.id === previewEmpId) || employees[0], 
  [previewEmpId, employees]);

  const toggleSelect = (id: string) => {
    setEmployees(prev => prev.map(e => e.id === id ? { ...e, selected: !e.selected } : e));
  };

  const selectedCount = employees.filter(e => e.selected).length;

  const formatPKR = (val: number) => `PKR ${val.toLocaleString()}`;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Increment Letter Generator</h2>
          <p className="text-sm text-gray-500">Bulk produce formal compensation revision documents</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-white border border-gray-200 px-5 py-2.5 rounded-lg font-bold text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-2 shadow-sm transition-all">
            <Mail size={18} /> Email Selected
          </button>
          <button className="bg-primary text-white px-6 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-95">
            <DownloadCloud size={18} /> Generate {selectedCount} Letters
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Configuration & Selection */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[2px] text-gray-400">Letter Config</h3>
            
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Review Cycle</label>
                <select 
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold outline-none"
                  value={selectedCycle}
                  onChange={(e) => setSelectedCycle(e.target.value)}
                >
                  <option>Annual Review 2025</option>
                  <option>Mid-Year Cycle 2024</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Letter Date</label>
                <input 
                  type="date" 
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold outline-none"
                  value={config.letterDate}
                  onChange={(e) => setConfig({...config, letterDate: e.target.value})}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Letter Template</label>
                <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold outline-none">
                  <option>Standard Corporate v2</option>
                  <option>Executive Specialized</option>
                  <option>Simple Notice</option>
                </select>
              </div>

              <div className="pt-4 border-t space-y-3">
                <button 
                  onClick={() => setConfig({...config, includeBreakdown: !config.includeBreakdown})}
                  className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-transparent hover:border-primary/20 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <Layout size={16} className="text-gray-400" />
                    <span className="text-xs font-bold text-gray-700">Detailed Breakdown</span>
                  </div>
                  <div className={`w-8 h-4 rounded-full relative transition-all ${config.includeBreakdown ? 'bg-primary' : 'bg-gray-300'}`}>
                    <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${config.includeBreakdown ? 'right-0.5' : 'left-0.5'}`} />
                  </div>
                </button>
                <button 
                  onClick={() => setConfig({...config, digitalSign: !config.digitalSign})}
                  className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-transparent hover:border-primary/20 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <Signature size={16} className="text-gray-400" />
                    <span className="text-xs font-bold text-gray-700">Digital Signature</span>
                  </div>
                  <div className={`w-8 h-4 rounded-full relative transition-all ${config.digitalSign ? 'bg-primary' : 'bg-gray-300'}`}>
                    <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${config.digitalSign ? 'right-0.5' : 'left-0.5'}`} />
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Selection List */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
             <div className="p-4 border-b bg-gray-50/50 flex items-center justify-between">
                <h3 className="text-[10px] font-black uppercase tracking-[2px] text-gray-400">Selection Scope</h3>
                <span className="text-[10px] font-black text-primary uppercase">{selectedCount} Active</span>
             </div>
             <div className="p-4 border-b">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                  <input type="text" placeholder="Search selection..." className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs outline-none" />
                </div>
             </div>
             <div className="max-h-[300px] overflow-y-auto custom-scrollbar divide-y divide-gray-50">
                {employees.map(emp => (
                  <div 
                    key={emp.id} 
                    className={`p-4 flex items-center gap-4 transition-colors cursor-pointer ${previewEmpId === emp.id ? 'bg-primary/5' : 'hover:bg-gray-50'}`}
                    onClick={() => setPreviewEmpId(emp.id)}
                  >
                    <input 
                      type="checkbox" 
                      checked={emp.selected} 
                      onChange={(e) => {
                        e.stopPropagation();
                        toggleSelect(emp.id);
                      }}
                      className="w-4 h-4 accent-primary rounded" 
                    />
                    <div className="flex-1 min-w-0">
                       <p className={`text-xs font-bold truncate ${previewEmpId === emp.id ? 'text-primary' : 'text-gray-700'}`}>{emp.name}</p>
                       <p className="text-[9px] font-black text-gray-400 uppercase">{emp.incrementPerc}% • {emp.dept}</p>
                    </div>
                    <ChevronRight size={14} className="text-gray-300" />
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Right: Letter Preview */}
        <div className="lg:col-span-8 bg-gray-200 p-8 rounded-2xl flex justify-center overflow-y-auto max-h-[850px] custom-scrollbar shadow-inner">
           <div className="w-full max-w-[700px] bg-white shadow-2xl p-16 flex flex-col animate-in zoom-in-95 duration-500 min-h-[900px]">
              {/* Branding */}
              <div className="flex justify-between items-start border-b-4 border-primary pb-8 mb-12">
                <div>
                  <h1 className="text-3xl font-black text-primary tracking-tighter">Flexi HRMS</h1>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Industrial Payroll Solutions</p>
                </div>
                <div className="text-right text-[9px] font-bold text-gray-500 uppercase leading-relaxed">
                  <p>Software Technology Park</p>
                  <p>Sector I-9, Islamabad</p>
                  <p>NTN: 8899221-4</p>
                </div>
              </div>

              {/* Body */}
              <div className="space-y-8 text-gray-800 leading-relaxed text-sm">
                 <div className="flex justify-between items-end">
                    <div className="space-y-1">
                       <p className="font-bold text-gray-400 text-xs">Date: {new Date(config.letterDate).toLocaleDateString('en-PK', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                       <p className="font-bold text-gray-400 text-xs uppercase tracking-tighter">Ref: PK/CORP/2025/{previewEmp.id.replace('EMP-', '')}</p>
                    </div>
                 </div>

                 <div className="space-y-1">
                    <p className="font-black text-lg text-gray-900">{previewEmp.name}</p>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">{previewEmp.designation} • {previewEmp.id}</p>
                 </div>

                 <div className="space-y-4 pt-4 border-t border-gray-100">
                    <h2 className="text-xl font-black text-gray-900 tracking-tight">Subject: Salary Revision Notification</h2>
                    <p>Dear {previewEmp.name.split(' ')[0]},</p>
                    <p>
                      We are pleased to inform you that your compensation has been revised effective from <strong>January 01, 2025</strong>. 
                      This adjustment is a recognition of your professional growth and consistent performance within the <strong>{previewEmp.dept}</strong> department.
                    </p>
                 </div>

                 <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 grid grid-cols-2 gap-8 shadow-sm">
                    <div className="space-y-1">
                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Previous Gross</p>
                       <p className="text-lg font-bold text-gray-500 line-through">{formatPKR(previewEmp.prevGross)}</p>
                    </div>
                    <div className="space-y-1 text-right">
                       <p className="text-[10px] font-black text-primary uppercase tracking-widest">New Monthly Gross</p>
                       <p className="text-2xl font-black text-primary">{formatPKR(previewEmp.newGross)}</p>
                    </div>
                    <div className="col-span-2 pt-4 border-t border-gray-200">
                       <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase text-green-600 tracking-[2px]">Revision Percentage</span>
                          <span className="text-sm font-black text-green-600">+{previewEmp.incrementPerc}% Increase</span>
                       </div>
                    </div>
                 </div>

                 {config.includeBreakdown && (
                   <div className="space-y-4 animate-in fade-in duration-500">
                      <h3 className="text-[10px] font-black uppercase tracking-[2px] text-gray-400">Revised Salary Components</h3>
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-gray-50 border-b text-gray-500 uppercase font-black text-[9px]">
                            <th className="px-4 py-2">Component</th>
                            <th className="px-4 py-2 text-right">Current (PKR)</th>
                            <th className="px-4 py-2 text-right">Revised (PKR)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          <tr>
                             <td className="px-4 py-3 font-medium">Basic Salary</td>
                             <td className="px-4 py-3 text-right text-gray-400">{(previewEmp.prevGross * 0.5).toLocaleString()}</td>
                             <td className="px-4 py-3 text-right font-bold">{(previewEmp.newGross * 0.5).toLocaleString()}</td>
                          </tr>
                          <tr>
                             <td className="px-4 py-3 font-medium">House Rent Allowance</td>
                             <td className="px-4 py-3 text-right text-gray-400">{(previewEmp.prevGross * 0.2).toLocaleString()}</td>
                             <td className="px-4 py-3 text-right font-bold">{(previewEmp.newGross * 0.2).toLocaleString()}</td>
                          </tr>
                          <tr className="bg-primary/5 font-black text-primary">
                             <td className="px-4 py-3 uppercase text-[9px] tracking-widest">Monthly Gross</td>
                             <td className="px-4 py-3 text-right opacity-40">{previewEmp.prevGross.toLocaleString()}</td>
                             <td className="px-4 py-3 text-right border-l border-primary/10">{previewEmp.newGross.toLocaleString()}</td>
                          </tr>
                        </tbody>
                      </table>
                   </div>
                 )}

                 <p className="pt-4 italic text-gray-500 text-[13px]">
                   All other terms and conditions of your employment remain unchanged. We look forward to your continued contribution.
                 </p>

                 <div className="pt-12 flex justify-between items-end">
                    <div className="space-y-6">
                       <p className="font-bold">Best Regards,</p>
                       {config.digitalSign ? (
                         <div className="animate-in slide-in-from-left duration-700">
                            <p className="font-serif text-3xl text-primary font-bold italic opacity-70">Zainab Siddiqui</p>
                            <div className="h-[2px] w-48 bg-primary/20 mt-1"></div>
                         </div>
                       ) : <div className="h-12"></div>}
                       <div>
                          <p className="font-black text-gray-800">Zainab Siddiqui</p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Director Human Resources</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <div className="w-24 h-24 bg-gray-50 border-2 border-dashed border-gray-100 rounded flex flex-col items-center justify-center text-center p-2 text-[8px] font-black text-gray-300 uppercase leading-tight">
                          Place Company<br/>Seal Here
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
