
import React, { useState } from 'react';
import { 
  FileText, Mail, Printer, Download, User, 
  Calendar, Layers, ChevronRight, CheckCircle2, 
  Eye, ToggleLeft as Toggle, Layout, Signature,
  Building2, Hash, Briefcase, Info
} from 'lucide-react';

export const SalaryRevisionLetter: React.FC = () => {
  const [selectedEmp, setSelectedEmp] = useState('Arsalan Khan');
  const [includeBreakdown, setIncludeBreakdown] = useState(true);
  const [digitalSign, setDigitalSign] = useState(true);

  const prevGross = 180000;
  const newGross = 215000;
  const incrementPerc = ((newGross - prevGross) / prevGross * 100).toFixed(1);

  const components = [
    { name: 'Basic Salary', prev: 90000, new: 107500 },
    { name: 'House Rent Allowance', prev: 40500, new: 48375 },
    { name: 'Utilities Allowance', prev: 9000, new: 10750 },
    { name: 'Special Allowance', prev: 40500, new: 48375 },
  ];

  const formatPKR = (val: number) => `PKR ${val.toLocaleString()}`;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Revision Letters</h2>
          <p className="text-sm text-gray-500">Generate formal compensation adjustment communications</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-white border border-gray-200 px-4 py-2.5 rounded-lg font-bold text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-2">
            <Printer size={18} /> Print
          </button>
          <button className="bg-white border border-gray-200 px-4 py-2.5 rounded-lg font-bold text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-2">
            <Mail size={18} /> Send Email
          </button>
          <button className="bg-primary text-white px-6 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all">
            <Download size={18} /> Download PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Selection & Options Panel */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[2px] text-gray-400">Configuration</h3>
            
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Select Employee</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <select 
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold outline-none cursor-pointer"
                    value={selectedEmp}
                    onChange={(e) => setSelectedEmp(e.target.value)}
                  >
                    <option>Arsalan Khan (EMP-1001)</option>
                    <option>Saira Ahmed (EMP-1002)</option>
                    <option>Mustafa Kamal (EMP-1005)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Effective Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input type="date" value="2025-01-01" className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold outline-none" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Salary Structure</label>
                <div className="relative">
                  <Layers className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <select className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold outline-none cursor-pointer">
                    <option>ENG-SR-18 (Jan 2025 Revised)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t space-y-3">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Letter Options</h4>
              
              <button 
                onClick={() => setIncludeBreakdown(!includeBreakdown)}
                className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all border border-transparent hover:border-gray-200"
              >
                <div className="flex items-center gap-3">
                  <Layout size={16} className="text-gray-400" />
                  <span className="text-xs font-bold text-gray-700">Detailed Breakdown</span>
                </div>
                <div className={`w-8 h-4 rounded-full relative transition-all ${includeBreakdown ? 'bg-primary' : 'bg-gray-300'}`}>
                  <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${includeBreakdown ? 'right-0.5' : 'left-0.5'}`} />
                </div>
              </button>

              <button 
                onClick={() => setDigitalSign(!digitalSign)}
                className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all border border-transparent hover:border-gray-200"
              >
                <div className="flex items-center gap-3">
                  <Signature size={16} className="text-gray-400" />
                  <span className="text-xs font-bold text-gray-700">Digital Signature</span>
                </div>
                <div className={`w-8 h-4 rounded-full relative transition-all ${digitalSign ? 'bg-primary' : 'bg-gray-300'}`}>
                  <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${digitalSign ? 'right-0.5' : 'left-0.5'}`} />
                </div>
              </button>
            </div>
          </div>

          <div className="p-5 bg-primary/5 rounded-2xl border border-primary/10 flex items-start gap-3">
             <Info size={18} className="text-primary mt-1" />
             <p className="text-xs text-primary/70 font-medium leading-relaxed italic uppercase tracking-tight">
               Generated letters are automatically stored in the employee's "Documents" folder for future retrieval and compliance audits.
             </p>
          </div>
        </div>

        {/* Letter Preview Panel */}
        <div className="lg:col-span-8 bg-gray-200 p-8 rounded-2xl flex justify-center overflow-y-auto max-h-[900px] custom-scrollbar">
          <div className="w-full max-w-[700px] bg-white shadow-2xl min-h-[1000px] p-16 flex flex-col animate-in zoom-in-95 duration-300">
            {/* Letterhead */}
            <div className="flex justify-between items-start border-b-4 border-primary pb-8 mb-12">
              <div>
                <h1 className="text-3xl font-black text-primary tracking-tighter">Flexi HRMS</h1>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Enterprise Payroll Solutions</p>
              </div>
              <div className="text-right text-[10px] font-bold text-gray-500 uppercase leading-relaxed">
                <p>Floor 5, Software Technology Park</p>
                <p>I-9, Islamabad, Pakistan</p>
                <p>www.flexihrms.com</p>
              </div>
            </div>

            {/* Letter Body */}
            <div className="flex-1 space-y-8 text-gray-800 leading-relaxed">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs font-bold text-gray-400">Date: January 15, 2025</p>
                  <p className="text-xs font-bold text-gray-400 mt-1">Ref: PK/HR/2025/{selectedEmp.split(' ')[0].toUpperCase()}</p>
                </div>
              </div>

              <div className="space-y-1">
                <p className="font-bold text-lg">{selectedEmp}</p>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Senior Engineering Lead • EMP-1001</p>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-black text-gray-900 border-b border-gray-100 pb-2">Subject: Revision of Compensation</h2>
                <p className="text-sm">Dear {selectedEmp.split(' ')[0]},</p>
                <p className="text-sm">
                  We are pleased to inform you that following the recent performance review cycle, 
                  your compensation has been revised effective from <strong>January 01, 2025</strong>. 
                  This adjustment reflects your valuable contribution to the Engineering department and the overall growth of the organization.
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 space-y-4">
                <div className="grid grid-cols-2 gap-8 text-sm">
                   <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Previous Gross</p>
                      <p className="font-bold text-gray-600 line-through">{formatPKR(prevGross)}</p>
                   </div>
                   <div>
                      <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">New Monthly Gross</p>
                      <p className="text-xl font-black text-primary">{formatPKR(newGross)}</p>
                   </div>
                </div>
                <div className="pt-2 border-t border-gray-200">
                   <p className="text-[10px] font-black text-green-600 uppercase tracking-widest">Total Adjustment: {incrementPerc}% Increase</p>
                </div>
              </div>

              {includeBreakdown && (
                <div className="space-y-4 pt-4 animate-in fade-in duration-300">
                  <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Detailed Breakdown</h3>
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b text-[10px] font-black text-gray-500 uppercase tracking-tighter">
                        <th className="px-4 py-2">Component Name</th>
                        <th className="px-4 py-2 text-right">Previous (PKR)</th>
                        <th className="px-4 py-2 text-right">Revised (PKR)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {components.map((c, i) => (
                        <tr key={i}>
                          <td className="px-4 py-3 font-medium text-gray-700">{c.name}</td>
                          <td className="px-4 py-3 text-right text-gray-400">{c.prev.toLocaleString()}</td>
                          <td className="px-4 py-3 text-right font-bold text-gray-800">{c.new.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-primary/5 font-black">
                        <td className="px-4 py-3 text-primary uppercase text-[10px]">Total Gross</td>
                        <td className="px-4 py-3 text-right text-primary/40">{prevGross.toLocaleString()}</td>
                        <td className="px-4 py-3 text-right text-primary">{newGross.toLocaleString()}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}

              <p className="text-sm pt-4 italic">
                All other terms and conditions of your employment contract remain unchanged. 
                We look forward to your continued commitment and excellence.
              </p>

              <div className="pt-12 flex justify-between items-end">
                <div className="space-y-4">
                  <p className="text-sm font-bold">Best Regards,</p>
                  {digitalSign ? (
                    <div className="animate-in slide-in-from-left duration-500">
                       <p className="font-serif text-2xl text-primary font-bold italic opacity-70">Zainab S.</p>
                       <div className="h-[2px] w-32 bg-primary/20 mt-1"></div>
                    </div>
                  ) : (
                    <div className="h-16"></div>
                  )}
                  <div>
                    <p className="text-sm font-black text-gray-800">Zainab Siddiqui</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Director Human Resources</p>
                  </div>
                </div>
                <div className="text-right">
                   <div className="w-24 h-24 bg-gray-50 border-2 border-dashed border-gray-100 rounded flex items-center justify-center text-[10px] font-black text-gray-200 uppercase text-center p-2">
                     Company Stamp Space
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
