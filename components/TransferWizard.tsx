
import React, { useState } from 'react';
import { 
  User, Building2, MapPin, Briefcase, Calendar, CheckCircle, 
  ChevronRight, ChevronLeft, Search, ArrowRight, ArrowRightLeft, 
  FileText, Users, Loader2, Check, Award
} from 'lucide-react';
import { Employee, Transfer } from '../types';
import { DEPARTMENTS, LOCATIONS, GRADES, ROLES } from '../mockData';

interface TransferWizardProps {
  employees: Employee[];
  onCancel: () => void;
  onSubmit: (transfer: Transfer) => void;
}

const STEPS = [
  { id: 'select', label: 'Select Employee', icon: Users },
  { id: 'details', label: 'Transfer Details', icon: ArrowRightLeft },
  { id: 'date', label: 'Timeline', icon: Calendar },
  { id: 'review', label: 'Review', icon: CheckCircle },
];

const TRANSFER_TYPES = ['Department Transfer', 'Location Change', 'Role Change', 'Promotion'];

const TransferWizard: React.FC<TransferWizardProps> = ({ employees, onCancel, onSubmit }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    type: 'Department Transfer',
    newDepartment: '',
    newRole: '',
    newLocation: '',
    newManager: '',
    newGrade: '',
    effectiveDate: '',
    reason: ''
  });

  // Derived State
  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.employeeId.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 8); // Limit to 8 for grid view

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

  const handleSubmit = () => {
    if (!selectedEmployee) return;
    setIsSubmitting(true);

    // Simulate API
    setTimeout(() => {
        const newTransfer: Transfer = {
            id: `tr-new-${Date.now()}`,
            employeeId: selectedEmployee.employeeId,
            name: selectedEmployee.name,
            avatar: selectedEmployee.avatar,
            department: formData.newDepartment || selectedEmployee.department,
            type: formData.type.includes('Promotion') ? 'Promotion' : 
                  formData.type.includes('Location') ? 'Location' : 
                  formData.type.includes('Role') ? 'Role' : 'Department',
            from: getFromValue(formData.type),
            to: getToValue(formData.type),
            initiator: 'Alexandra M.', // Current User
            requestDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            effectiveDate: new Date(formData.effectiveDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            status: 'Pending'
        };
        onSubmit(newTransfer);
    }, 1500);
  };

  // Helper to determine what to show in "From" based on type
  const getFromValue = (type: string) => {
      if (!selectedEmployee) return '';
      if (type.includes('Location')) return selectedEmployee.location;
      if (type.includes('Role') || type.includes('Promotion')) return selectedEmployee.role;
      return selectedEmployee.department;
  };

  // Helper to determine what to show in "To" based on type
  const getToValue = (type: string) => {
      if (type.includes('Location')) return formData.newLocation;
      if (type.includes('Role') || type.includes('Promotion')) return formData.newRole;
      return formData.newDepartment;
  };

  const isStepValid = () => {
      if (currentStep === 0) return !!selectedEmployee;
      if (currentStep === 1) {
          // Validation based on type
          if (formData.type === 'Department Transfer' && !formData.newDepartment) return false;
          if (formData.type === 'Location Change' && !formData.newLocation) return false;
          if ((formData.type === 'Role Change' || formData.type === 'Promotion') && (!formData.newRole || !formData.newGrade)) return false;
          return true;
      }
      if (currentStep === 2) return !!formData.effectiveDate && !!formData.reason;
      return true;
  };

  // Comparison Row Component
  const ComparisonCard = ({ 
      label, 
      oldValue, 
      newValue, 
      onChange, 
      options,
      icon: Icon 
  }: { 
      label: string; 
      oldValue: string; 
      newValue: string; 
      onChange: (val: string) => void;
      options?: string[];
      icon: any;
  }) => {
      const isChanged = newValue && newValue !== oldValue;
      
      return (
        <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center p-4 border border-neutral-border rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow">
            {/* OLD VALUE */}
            <div className="flex flex-col gap-1.5 p-3 rounded-lg bg-neutral-50 border border-neutral-200">
                <div className="flex items-center gap-2 text-xs font-bold text-neutral-400 uppercase tracking-wider">
                    <Icon className="w-3.5 h-3.5" /> Current {label}
                </div>
                <div className="text-sm font-semibold text-neutral-500 line-through decoration-neutral-300">
                    {oldValue || '-'}
                </div>
            </div>

            {/* ARROW */}
            <div className={`flex justify-center transition-colors ${isChanged ? 'text-flexi-primary' : 'text-neutral-300'}`}>
                <ArrowRight className="w-5 h-5" />
            </div>

            {/* NEW VALUE */}
            <div className={`flex flex-col gap-1.5 p-3 rounded-lg border transition-all ${
                isChanged 
                ? 'bg-blue-50/20 border-flexi-primary ring-1 ring-flexi-primary/20' 
                : 'bg-white border-neutral-border'
            }`}>
                <div className="flex items-center gap-2 text-xs font-bold text-flexi-primary uppercase tracking-wider">
                    New {label}
                </div>
                {options ? (
                    <select
                        value={newValue}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-full text-sm font-bold text-neutral-primary bg-transparent outline-none cursor-pointer"
                    >
                        <option value="">Select {label}</option>
                        {options.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                        ))}
                    </select>
                ) : (
                    <input 
                        type="text"
                        value={newValue}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={`Enter New ${label}`}
                        className="w-full text-sm font-bold text-neutral-primary bg-transparent outline-none placeholder:font-normal placeholder:text-neutral-400"
                    />
                )}
            </div>
        </div>
      );
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
                            placeholder="Search by name or employee ID..."
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
                     {filteredEmployees.length === 0 && (
                         <div className="text-center py-10 text-neutral-muted">
                             No employees found matching "{searchQuery}"
                         </div>
                     )}
                 </div>
             );

          case 1: // TRANSFER DETAILS
             if (!selectedEmployee) return null;
             return (
                 <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                     {/* Type Selector */}
                     <div>
                         <label className="text-sm font-bold text-neutral-secondary uppercase tracking-wider mb-3 block">Transfer Type</label>
                         <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                             {TRANSFER_TYPES.map(type => (
                                 <button
                                    key={type}
                                    onClick={() => setFormData(prev => ({ ...prev, type }))}
                                    className={`
                                        px-3 py-3 rounded-lg text-sm font-bold border transition-all
                                        ${formData.type === type 
                                            ? 'bg-flexi-primary text-white border-flexi-primary shadow-md' 
                                            : 'bg-white text-neutral-secondary border-neutral-border hover:bg-neutral-page'
                                        }
                                    `}
                                 >
                                     {type}
                                 </button>
                             ))}
                         </div>
                     </div>

                     {/* Selected Employee Summary */}
                     <div className="flex items-center gap-4 p-4 bg-neutral-page/50 border border-neutral-border rounded-xl">
                        <img src={selectedEmployee.avatar} alt="" className="w-12 h-12 rounded-full border border-white shadow-sm" />
                        <div>
                            <h4 className="font-bold text-neutral-primary">{selectedEmployee.name}</h4>
                            <p className="text-xs text-neutral-secondary">{selectedEmployee.role} • {selectedEmployee.department}</p>
                        </div>
                     </div>

                     {/* Comparison Cards Grid */}
                     <div className="space-y-4">
                        <ComparisonCard 
                            label="Designation"
                            icon={Briefcase}
                            oldValue={selectedEmployee.role}
                            newValue={formData.newRole}
                            onChange={(val) => setFormData({...formData, newRole: val})}
                        />

                        <ComparisonCard 
                            label="Department"
                            icon={Building2}
                            oldValue={selectedEmployee.department}
                            newValue={formData.newDepartment}
                            onChange={(val) => setFormData({...formData, newDepartment: val})}
                            options={DEPARTMENTS}
                        />

                        <ComparisonCard 
                            label="Grade"
                            icon={Award}
                            oldValue={selectedEmployee.grade}
                            newValue={formData.newGrade}
                            onChange={(val) => setFormData({...formData, newGrade: val})}
                            options={GRADES}
                        />

                        <ComparisonCard 
                            label="Manager"
                            icon={Users}
                            oldValue={selectedEmployee.manager || 'Alex Morgan'} // Fallback if mock data missing
                            newValue={formData.newManager}
                            onChange={(val) => setFormData({...formData, newManager: val})}
                        />

                        <ComparisonCard 
                            label="Location"
                            icon={MapPin}
                            oldValue={selectedEmployee.location}
                            newValue={formData.newLocation}
                            onChange={(val) => setFormData({...formData, newLocation: val})}
                            options={LOCATIONS}
                        />
                     </div>
                 </div>
             );

          case 2: // TIMELINE
             return (
                 <div className="space-y-6 animate-in fade-in slide-in-from-right-4 max-w-2xl mx-auto">
                     <div className="grid grid-cols-1 gap-6">
                         <div className="space-y-0.5">
                             <label className={labelClass}>Effective Date</label>
                             <div className="relative">
                                 <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-muted w-4 h-4" />
                                 <input 
                                    type="date"
                                    value={formData.effectiveDate}
                                    onChange={(e) => setFormData({...formData, effectiveDate: e.target.value})}
                                    className={`${inputClass} pl-10`}
                                 />
                             </div>
                         </div>
                         
                         <div className="space-y-0.5">
                             <label className={labelClass}>Reason for Transfer / Promotion</label>
                             <textarea 
                                rows={4}
                                value={formData.reason}
                                onChange={(e) => setFormData({...formData, reason: e.target.value})}
                                placeholder="Please provide a justification for this request..."
                                className={`${inputClass} resize-none`}
                             ></textarea>
                         </div>

                         <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 flex gap-3">
                             <div className="p-2 bg-white rounded-full text-flexi-primary shrink-0 h-fit">
                                 <FileText className="w-4 h-4" />
                             </div>
                             <div>
                                 <h4 className="text-sm font-bold text-neutral-primary">Supporting Documents</h4>
                                 <p className="text-xs text-neutral-secondary mt-1 mb-2">Attach any approval emails or performance reports.</p>
                                 <button className="text-xs font-bold text-flexi-primary hover:underline">
                                     + Upload Attachment
                                 </button>
                             </div>
                         </div>
                     </div>
                 </div>
             );
          
          case 3: // REVIEW
             if (!selectedEmployee) return null;
             return (
                 <div className="space-y-6 animate-in fade-in slide-in-from-right-4 max-w-2xl mx-auto">
                     <div className="bg-white border border-neutral-border rounded-xl overflow-hidden shadow-sm">
                         {/* Header */}
                         <div className="p-4 bg-neutral-page/50 border-b border-neutral-border flex items-center gap-3">
                             <div className="w-10 h-10 rounded-full bg-flexi-primary text-white flex items-center justify-center font-bold shadow-sm">
                                 <Check className="w-5 h-5" />
                             </div>
                             <div>
                                 <h3 className="text-lg font-bold text-neutral-primary">Review Transfer Request</h3>
                                 <p className="text-xs text-neutral-secondary">Please verify all details before submission.</p>
                             </div>
                         </div>
                         
                         <div className="p-6 space-y-6">
                             {/* Key Info Grid */}
                             <div className="grid grid-cols-2 gap-6">
                                 <div>
                                     <span className="text-xs font-bold text-neutral-secondary uppercase tracking-wider block mb-1">Employee</span>
                                     <div className="flex items-center gap-2">
                                         <img src={selectedEmployee.avatar} className="w-6 h-6 rounded-full border border-neutral-border" alt="" />
                                         <span className="text-sm font-bold text-neutral-primary">{selectedEmployee.name}</span>
                                     </div>
                                 </div>
                                 <div>
                                     <span className="text-xs font-bold text-neutral-secondary uppercase tracking-wider block mb-1">Transfer Type</span>
                                     <span className="text-sm font-bold text-flexi-primary bg-blue-50 px-2 py-0.5 rounded border border-blue-100">{formData.type}</span>
                                 </div>
                                 <div>
                                     <span className="text-xs font-bold text-neutral-secondary uppercase tracking-wider block mb-1">Initiated By</span>
                                     <div className="flex items-center gap-2">
                                         <div className="w-6 h-6 rounded-full bg-neutral-200 flex items-center justify-center text-[10px] font-bold text-neutral-600">A</div>
                                         <span className="text-sm font-medium text-neutral-primary">Alexandra M. (You)</span>
                                     </div>
                                 </div>
                                 <div>
                                     <span className="text-xs font-bold text-neutral-secondary uppercase tracking-wider block mb-1">Effective Date</span>
                                     <div className="flex items-center gap-2 text-neutral-primary font-bold text-sm">
                                         <Calendar className="w-4 h-4 text-neutral-muted" />
                                         {formData.effectiveDate ? new Date(formData.effectiveDate).toLocaleDateString(undefined, { dateStyle: 'long'}) : '-'}
                                     </div>
                                 </div>
                             </div>
                             
                             {/* Change Summary Box */}
                             <div className="bg-neutral-page/30 rounded-xl border border-neutral-border overflow-hidden">
                                 <div className="px-4 py-2 border-b border-neutral-border bg-neutral-50/50">
                                     <h4 className="text-xs font-bold text-neutral-muted uppercase tracking-wider flex items-center gap-2">
                                         <ArrowRightLeft className="w-3.5 h-3.5" /> Proposed Changes
                                     </h4>
                                 </div>
                                 <div className="p-4 space-y-3">
                                     {/* Helper to render change row */}
                                     {(['newDepartment', 'newRole', 'newGrade', 'newManager', 'newLocation'] as const).map(key => {
                                         const labelMap: Record<string, string> = {
                                             newDepartment: 'Department',
                                             newRole: 'Role',
                                             newGrade: 'Grade',
                                             newManager: 'Reporting Manager',
                                             newLocation: 'Location'
                                         };
                                         const oldKeyMap: Record<string, keyof Employee> = {
                                             newDepartment: 'department',
                                             newRole: 'role',
                                             newGrade: 'grade',
                                             newManager: 'manager',
                                             newLocation: 'location'
                                         };
                                         
                                         const newValue = formData[key];
                                         const oldValue = selectedEmployee[oldKeyMap[key] as keyof Employee];
                                         
                                         if (!newValue || newValue === oldValue) return null;

                                         return (
                                             <div key={key} className="grid grid-cols-[120px_1fr_auto_1fr] gap-4 items-center text-sm">
                                                 <span className="text-neutral-secondary font-medium">{labelMap[key]}</span>
                                                 <div className="bg-white border border-neutral-200 text-neutral-500 px-3 py-1.5 rounded-lg line-through decoration-neutral-300 text-center">
                                                     {oldValue || '-'}
                                                 </div>
                                                 <ArrowRight className="w-4 h-4 text-neutral-300" />
                                                 <div className="bg-blue-50 border border-blue-200 text-flexi-primary font-bold px-3 py-1.5 rounded-lg text-center shadow-sm">
                                                     {newValue}
                                                 </div>
                                             </div>
                                         );
                                     })}
                                 </div>
                             </div>
                             
                             {/* Justification */}
                             <div>
                                 <span className="text-xs font-bold text-neutral-secondary uppercase tracking-wider block mb-2">Justification / Remarks</span>
                                 <div className="p-3 bg-neutral-page/50 rounded-lg border border-neutral-border text-sm text-neutral-primary italic">
                                     "{formData.reason}"
                                 </div>
                             </div>
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
              <h2 className="text-xl font-bold text-neutral-primary">Initiate Transfer / Promotion</h2>
              <p className="text-sm text-neutral-secondary mt-1">Create a new internal movement request.</p>
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
              {/* Progress Line */}
              <div className="absolute top-[88px] left-0 w-full h-0.5 bg-neutral-border -z-0 hidden md:block"></div> 
              {/* Note: Absolute positioning for line is tricky with flex justify-between, omitted for simplicity in this responsive layout */}
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

export default TransferWizard;
