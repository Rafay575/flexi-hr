
import React, { useState } from 'react';
import { 
  User, Calendar, CheckCircle, ChevronRight, ChevronLeft, Search, 
  AlertTriangle, FileText, Check, Loader2, Briefcase, 
  ClipboardList, AlertCircle, X
} from 'lucide-react';
import { Employee, ExitRequest, ExitType } from '../types';

interface ExitWizardProps {
  employees: Employee[];
  onCancel: () => void;
  onSubmit: (request: ExitRequest) => void;
}

const STEPS = [
  { id: 'select', label: 'Select Employee', icon: User },
  { id: 'details', label: 'Exit Details', icon: FileText },
  { id: 'checklist', label: 'Clearance', icon: ClipboardList },
  { id: 'review', label: 'Review', icon: CheckCircle },
];

const EXIT_TYPES: ExitType[] = ['Resignation', 'Termination', 'Retirement', 'Contract End'];
const EXIT_REASONS = [
    'Better Opportunity', 'Relocation', 'Higher Studies', 'Personal Reasons', 
    'Health Issues', 'Career Change', 'Compensation', 'Work Environment', 'Involuntary'
];

const CHECKLIST_ITEMS = [
    'Laptop & Charger', 'ID Card / Access Card', 'Health Insurance Card', 
    'Sim Card / Corporate Phone', 'Parking Tag', 'Resignation Letter (Signed)',
    'NDA / IP Agreement'
];

const ExitWizard: React.FC<ExitWizardProps> = ({ employees, onCancel, onSubmit }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    type: 'Resignation' as ExitType,
    reasonCategory: '',
    remarks: '',
    requestDate: new Date().toISOString().split('T')[0],
    lastWorkingDay: '',
    noticePeriodServed: true,
    checklist: [] as string[]
  });

  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.employeeId.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 8);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(prev => prev - 1);
  };

  const toggleChecklistItem = (item: string) => {
      setFormData(prev => ({
          ...prev,
          checklist: prev.checklist.includes(item) 
            ? prev.checklist.filter(i => i !== item)
            : [...prev.checklist, item]
      }));
  };

  const handleSubmit = () => {
    if (!selectedEmployee) return;
    setIsSubmitting(true);

    setTimeout(() => {
        const newRequest: ExitRequest = {
            id: `ex-new-${Date.now()}`,
            employeeId: selectedEmployee.employeeId,
            name: selectedEmployee.name,
            avatar: selectedEmployee.avatar,
            role: selectedEmployee.role,
            department: selectedEmployee.department,
            type: formData.type,
            reason: formData.reasonCategory,
            requestDate: new Date(formData.requestDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            lastWorkingDay: new Date(formData.lastWorkingDay).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            status: 'Requested',
            interviewStatus: 'Pending',
            assetsReturned: false
        };
        onSubmit(newRequest);
    }, 1500);
  };

  const isStepValid = () => {
      if (currentStep === 0) return !!selectedEmployee;
      if (currentStep === 1) return !!formData.type && !!formData.reasonCategory && !!formData.lastWorkingDay;
      return true;
  };

  // --- RENDERERS ---

  const renderStepContent = () => {
      const inputClass = "w-full px-4 py-2.5 bg-white border border-neutral-border rounded-lg text-sm text-neutral-primary focus:outline-none focus:ring-2 focus:ring-flexi-primary/20 focus:border-flexi-primary transition-all placeholder:text-neutral-muted";
      const labelClass = "block text-label font-medium text-neutral-secondary mb-1.5";

      switch(currentStep) {
          case 0: // SELECT EMPLOYEE
             return (
                 <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                     <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-muted w-5 h-5" />
                        <input 
                            autoFocus
                            type="text" 
                            placeholder="Search employee by name or ID..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 rounded-xl border border-neutral-border shadow-sm text-lg focus:ring-2 focus:ring-flexi-primary focus:border-transparent outline-none placeholder:text-neutral-muted"
                        />
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredEmployees.map(emp => (
                            <div 
                                key={emp.id}
                                onClick={() => setSelectedEmployee(emp)}
                                className={`
                                    cursor-pointer p-4 rounded-xl border transition-all relative flex items-center gap-4
                                    ${selectedEmployee?.id === emp.id 
                                        ? 'bg-flexi-light/30 border-flexi-primary shadow-md ring-1 ring-flexi-primary' 
                                        : 'bg-white border-neutral-border hover:border-flexi-primary/50 hover:shadow-sm'
                                    }
                                `}
                            >
                                <img src={emp.avatar} alt={emp.name} className="w-12 h-12 rounded-full border border-neutral-border object-cover" />
                                <div className="min-w-0">
                                    <h4 className="font-bold text-neutral-primary text-sm truncate">{emp.name}</h4>
                                    <p className="text-xs text-neutral-secondary truncate">{emp.role}</p>
                                    <p className="text-[10px] text-neutral-muted font-mono mt-0.5">{emp.employeeId}</p>
                                </div>
                                {selectedEmployee?.id === emp.id && (
                                    <div className="absolute top-3 right-3 text-flexi-primary">
                                        <CheckCircle className="w-5 h-5 fill-flexi-primary text-white" />
                                    </div>
                                )}
                            </div>
                        ))}
                     </div>
                 </div>
             );

          case 1: // EXIT DETAILS
             return (
                 <div className="space-y-6 animate-in fade-in slide-in-from-right-4 max-w-2xl mx-auto">
                     
                     {/* Employee Summary Card */}
                     {selectedEmployee && (
                        <div className="flex items-center gap-4 p-4 bg-neutral-page/50 border border-neutral-border rounded-xl mb-6">
                            <img src={selectedEmployee.avatar} alt="" className="w-12 h-12 rounded-full border border-white shadow-sm" />
                            <div>
                                <h4 className="font-bold text-neutral-primary">{selectedEmployee.name}</h4>
                                <p className="text-xs text-neutral-secondary">{selectedEmployee.role} • {selectedEmployee.department}</p>
                            </div>
                        </div>
                     )}

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="space-y-0.5">
                             <label className={labelClass}>Exit Type</label>
                             <select 
                                value={formData.type}
                                onChange={(e) => setFormData({...formData, type: e.target.value as ExitType})}
                                className={`${inputClass} appearance-none bg-white`}
                             >
                                {EXIT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                             </select>
                         </div>
                         
                         <div className="space-y-0.5">
                             <label className={labelClass}>Reason Category</label>
                             <select 
                                value={formData.reasonCategory}
                                onChange={(e) => setFormData({...formData, reasonCategory: e.target.value})}
                                className={`${inputClass} appearance-none bg-white`}
                             >
                                <option value="">Select Reason</option>
                                {EXIT_REASONS.map(r => <option key={r} value={r}>{r}</option>)}
                             </select>
                         </div>

                         <div className="space-y-0.5">
                             <label className={labelClass}>Last Working Day</label>
                             <div className="relative">
                                 <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-muted w-4 h-4" />
                                 <input 
                                    type="date"
                                    value={formData.lastWorkingDay}
                                    onChange={(e) => setFormData({...formData, lastWorkingDay: e.target.value})}
                                    className={`${inputClass} pl-10`}
                                 />
                             </div>
                         </div>

                         <div className="space-y-0.5">
                             <label className={labelClass}>Notice Period</label>
                             <div className="flex items-center gap-4 mt-2">
                                 <label className="flex items-center gap-2 cursor-pointer">
                                     <input 
                                        type="radio" 
                                        checked={formData.noticePeriodServed}
                                        onChange={() => setFormData({...formData, noticePeriodServed: true})}
                                        className="text-flexi-primary focus:ring-flexi-primary"
                                     />
                                     <span className="text-sm text-neutral-primary">Being Served</span>
                                 </label>
                                 <label className="flex items-center gap-2 cursor-pointer">
                                     <input 
                                        type="radio" 
                                        checked={!formData.noticePeriodServed}
                                        onChange={() => setFormData({...formData, noticePeriodServed: false})}
                                        className="text-flexi-primary focus:ring-flexi-primary"
                                     />
                                     <span className="text-sm text-neutral-primary">Waived Off / Shortfall</span>
                                 </label>
                             </div>
                         </div>
                     </div>

                     <div className="space-y-0.5">
                         <label className={labelClass}>Remarks / Detailed Reason</label>
                         <textarea 
                            rows={4}
                            value={formData.remarks}
                            onChange={(e) => setFormData({...formData, remarks: e.target.value})}
                            placeholder="Provide any additional context regarding this exit..."
                            className={`${inputClass} resize-none`}
                         ></textarea>
                     </div>
                 </div>
             );

          case 2: // CHECKLIST
             return (
                 <div className="space-y-6 animate-in fade-in slide-in-from-right-4 max-w-2xl mx-auto">
                     <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex gap-3">
                         <AlertCircle className="w-5 h-5 text-flexi-primary shrink-0" />
                         <div>
                             <h4 className="text-sm font-bold text-neutral-primary">Preliminary Checklist</h4>
                             <p className="text-xs text-neutral-secondary mt-1">Select items that are applicable for this employee's clearance process.</p>
                         </div>
                     </div>

                     <div className="bg-white border border-neutral-border rounded-xl overflow-hidden">
                         {CHECKLIST_ITEMS.map((item, idx) => {
                             const isChecked = formData.checklist.includes(item);
                             return (
                                 <div 
                                    key={item}
                                    onClick={() => toggleChecklistItem(item)}
                                    className={`
                                        flex items-center gap-4 p-4 border-b last:border-0 cursor-pointer transition-colors
                                        ${isChecked ? 'bg-flexi-light/20' : 'hover:bg-neutral-page'}
                                    `}
                                 >
                                     <div className={`
                                        w-5 h-5 rounded border flex items-center justify-center transition-all
                                        ${isChecked ? 'bg-flexi-primary border-flexi-primary' : 'border-neutral-300 bg-white'}
                                     `}>
                                         {isChecked && <Check className="w-3.5 h-3.5 text-white" />}
                                     </div>
                                     <span className={`text-sm font-medium ${isChecked ? 'text-neutral-primary' : 'text-neutral-secondary'}`}>
                                         {item}
                                     </span>
                                 </div>
                             );
                         })}
                     </div>
                 </div>
             );

          case 3: // REVIEW
             if (!selectedEmployee) return null;
             return (
                 <div className="space-y-6 animate-in fade-in slide-in-from-right-4 max-w-2xl mx-auto">
                     <div className="bg-white border border-neutral-border rounded-xl overflow-hidden shadow-sm">
                         <div className="p-4 bg-neutral-page/50 border-b border-neutral-border flex items-center gap-3">
                             <div className="w-10 h-10 rounded-full bg-state-error text-white flex items-center justify-center font-bold shadow-sm">
                                 <AlertTriangle className="w-5 h-5" />
                             </div>
                             <div>
                                 <h3 className="text-lg font-bold text-neutral-primary">Confirm Exit Request</h3>
                                 <p className="text-xs text-neutral-secondary">This action will initiate the offboarding workflow.</p>
                             </div>
                         </div>
                         
                         <div className="p-6 space-y-6">
                             <div className="grid grid-cols-2 gap-6">
                                 <div>
                                     <span className="text-xs font-bold text-neutral-secondary uppercase tracking-wider block mb-1">Employee</span>
                                     <div className="flex items-center gap-2">
                                         <img src={selectedEmployee.avatar} className="w-6 h-6 rounded-full border border-neutral-border" alt="" />
                                         <span className="text-sm font-bold text-neutral-primary">{selectedEmployee.name}</span>
                                     </div>
                                 </div>
                                 <div>
                                     <span className="text-xs font-bold text-neutral-secondary uppercase tracking-wider block mb-1">Exit Type</span>
                                     <span className={`text-sm font-bold px-2 py-0.5 rounded border ${
                                         formData.type === 'Resignation' ? 'bg-blue-50 text-flexi-primary border-blue-100' : 'bg-red-50 text-state-error border-red-100'
                                     }`}>
                                         {formData.type}
                                     </span>
                                 </div>
                                 <div>
                                     <span className="text-xs font-bold text-neutral-secondary uppercase tracking-wider block mb-1">Last Working Day</span>
                                     <span className="text-sm font-bold text-neutral-primary">
                                         {formData.lastWorkingDay ? new Date(formData.lastWorkingDay).toLocaleDateString(undefined, { dateStyle: 'long'}) : '-'}
                                     </span>
                                 </div>
                                 <div>
                                     <span className="text-xs font-bold text-neutral-secondary uppercase tracking-wider block mb-1">Reason</span>
                                     <span className="text-sm font-medium text-neutral-primary">{formData.reasonCategory}</span>
                                 </div>
                             </div>

                             {formData.checklist.length > 0 && (
                                 <div className="bg-neutral-page/30 rounded-lg p-4 border border-neutral-border">
                                     <span className="text-xs font-bold text-neutral-secondary uppercase tracking-wider block mb-2">Required Clearance Items</span>
                                     <div className="flex flex-wrap gap-2">
                                         {formData.checklist.map(item => (
                                             <span key={item} className="text-xs bg-white border border-neutral-border px-2 py-1 rounded-md text-neutral-600">
                                                 {item}
                                             </span>
                                         ))}
                                     </div>
                                 </div>
                             )}

                             {formData.remarks && (
                                <div>
                                    <span className="text-xs font-bold text-neutral-secondary uppercase tracking-wider block mb-2">Remarks</span>
                                    <p className="text-sm text-neutral-primary italic bg-neutral-page/20 p-3 rounded-lg border border-neutral-border">
                                        "{formData.remarks}"
                                    </p>
                                </div>
                             )}
                         </div>
                     </div>
                 </div>
             );
      }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-border overflow-hidden min-h-[600px] flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-neutral-border flex items-center justify-between bg-neutral-page/20">
          <div>
              <h2 className="text-xl font-bold text-neutral-primary">Initiate Employee Exit</h2>
              <p className="text-sm text-neutral-secondary mt-1">Start the offboarding process for an employee.</p>
          </div>
          <button 
            onClick={onCancel}
            className="text-sm font-medium text-neutral-secondary hover:text-neutral-primary px-3 py-1.5 rounded-lg hover:bg-neutral-border/50 transition-colors"
          >
              Cancel
          </button>
      </div>

      {/* Stepper */}
      <div className="px-6 py-4 bg-white border-b border-neutral-border">
          <div className="flex items-center justify-between max-w-3xl mx-auto">
              {STEPS.map((step, idx) => {
                  const isActive = idx === currentStep;
                  const isCompleted = idx < currentStep;

                  return (
                      <div key={step.id} className="flex flex-col items-center gap-2 relative z-10 group cursor-default">
                          <div 
                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border-2
                                ${isActive ? 'bg-flexi-primary border-flexi-primary text-white shadow-lg scale-110' : 
                                  isCompleted ? 'bg-green-50 border-green-200 text-state-success' : 
                                  'bg-white border-neutral-border text-neutral-muted'}
                            `}
                          >
                              {isCompleted ? <Check className="w-5 h-5" /> : <step.icon className="w-5 h-5" />}
                          </div>
                          <span className={`text-xs font-bold uppercase tracking-wider transition-colors ${isActive ? 'text-flexi-primary' : 'text-neutral-muted'}`}>
                              {step.label}
                          </span>
                      </div>
                  );
              })}
              <div className="absolute top-[88px] left-0 w-full h-0.5 bg-neutral-border -z-0 hidden md:block"></div> 
          </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 md:p-10 bg-neutral-page/10">
          {renderStepContent()}
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-neutral-border bg-white flex justify-between items-center">
          <button 
             onClick={handleBack}
             disabled={currentStep === 0 || isSubmitting}
             className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold border transition-all ${
                 currentStep === 0 ? 'opacity-0 pointer-events-none' : 'border-neutral-border text-neutral-secondary hover:bg-neutral-page hover:text-neutral-primary'
             }`}
          >
              <ChevronLeft className="w-4 h-4" /> Back
          </button>

          <button 
             onClick={handleNext}
             disabled={!isStepValid() || isSubmitting}
             className="flex items-center gap-2 px-8 py-2.5 bg-flexi-primary text-white text-sm font-bold rounded-lg hover:bg-flexi-secondary shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
              {isSubmitting ? (
                  <>Processing <Loader2 className="w-4 h-4 animate-spin" /></>
              ) : currentStep === STEPS.length - 1 ? (
                  <>Submit Request <CheckCircle className="w-4 h-4" /></>
              ) : (
                  <>Continue <ChevronRight className="w-4 h-4" /></>
              )}
          </button>
      </div>
    </div>
  );
};

export default ExitWizard;
