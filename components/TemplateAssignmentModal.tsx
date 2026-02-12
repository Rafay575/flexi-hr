// TemplateAssignmentModal.tsx
import React, { useState, useEffect } from 'react';
import { 
  X, Plus, Layers as LayersIcon, User, GraduationCap, 
  Briefcase, Building, Users2, Target, Save, 
  CheckCircle2, Calendar, AlertCircle, Clock, Hash
} from 'lucide-react';

interface SalaryComponent {
  id: string;
  name: string;
  type: 'EARNING' | 'DEDUCTION';
  calculationType: 'FIXED' | 'PERCENTAGE' | 'FORMULA';
  value: number;
  formula?: string;
  isTaxable: boolean;
  isStatutory: boolean;
  order: number;
}

export interface PayrollTemplate {
  id: string;
  name: string;
  description: string;
  type: 'STANDARD' | 'CUSTOM';
  category: 'EMPLOYEE' | 'GRADE' | 'DESIGNATION' | 'DIVISION' | 'GROUP';
  applicableTo: string[];
  salaryComponents: SalaryComponent[];
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface EmployeeProfile {
  id: string;
  name: string;
  avatar: string;
  dept: string;
  grade: string;
  designation: string;
  division: string;
  template: string | null;
  gross: number;
  overridesCount: number;
  bankInfo: boolean;
  statutoryInfo: boolean;
  status: string;
}

export interface AssignmentRule {
  id: string;
  templateId: string;
  assignmentType: 'EMPLOYEE' | 'GRADE' | 'DESIGNATION' | 'DIVISION' | 'GROUP';
  targetIds: string[];
  effectiveFrom: string;
  effectiveTo?: string;
  priority: number;
  isActive: boolean;
}

interface TemplateAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssign: (assignment: Partial<AssignmentRule>) => void;
  onCreateTemplate: () => void;
  employees: EmployeeProfile[];
  templates: PayrollTemplate[];
}

export const TemplateAssignmentModal: React.FC<TemplateAssignmentModalProps> = ({
  isOpen,
  onClose,
  onAssign,
  onCreateTemplate,
  employees,
  templates
}) => {
  const [step, setStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [assignmentType, setAssignmentType] = useState<'EMPLOYEE' | 'GRADE' | 'DESIGNATION' | 'DIVISION' | 'GROUP'>('EMPLOYEE');
  const [selectedTargets, setSelectedTargets] = useState<string[]>([]);
  const [effectiveFrom, setEffectiveFrom] = useState(new Date().toISOString().split('T')[0]);
  const [effectiveTo, setEffectiveTo] = useState('');
  const [priority, setPriority] = useState<number>(1);

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setSelectedTemplate('');
      setAssignmentType('EMPLOYEE');
      setSelectedTargets([]);
      setEffectiveFrom(new Date().toISOString().split('T')[0]);
      setEffectiveTo('');
      setPriority(1);
    }
  }, [isOpen]);

  const handleNext = () => {
    if (step === 1 && !selectedTemplate) {
      alert('Please select a template');
      return;
    }
    if (step === 2 && selectedTargets.length === 0) {
      alert('Please select at least one target');
      return;
    }
    setStep(step + 1);
  };

  const handleAssign = () => {
    const assignment: Partial<AssignmentRule> = {
      templateId: selectedTemplate,
      assignmentType,
      targetIds: selectedTargets,
      effectiveFrom,
      effectiveTo: effectiveTo || undefined,
      priority,
      isActive: true
    };
    onAssign(assignment);
    onClose();
  };

  if (!isOpen) return null;

  const selectedTemplateObj = templates.find(t => t.id === selectedTemplate);

  // Get targets based on assignment type
  const getTargets = () => {
    switch (assignmentType) {
      case 'EMPLOYEE':
        return employees.map(e => ({ 
          id: e.id, 
          name: e.name, 
          description: `${e.designation} • ${e.grade} • ${e.dept}`,
          icon: '👤',
          count: 1
        }));
      case 'GRADE':
        const grades = Array.from(new Set(employees.map(e => e.grade)));
        return grades.map(g => ({ 
          id: g, 
          name: g, 
          description: `Grade ${g}`,
          icon: '🎓',
          count: employees.filter(e => e.grade === g).length
        }));
      case 'DESIGNATION':
        const designations = Array.from(new Set(employees.map(e => e.designation)));
        return designations.map(d => ({ 
          id: d, 
          name: d, 
          description: `${employees.filter(e => e.designation === d).length} employees`,
          icon: '💼',
          count: employees.filter(e => e.designation === d).length
        }));
      case 'DIVISION':
        const divisions = Array.from(new Set(employees.map(e => e.division)));
        return divisions.map(d => ({ 
          id: d, 
          name: d, 
          description: `${employees.filter(e => e.division === d).length} employees`,
          icon: '🏢',
          count: employees.filter(e => e.division === d).length
        }));
      case 'GROUP':
        return [
          { 
            id: 'GROUP-ALL', 
            name: 'All Employees', 
            description: 'Assign to all employees in the organization',
            icon: '👥',
            count: employees.length
          },
          { 
            id: 'GROUP-FT', 
            name: 'Full-time Staff', 
            description: 'All full-time permanent employees',
            icon: '👨‍💼',
            count: Math.floor(employees.length * 0.8)
          },
          { 
            id: 'GROUP-PT', 
            name: 'Part-time Staff', 
            description: 'All part-time and contractual employees',
            icon: '👩‍💼',
            count: Math.floor(employees.length * 0.2)
          },
          { 
            id: 'GROUP-EXEC', 
            name: 'Executive Team', 
            description: 'C-level and executive management',
            icon: '👔',
            count: Math.floor(employees.length * 0.1)
          },
          { 
            id: 'GROUP-NONMANAGERIAL', 
            name: 'Non-Managerial Staff', 
            description: 'Individual contributors and non-managerial roles',
            icon: '👷',
            count: Math.floor(employees.length * 0.6)
          },
        ];
      default:
        return [];
    }
  };

  const targets = getTargets();
  const totalAffectedEmployees = selectedTargets.reduce((total, targetId) => {
    const target = targets.find(t => t.id === targetId);
    return total + (target?.count || 0);
  }, 0);

  // Calculate effective date warning
  const today = new Date();
  const selectedDate = new Date(effectiveFrom);
  const isPastDate = selectedDate < today;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl animate-in zoom-in duration-300">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <LayersIcon size={20} className="text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Assign Payroll Template</h3>
              <div className="flex items-center gap-3 mt-1">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <p className="text-sm text-gray-500">Step {step} of 3</p>
                </div>
                <div className="text-sm text-gray-400">•</div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock size={14} />
                  <span>Approx. 2 minutes</span>
                </div>
              </div>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-all hover:scale-105 active:scale-95"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-gray-100">
          <div 
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${(step / 3) * 100}%` }}
          ></div>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-bold text-gray-800">Select Payroll Template</h4>
                  <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {templates.length} templates available
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-2">
                  {templates.map(template => {
                    const isSelected = selectedTemplate === template.id;
                    const assignmentsCount = template.applicableTo.length;
                    const hasMultipleComponents = template.salaryComponents.length > 3;
                    
                    return (
                      <div
                        key={template.id}
                        onClick={() => setSelectedTemplate(template.id)}
                        className={`p-4 border rounded-xl cursor-pointer transition-all duration-300 ${isSelected ? 'border-primary bg-gradient-to-r from-primary/5 to-primary/10 shadow-lg shadow-primary/10' : 'border-gray-200 hover:border-primary/50 hover:shadow-md'}`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-start gap-3">
                              <div className={`p-2 rounded-lg ${isSelected ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}`}>
                                <LayersIcon size={18} />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-3 flex-wrap">
                                  <span className="font-bold text-gray-800">{template.name}</span>
                                  <span className={`text-xs px-2 py-0.5 rounded-full ${template.type === 'STANDARD' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                                    {template.type}
                                  </span>
                                  <span className={`text-xs px-2 py-0.5 rounded-full ${template.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                    {template.isActive ? 'Active' : 'Inactive'}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-500 mt-1">{template.description}</p>
                                
                                {/* Template Details */}
                                <div className="flex items-center gap-4 mt-3">
                                  <div className="flex items-center gap-1 text-xs text-gray-500">
                                    <Hash size={12} />
                                    <span>{template.salaryComponents.length} components</span>
                                  </div>
                                  <div className="flex items-center gap-1 text-xs text-gray-500">
                                    <Users2 size={12} />
                                    <span>{assignmentsCount} assignments</span>
                                  </div>
                                  {hasMultipleComponents && (
                                    <div className="flex items-center gap-1 text-xs text-yellow-600">
                                      <AlertCircle size={12} />
                                      <span>Complex structure</span>
                                    </div>
                                  )}
                                </div>
                                
                                {/* Preview of first 2 components */}
                                {template.salaryComponents.length > 0 && (
                                  <div className="mt-3 pt-3 border-t border-gray-100">
                                    <div className="flex flex-wrap gap-1">
                                      {template.salaryComponents.slice(0, 3).map((comp, idx) => (
                                        <span 
                                          key={idx}
                                          className={`text-xs px-2 py-0.5 rounded ${comp.type === 'EARNING' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                                        >
                                          {comp.name}
                                        </span>
                                      ))}
                                      {template.salaryComponents.length > 3 && (
                                        <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                                          +{template.salaryComponents.length - 3} more
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          {isSelected && (
                            <CheckCircle2 size={20} className="text-primary ml-2 flex-shrink-0" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <button 
                  onClick={onCreateTemplate}
                  className="flex items-center gap-2 text-primary font-bold hover:text-primary/80 transition-colors group"
                >
                  <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                    <Plus size={16} />
                  </div>
                  <span>Create New Template from Scratch</span>
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-bold text-gray-800">Select Assignment Scope</h4>
                  <div className="text-sm text-gray-500">
                    {selectedTargets.length} selected • {totalAffectedEmployees} employees affected
                  </div>
                </div>
                
                {/* Assignment Type Selector */}
                <div className="grid grid-cols-5 gap-2 mb-6">
                  {(['EMPLOYEE', 'GRADE', 'DESIGNATION', 'DIVISION', 'GROUP'] as const).map(type => {
                    const isActive = assignmentType === type;
                    const icons = {
                      'EMPLOYEE': <User size={18} />,
                      'GRADE': <GraduationCap size={18} />,
                      'DESIGNATION': <Briefcase size={18} />,
                      'DIVISION': <Building size={18} />,
                      'GROUP': <Users2 size={18} />
                    };
                    
                    return (
                      <button
                        key={type}
                        onClick={() => {
                          setAssignmentType(type);
                          setSelectedTargets([]);
                        }}
                        className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all duration-300 ${isActive ? 'border-primary bg-primary/5 shadow-sm scale-[1.02]' : 'border-gray-200 hover:border-primary/30 hover:shadow'}`}
                      >
                        <div className={`p-3 rounded-lg transition-colors ${isActive ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'}`}>
                          {icons[type]}
                        </div>
                        <span className="text-xs font-bold text-gray-700">{type.charAt(0) + type.slice(1).toLowerCase()}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Help text based on selection */}
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    <span className="font-bold">Assignment Type:</span> {assignmentType.toLowerCase()}
                    {assignmentType === 'EMPLOYEE' && ' • Select individual employees'}
                    {assignmentType === 'GRADE' && ' • Select by job grade level'}
                    {assignmentType === 'DESIGNATION' && ' • Select by job title/position'}
                    {assignmentType === 'DIVISION' && ' • Select by department/division'}
                    {assignmentType === 'GROUP' && ' • Select predefined employee groups'}
                  </p>
                </div>

                {/* Targets Selection */}
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                    <div>
                      <span className="text-sm font-bold text-gray-700">
                        Select {assignmentType.toLowerCase()}(s)
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        {targets.length} available {assignmentType.toLowerCase() === 'employee' ? 'employees' : assignmentType.toLowerCase() + 's'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          if (selectedTargets.length === targets.length) {
                            setSelectedTargets([]);
                          } else {
                            setSelectedTargets(targets.map(t => t.id));
                          }
                        }}
                        className="text-xs font-bold text-primary hover:text-primary/80"
                      >
                        {selectedTargets.length === targets.length ? 'Deselect All' : 'Select All'}
                      </button>
                    </div>
                  </div>
                  
                  <div className="max-h-80 overflow-y-auto">
                    <div className="grid grid-cols-1 divide-y divide-gray-100">
                      {targets.map(target => {
                        const isSelected = selectedTargets.includes(target.id);
                        return (
                          <label 
                            key={target.id} 
                            className={`flex items-center gap-4 p-4 cursor-pointer transition-colors ${isSelected ? 'bg-primary/5' : 'hover:bg-gray-50'}`}
                          >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedTargets([...selectedTargets, target.id]);
                                  } else {
                                    setSelectedTargets(selectedTargets.filter(id => id !== target.id));
                                  }
                                }}
                                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                              />
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                <div className="text-xl">{target.icon}</div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-gray-800 truncate">{target.name}</p>
                                  <p className="text-sm text-gray-500 truncate">{target.description}</p>
                                </div>
                                <div className="flex-shrink-0">
                                  <span className="text-xs font-bold bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                    {target.count} {assignmentType === 'EMPLOYEE' ? 'person' : 'employees'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h4 className="text-lg font-bold text-gray-800 mb-4">Review & Confirm Assignment</h4>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Assignment Summary */}
                <div className="lg:col-span-2 space-y-4">
                  {/* Template Card */}
                  <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl p-5">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <LayersIcon size={24} className="text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Selected Template</p>
                            <h5 className="text-xl font-bold text-gray-900 mt-1">{selectedTemplateObj?.name}</h5>
                          </div>
                          <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold">
                            Active
                          </span>
                        </div>
                        <p className="text-gray-600">{selectedTemplateObj?.description}</p>
                        <div className="flex items-center gap-4 mt-3">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-gray-900">{selectedTemplateObj?.salaryComponents.length}</div>
                            <div className="text-xs text-gray-500">Components</div>
                          </div>
                          <div className="h-8 w-px bg-gray-200"></div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-gray-900">{selectedTargets.length}</div>
                            <div className="text-xs text-gray-500">Targets</div>
                          </div>
                          <div className="h-8 w-px bg-gray-200"></div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-gray-900">{totalAffectedEmployees}</div>
                            <div className="text-xs text-gray-500">Employees</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Configuration Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white border border-gray-200 rounded-xl p-4">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Assignment Type</p>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          {assignmentType === 'EMPLOYEE' && <User size={18} />}
                          {assignmentType === 'GRADE' && <GraduationCap size={18} />}
                          {assignmentType === 'DESIGNATION' && <Briefcase size={18} />}
                          {assignmentType === 'DIVISION' && <Building size={18} />}
                          {assignmentType === 'GROUP' && <Users2 size={18} />}
                        </div>
                        <div>
                          <p className="font-bold text-gray-800 capitalize">{assignmentType.toLowerCase()}</p>
                          <p className="text-sm text-gray-500">
                            {selectedTargets.length} selected
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-xl p-4">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Priority Level</p>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Hash size={18} className="text-blue-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-800">Level {priority}</span>
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">High Priority</span>
                          </div>
                          <p className="text-sm text-gray-500">Overrides lower priority assignments</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Timeline & Actions */}
                <div className="space-y-4">
                  {/* Effective Dates */}
                  <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Effective Period</p>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-bold text-gray-600 mb-1 block">Effective From</label>
                        <div className="flex items-center gap-2">
                          <Calendar size={16} className="text-gray-400" />
                          <input
                            type="date"
                            value={effectiveFrom}
                            onChange={(e) => setEffectiveFrom(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                          />
                        </div>
                        {isPastDate && (
                          <p className="text-xs text-yellow-600 mt-1 flex items-center gap-1">
                            <AlertCircle size={12} /> Will apply retroactively
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="text-xs font-bold text-gray-600 mb-1 block">Effective To (Optional)</label>
                        <div className="flex items-center gap-2">
                          <Calendar size={16} className="text-gray-400" />
                          <input
                            type="date"
                            value={effectiveTo}
                            onChange={(e) => setEffectiveTo(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                            min={effectiveFrom}
                          />
                        </div>
                        {effectiveTo && (
                          <p className="text-xs text-gray-500 mt-1">Assignment will expire on this date</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Impact Summary */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-4">
                    <p className="text-xs font-bold text-blue-800 uppercase tracking-widest mb-2">Impact Summary</p>
                    <p className="text-sm text-blue-700 mb-3">
                      This assignment will affect <span className="font-bold text-blue-900">{totalAffectedEmployees} employees</span>. 
                      The template will automatically apply during the next payroll processing cycle.
                    </p>
                    <div className="flex items-center gap-2 text-xs text-blue-600">
                      <AlertCircle size={14} />
                      <span>Estimated processing: Next payroll run</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between rounded-b-2xl">
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <Target size={16} className="text-gray-400" />
            <span>
              Step {step} of 3 • {selectedTargets.length} {assignmentType.toLowerCase()}(s) selected • 
              <span className="font-bold text-gray-700 ml-1">{totalAffectedEmployees}</span> employees affected
            </span>
          </div>
          <div className="flex gap-3">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="px-5 py-2.5 border border-gray-300 rounded-xl font-bold text-sm text-gray-600 hover:bg-gray-50 transition-all hover:shadow-sm"
              >
                Back
              </button>
            )}
            {step < 3 ? (
              <button
                onClick={handleNext}
                className="px-5 py-2.5 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary/90 transition-all hover:shadow-lg shadow-primary/20"
              >
                Continue
              </button>
            ) : (
              <button
                onClick={handleAssign}
                className="px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold text-sm hover:opacity-90 transition-all hover:shadow-lg shadow-green-500/20 flex items-center gap-2"
              >
                <Save size={16} /> Confirm & Assign Template
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};