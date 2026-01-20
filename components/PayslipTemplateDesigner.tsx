
import React, { useState } from 'react';
import { 
  X, Save, Layout, Image, User, Wallet, 
  BarChart3, FileText, Palette, GripVertical, 
  Eye, Check, Trash2, Plus, QrCode, 
  Signature, Type, Smartphone, Landmark,
  ShieldCheck, Info
} from 'lucide-react';

type ConfigSection = 'HEADER' | 'EMPLOYEE' | 'COMPONENTS' | 'SUMMARY' | 'FOOTER' | 'STYLING';

export const PayslipTemplateDesigner = () => {
  const [activeSection, setActiveSection] = useState<ConfigSection>('HEADER');
  const [primaryColor, setPrimaryColor] = useState('#3E3B6F');
  const [config, setConfig] = useState({
    showLogo: true,
    showAddress: true,
    showNTN: true,
    showDept: true,
    showDesignation: true,
    showBank: true,
    showYTD: true,
    showEmployerShare: false,
    showQR: true,
    showSignature: true,
    fontFamily: 'Inter',
    paperSize: 'A4'
  });

  const updateConfig = (key: keyof typeof config, val: any) => {
    setConfig(prev => ({ ...prev, [key]: val }));
  };

  return (
    <div className="h-full flex flex-col animate-in fade-in duration-500 overflow-hidden">
      {/* Top Header */}
      <div className="bg-white border-b px-8 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <button  className="p-2 hover:bg-gray-100 rounded-full text-gray-400">
            <X size={20} />
          </button>
          <div>
            <h2 className="text-xl font-bold text-gray-800 tracking-tight flex items-center gap-2">
              Payslip Designer
              <span className="bg-indigo-100 text-indigo-600 text-[9px] font-black px-1.5 py-0.5 rounded uppercase">PRO</span>
            </h2>
            <p className="text-xs text-gray-400 font-medium">Drafting: "Corporate Standard v2.0"</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-5 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-lg text-sm font-bold hover:bg-gray-50 flex items-center gap-2 transition-all">
            <Eye size={16} /> Desktop Preview
          </button>
          <button className="px-5 py-2.5 bg-primary text-white rounded-lg text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 flex items-center gap-2 active:scale-95 transition-all">
            <Save size={16} /> Save Template
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left column: CONFIG (400px fixed) */}
        <aside className="w-[400px] border-r bg-white overflow-y-auto custom-scrollbar">
          <div className="p-6 space-y-6">
            {/* Section Selector */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'HEADER', icon: Layout, label: 'Header' },
                { id: 'EMPLOYEE', icon: User, label: 'Employee' },
                { id: 'COMPONENTS', icon: Wallet, label: 'Salary' },
                { id: 'SUMMARY', icon: BarChart3, label: 'YTD/CTC' },
                { id: 'FOOTER', icon: Smartphone, label: 'Footer' },
                { id: 'STYLING', icon: Palette, label: 'Branding' },
              ].map(sec => (
                <button
                  key={sec.id}
                  onClick={() => setActiveSection(sec.id as ConfigSection)}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border text-[10px] font-black uppercase tracking-tighter transition-all ${
                    activeSection === sec.id 
                    ? 'bg-primary border-primary text-white shadow-md' 
                    : 'bg-white border-gray-100 text-gray-400 hover:border-gray-300'
                  }`}
                >
                  <sec.icon size={18} className="mb-1" />
                  {sec.label}
                </button>
              ))}
            </div>

            <div className="h-[1px] bg-gray-100" />

            {/* Dynamic Controls based on Section */}
            <div className="space-y-6 animate-in slide-in-from-left-2 duration-300">
              {activeSection === 'HEADER' && (
                <div className="space-y-6">
                  <div className="p-4 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center gap-2 text-gray-400 hover:border-primary hover:text-primary transition-all cursor-pointer">
                    <Image size={24} />
                    <span className="text-xs font-bold uppercase">Upload Company Logo</span>
                    <span className="text-[9px]">PNG/JPG (Max 2MB)</span>
                  </div>
                  <ToggleItem label="Show Company Address" active={config.showAddress} onClick={() => updateConfig('showAddress', !config.showAddress)} />
                  <ToggleItem label="Show NTN Number" active={config.showNTN} onClick={() => updateConfig('showNTN', !config.showNTN)} />
                </div>
              )}

              {activeSection === 'EMPLOYEE' && (
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Included Fields</h4>
                  <div className="space-y-2">
                    <ToggleItem label="Department" active={config.showDept} onClick={() => updateConfig('showDept', !config.showDept)} />
                    <ToggleItem label="Designation" active={config.showDesignation} onClick={() => updateConfig('showDesignation', !config.showDesignation)} />
                    <ToggleItem label="Bank Account (Masked)" active={config.showBank} onClick={() => updateConfig('showBank', !config.showBank)} />
                  </div>
                </div>
              )}

              {activeSection === 'COMPONENTS' && (
                <div className="space-y-4">
                   <div className="bg-blue-50 p-4 rounded-xl flex gap-3">
                      <Info size={18} className="text-blue-500 shrink-0" />
                      <p className="text-[10px] text-blue-700 font-medium">Earnings and deductions will be grouped automatically. Drag components to reorder.</p>
                   </div>
                   <div className="space-y-2">
                      {['Basic Salary', 'HRA (45%)', 'Utilities', 'Bonus', 'Tax'].map((c, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-white border rounded-lg group">
                          <div className="flex items-center gap-3">
                            <GripVertical size={14} className="text-gray-300" />
                            <span className="text-xs font-bold text-gray-700">{c}</span>
                          </div>
                          <button className="text-gray-300 group-hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={14}/></button>
                        </div>
                      ))}
                      <button className="w-full py-2 border-2 border-dashed border-gray-100 text-gray-400 text-[10px] font-black uppercase flex items-center justify-center gap-1 hover:text-primary transition-all">
                        <Plus size={14} /> Add Placeholder
                      </button>
                   </div>
                </div>
              )}

              {activeSection === 'SUMMARY' && (
                 <div className="space-y-4">
                    <ToggleItem label="Show YTD Totals" active={config.showYTD} onClick={() => updateConfig('showYTD', !config.showYTD)} />
                    <ToggleItem label="Show Employer Contributions" active={config.showEmployerShare} onClick={() => updateConfig('showEmployerShare', !config.showEmployerShare)} />
                 </div>
              )}

              {activeSection === 'FOOTER' && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Footer Compliance Text</label>
                    <textarea 
                      className="w-full p-3 bg-gray-50 border rounded-xl text-xs font-medium focus:ring-2 focus:ring-primary/10 outline-none h-24"
                      placeholder="e.g. This is a system generated document..."
                    />
                  </div>
                  <ToggleItem label="Include QR Verification" active={config.showQR} onClick={() => updateConfig('showQR', !config.showQR)} />
                  <ToggleItem label="Include Digital Signature" active={config.showSignature} onClick={() => updateConfig('showSignature', !config.showSignature)} />
                </div>
              )}

              {activeSection === 'STYLING' && (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Primary Brand Color</label>
                    <div className="flex flex-wrap gap-2">
                      {['#3E3B6F', '#10B981', '#3B82F6', '#8B5CF6', '#F59E0B'].map(c => (
                        <button 
                          key={c} 
                          onClick={() => setPrimaryColor(c)}
                          className={`w-8 h-8 rounded-full border-4 ${primaryColor === c ? 'border-gray-200' : 'border-transparent'}`}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Paper Size</label>
                      <select className="w-full p-2 bg-gray-50 border rounded-lg text-xs font-bold outline-none">
                        <option>A4 Portrait</option>
                        <option>A5 Landscape</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Base Font</label>
                      <select className="w-full p-2 bg-gray-50 border rounded-lg text-xs font-bold outline-none">
                        <option>Inter</option>
                        <option>Roboto</option>
                        <option>Courier</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Right column: LIVE PREVIEW (Flexible) */}
        <main className="flex-1 bg-gray-200 p-12 overflow-y-auto custom-scrollbar flex justify-center">
          <div className="w-full max-w-[700px] bg-white shadow-2xl min-h-[900px] p-12 flex flex-col space-y-10 animate-in zoom-in-95 duration-500" style={{ fontFamily: config.fontFamily }}>
            
            {/* PREVIEW HEADER */}
            <div className="flex justify-between items-start border-b-2 pb-6" style={{ borderColor: primaryColor }}>
              <div className="flex items-center gap-4">
                 {config.showLogo && (
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-300">
                       <Image size={24} />
                    </div>
                 )}
                 <div>
                    <h1 className="text-2xl font-black tracking-tighter" style={{ color: primaryColor }}>Company Name</h1>
                    {config.showAddress && <p className="text-[9px] text-gray-400 uppercase tracking-widest leading-tight">Software Technology Park, Islamabad</p>}
                    {config.showNTN && <p className="text-[9px] text-gray-400 font-bold">NTN: 1234567-8</p>}
                 </div>
              </div>
              <div className="text-right">
                <h2 className="text-lg font-black uppercase tracking-widest text-gray-800">Payslip</h2>
                <p className="text-xs font-bold italic" style={{ color: primaryColor }}>January 2025 Cycle</p>
              </div>
            </div>

            {/* PREVIEW EMPLOYEE INFO */}
            <div className="grid grid-cols-2 gap-8 text-[11px] leading-relaxed">
               <div className="space-y-4">
                  <div>
                    <p className="text-[8px] font-black text-gray-400 uppercase">Employee Name</p>
                    <p className="font-black text-gray-800 text-sm">SAMPLE EMPLOYEE NAME</p>
                  </div>
                  {config.showDesignation && (
                    <div>
                      <p className="text-[8px] font-black text-gray-400 uppercase">Designation</p>
                      <p className="font-bold text-gray-700">Senior Professional Lead (G18)</p>
                    </div>
                  )}
               </div>
               <div className="border-l pl-8 space-y-4">
                  {config.showDept && (
                    <div>
                      <p className="text-[8px] font-black text-gray-400 uppercase">Department</p>
                      <p className="font-bold text-gray-700">Engineering & Technology</p>
                    </div>
                  )}
                  {config.showBank && (
                    <div>
                      <p className="text-[8px] font-black text-gray-400 uppercase">Bank Detail</p>
                      <p className="font-mono font-bold text-gray-700">HBL • **** 7890</p>
                    </div>
                  )}
               </div>
            </div>

            {/* PREVIEW TABLES */}
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="text-[9px] font-black uppercase tracking-widest text-green-600 border-b pb-1">Earnings</h4>
                <div className="space-y-2 text-xs">
                   <div className="flex justify-between"><span>Basic Salary</span><span className="font-mono font-bold">107,500</span></div>
                   <div className="flex justify-between"><span>House Rent</span><span className="font-mono font-bold">48,375</span></div>
                   <div className="flex justify-between"><span>Utilities</span><span className="font-mono font-bold">10,750</span></div>
                   <div className="flex justify-between font-black text-gray-800 pt-2 border-t"><span>Gross Total</span><span className="font-mono">166,625</span></div>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="text-[9px] font-black uppercase tracking-widest text-red-600 border-b pb-1">Deductions</h4>
                <div className="space-y-2 text-xs">
                   <div className="flex justify-between"><span>Income Tax</span><span className="font-mono font-bold">22,500</span></div>
                   <div className="flex justify-between"><span>PF Share</span><span className="font-mono font-bold">7,500</span></div>
                   <div className="flex justify-between font-black text-red-600 pt-2 border-t"><span>Total Deducts</span><span className="font-mono">(30,000)</span></div>
                </div>
              </div>
            </div>

            {/* PREVIEW NET PAY BLOCK */}
            <div className="p-6 rounded-2xl flex items-center justify-between text-white shadow-xl" style={{ backgroundColor: primaryColor }}>
               <div>
                  <p className="text-[9px] font-black text-white/50 uppercase tracking-widest mb-1">Net Payable Amount</p>
                  <p className="text-3xl font-black text-accent tracking-tighter">PKR 136,625</p>
               </div>
               <div className="text-right">
                  <p className="text-[9px] font-medium text-white/70 italic max-w-[140px]">"One Hundred Thirty Six Thousand Six Hundred Twenty Five Only"</p>
               </div>
            </div>

            {/* PREVIEW YTD / CTC */}
            {(config.showYTD || config.showEmployerShare) && (
               <div className="grid grid-cols-2 gap-8">
                  {config.showYTD && (
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                       <p className="text-[8px] font-black text-gray-400 uppercase mb-2">Year-to-Date (YTD)</p>
                       <div className="grid grid-cols-2 gap-4 text-[10px]">
                          <div className="flex justify-between"><span className="text-gray-400">Tax Paid:</span><span className="font-bold">185K</span></div>
                          <div className="flex justify-between"><span className="text-gray-400">Total Gross:</span><span className="font-bold">1.5M</span></div>
                       </div>
                    </div>
                  )}
                  {config.showEmployerShare && (
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                       <p className="text-[8px] font-black text-gray-400 uppercase mb-2">Employer Shares</p>
                       <div className="grid grid-cols-2 gap-4 text-[10px]">
                          <div className="flex justify-between"><span className="text-gray-400">PF ER:</span><span className="font-bold">7.5K</span></div>
                          <div className="flex justify-between"><span className="text-gray-400">EOBI ER:</span><span className="font-bold">540</span></div>
                       </div>
                    </div>
                  )}
               </div>
            )}

            {/* PREVIEW FOOTER */}
            <div className="flex-1" />
            <div className="pt-8 border-t border-dashed flex justify-between items-end border-gray-200">
               <div className="space-y-4">
                  <div className="flex items-center gap-3">
                     <ShieldCheck size={18} className="text-green-500" />
                     <p className="text-[8px] text-gray-400 font-medium leading-relaxed max-w-[200px] uppercase">
                       Compliance Verified against FBR Slabs 2024-2025. System generated document.
                     </p>
                  </div>
                  {config.showSignature && (
                    <div>
                       <p className="font-serif text-xl opacity-50 italic" style={{ color: primaryColor }}>Authorized Signatory</p>
                       <div className="h-[1px] w-24 bg-gray-100" />
                    </div>
                  )}
               </div>
               {config.showQR && (
                  <div className="text-right space-y-2">
                     <div className="w-16 h-16 bg-gray-50 border rounded flex items-center justify-center text-gray-300 ml-auto">
                        <QrCode size={40} strokeWidth={1} />
                     </div>
                     <p className="text-[7px] font-mono text-gray-400 uppercase">Verif Code: PR-25-A99</p>
                  </div>
               )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

const ToggleItem: React.FC<{ label: string; active: boolean; onClick: () => void }> = ({ label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${active ? 'bg-primary/5 border-primary/20 text-primary' : 'bg-white border-gray-100 text-gray-400'}`}
  >
    <span className="text-xs font-bold">{label}</span>
    <div className={`w-8 h-4 rounded-full relative transition-all ${active ? 'bg-primary' : 'bg-gray-200'}`}>
      <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${active ? 'right-0.5' : 'left-0.5'}`} />
    </div>
  </button>
);
