
import React, { useState } from 'react';
import { 
  Building2, ShieldCheck, Download, CheckCircle2, 
  FileText, Landmark, Wallet, Globe, Info, 
  ArrowRight, Search, Filter, ShieldAlert,
  ChevronRight, Smartphone, Building, BookOpen
} from 'lucide-react';

type BankCategory = 'COMMERCIAL' | 'ISLAMIC' | 'MOBILE';

interface BankSpec {
  id: string;
  name: string;
  category: BankCategory;
  fileType: 'TXT' | 'CSV' | 'XLSX';
  maxRecords: string;
  extension: string;
  isReady: boolean;
  specLink: string;
  structure: {
    header: string;
    detail: string;
    footer: string;
  };
}

const BANK_SPECS: BankSpec[] = [
  { 
    id: 'HBL', name: 'Habib Bank Limited (HBL)', category: 'COMMERCIAL', fileType: 'TXT', maxRecords: 'Unlimited', extension: '.txt', isReady: true, specLink: '#',
    structure: { header: '01[BranchCode][Date][BatchID]', detail: '02[AccountNo][Amount][EmpName]', footer: '99[Count][TotalAmount]' }
  },
  { 
    id: 'MCB', name: 'MCB Bank Limited', category: 'COMMERCIAL', fileType: 'CSV', maxRecords: '5,000', extension: '.csv', isReady: true, specLink: '#',
    structure: { header: 'Date,CompanyID,Currency', detail: 'EmpID,IBAN,Amount,Remarks', footer: 'EOF,TotalCount,TotalSum' }
  },
  { 
    id: 'UBL', name: 'United Bank Limited (UBL)', category: 'COMMERCIAL', fileType: 'XLSX', maxRecords: '10,000', extension: '.xlsx', isReady: true, specLink: '#',
    structure: { header: 'Excel Sheet 1 - Row 1', detail: 'Col A: IBAN, Col B: PKR Amount', footer: 'N/A (Sheet Summary)' }
  },
  { 
    id: 'MEEZAN', name: 'Meezan Bank', category: 'ISLAMIC', fileType: 'TXT', maxRecords: 'Unlimited', extension: '.txt', isReady: true, specLink: '#',
    structure: { header: 'HDR[Date][VoucherRef]', detail: 'DTL[IBAN][Amount][Ccy]', footer: 'FTR[Count][Sum]' }
  },
  { 
    id: 'JAZZCASH', name: 'JazzCash Corporate', category: 'MOBILE', fileType: 'CSV', maxRecords: '2,500', extension: '.csv', isReady: true, specLink: '#',
    structure: { header: 'BatchHeader,VendorID', detail: 'MobileNumber,Amount,CNIC', footer: 'BatchFooter,Total' }
  },
  { 
    id: 'EASYPAISA', name: 'Easypaisa B2B', category: 'MOBILE', fileType: 'XLSX', maxRecords: '5,000', extension: '.xlsx', isReady: true, specLink: '#',
    structure: { header: 'N/A', detail: 'Mobile, Amount, EmployeeName', footer: 'TotalCount' }
  },
  { 
    id: 'BAFL', name: 'Bank Alfalah (BAFL)', category: 'COMMERCIAL', fileType: 'TXT', maxRecords: 'Unlimited', extension: '.txt', isReady: true, specLink: '#',
    structure: { header: 'BAFL01[Date][Ref]', detail: 'BAFL02[Account][PKR][Name]', footer: 'BAFL99[Sum]' }
  }
];

export const PakistanBankLibrary: React.FC = () => {
  const [selectedBank, setSelectedBank] = useState<BankSpec>(BANK_SPECS[0]);
  const [activeCat, setActiveCat] = useState<'ALL' | BankCategory>('ALL');

  const filteredBanks = BANK_SPECS.filter(b => activeCat === 'ALL' || b.category === activeCat);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary text-white rounded-2xl shadow-xl shadow-primary/20">
            <BookOpen size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 tracking-tight flex items-center gap-2">
              Pakistan Bank Library
              <span className="bg-green-100 text-green-600 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest border border-green-100">Local Standard [PK]</span>
            </h2>
            <p className="text-sm text-gray-500 font-medium">Pre-configured bank disbursement formats as per SBP guidelines</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Bank Selection */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden flex flex-col">
            <div className="p-4 border-b bg-gray-50/50 flex gap-1">
              {['ALL', 'COMMERCIAL', 'ISLAMIC', 'MOBILE'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCat(cat as any)}
                  className={`flex-1 py-2 rounded-xl text-[9px] font-black uppercase transition-all ${
                    activeCat === cat ? 'bg-primary text-white shadow-md' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {cat === 'COMMERCIAL' ? 'Comm' : cat === 'ISLAMIC' ? 'Shariah' : cat === 'MOBILE' ? 'Wallet' : 'All'}
                </button>
              ))}
            </div>
            <div className="max-h-[600px] overflow-y-auto custom-scrollbar p-2 space-y-1">
              {filteredBanks.map((bank) => (
                <button
                  key={bank.id}
                  onClick={() => setSelectedBank(bank)}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all group ${
                    selectedBank.id === bank.id ? 'bg-primary/5 border border-primary/20' : 'hover:bg-gray-50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      selectedBank.id === bank.id ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400 group-hover:bg-white transition-colors'
                    }`}>
                      {bank.category === 'MOBILE' ? <Smartphone size={16}/> : bank.category === 'ISLAMIC' ? <Building size={16}/> : <Building2 size={16}/>}
                    </div>
                    <div className="text-left">
                      <p className={`text-xs font-black ${selectedBank.id === bank.id ? 'text-primary' : 'text-gray-700'}`}>{bank.name}</p>
                      <p className="text-[9px] font-bold text-gray-400 uppercase">{bank.category} • {bank.fileType}</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className={selectedBank.id === bank.id ? 'text-primary' : 'text-gray-300'} />
                </button>
              ))}
            </div>
          </div>

          <div className="p-5 bg-indigo-50 border border-indigo-100 rounded-3xl flex items-start gap-4 shadow-sm">
            <ShieldCheck size={24} className="text-indigo-600 shrink-0" />
            <div className="space-y-1">
              <h5 className="text-sm font-black text-indigo-900 uppercase leading-none tracking-tight">SBP Compliance</h5>
              <p className="text-[10px] text-indigo-700 leading-relaxed font-medium uppercase">
                All formats are verified against the <strong>State Bank of Pakistan (SBP)</strong> bulk payment automation standards 2024.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Format Detail */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden animate-in slide-in-from-right-4 duration-500">
            <div className="p-8 border-b bg-gray-50/30 flex items-center justify-between">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-white border border-gray-200 flex items-center justify-center text-primary shadow-sm font-black text-xl">
                  {selectedBank.id.substring(0, 3)}
                </div>
                <div>
                  <h3 className="text-xl font-black text-gray-800">{selectedBank.name}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[10px] font-black text-primary bg-primary/5 px-2 py-0.5 rounded border border-primary/10 uppercase tracking-widest">{selectedBank.category}</span>
                    <span className="text-[10px] font-black text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-100 uppercase tracking-widest">Verified Layout</span>
                  </div>
                </div>
              </div>
              <button className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95">
                <CheckCircle2 size={16} /> Use This Format
              </button>
            </div>

            <div className="p-8 space-y-10">
              {/* Technical Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <TechItem label="File Format" val={selectedBank.fileType} />
                <TechItem label="Extension" val={selectedBank.extension} />
                <TechItem label="Max Capacity" val={selectedBank.maxRecords} />
                <TechItem label="Encryption" val="AES-256 Support" />
              </div>

              {/* Layout Map */}
              <div className="space-y-6">
                <h4 className="text-xs font-black uppercase tracking-[2px] text-gray-400 flex items-center gap-2">
                  <FileText size={16} /> Data Segment Protocols
                </h4>
                <div className="space-y-4">
                   <div className="group">
                      <p className="text-[9px] font-black text-gray-400 uppercase mb-2 ml-4">Header Record (Static/Dynamic)</p>
                      <div className="bg-gray-900 rounded-2xl p-5 font-mono text-[11px] text-green-400 shadow-inner group-hover:text-green-300 transition-colors">
                        {selectedBank.structure.header}
                      </div>
                   </div>
                   <div className="group">
                      <p className="text-[9px] font-black text-gray-400 uppercase mb-2 ml-4">Detail Record (Employee-wise)</p>
                      <div className="bg-gray-900 rounded-2xl p-5 font-mono text-[11px] text-blue-400 shadow-inner group-hover:text-blue-300 transition-colors">
                        {selectedBank.structure.detail}
                      </div>
                   </div>
                   <div className="group">
                      <p className="text-[9px] font-black text-gray-400 uppercase mb-2 ml-4">Footer Record (Checksum)</p>
                      <div className="bg-gray-900 rounded-2xl p-5 font-mono text-[11px] text-orange-400 shadow-inner group-hover:text-orange-300 transition-colors">
                        {selectedBank.structure.footer}
                      </div>
                   </div>
                </div>
              </div>

              {/* Validation Rules */}
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Required Validation Rules</h4>
                <div className="grid grid-cols-2 gap-y-3">
                  <RuleItem label="IBAN Verification (24 chars)" />
                  <RuleItem label="Checksum Hash Integrity" />
                  <RuleItem label="Leading Zero Preservation" />
                  <RuleItem label="ASCII Character Set only" />
                </div>
              </div>

              {/* Action Footer */}
              <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Info size={16} className="text-primary" />
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Sample File (10 records) Available for testing</p>
                </div>
                <div className="flex gap-4">
                  <button className="text-[10px] font-black text-primary uppercase hover:underline flex items-center gap-1">
                    <Download size={14} /> Download Tech Spec
                  </button>
                  <button className="text-[10px] font-black text-primary uppercase hover:underline flex items-center gap-1">
                    <Globe size={14} /> Bank Portal URL
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-3">
                <div className="flex items-center gap-3 text-orange-500">
                   <ShieldAlert size={20} />
                   <h4 className="text-xs font-black uppercase">Validation Warning</h4>
                </div>
                <p className="text-[11px] text-gray-500 leading-relaxed font-medium">
                  {selectedBank.id === 'HBL' ? 'HBL requires branch codes to be formatted as exactly 4 digits. System will auto-pad with leading zeros.' : 'IBAN checksum will be computed automatically according to ISO 13616 standard.'}
                </p>
             </div>
             <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-green-50 text-green-600 rounded-lg"><CheckCircle2 size={16}/></div>
                   <p className="text-[10px] font-black text-gray-700 uppercase">Automation Ready</p>
                </div>
                <button className="text-[10px] font-black text-primary uppercase flex items-center gap-1">
                   API Setup <ArrowRight size={12}/>
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TechItem = ({ label, val }: { label: string, val: string }) => (
  <div className="space-y-1">
    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
    <p className="text-sm font-black text-gray-800">{val}</p>
  </div>
);

const RuleItem = ({ label }: { label: string }) => (
  <div className="flex items-center gap-2">
    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
    <span className="text-[10px] font-bold text-gray-600">{label}</span>
  </div>
);
