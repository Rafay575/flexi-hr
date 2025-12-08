
import React, { useState, useRef } from 'react';
import { 
  User, Briefcase, FileText, CheckCircle, ChevronRight, ChevronLeft, 
  UploadCloud, Calendar, MapPin, Mail, Phone, ShieldCheck, Check, Loader2, Sparkles,
  CreditCard, Camera, X, Search, Building2, Clock, FileSignature, Coins,
  File as FileIcon, Trash2, Eye, AlertCircle, RefreshCw, XCircle, CheckCircle2, UserPlus
} from 'lucide-react';
import { Employee } from '../types';

// ... (Constants & Interfaces remain the same) ...
type OnboardingStep = 'basic' | 'job' | 'docs' | 'review';
type DocStatus = 'idle' | 'uploading' | 'success' | 'error';

interface DocState {
  file: File | null;
  progress: number;
  status: DocStatus;
  error?: string;
  required: boolean;
  label: string;
  category: 'Identity & Employment' | 'Education & Background';
  description: string;
}

interface StepDef {
  id: OnboardingStep;
  label: string;
  icon: any;
  description: string;
}

const STEPS: StepDef[] = [
  { id: 'basic', label: 'Basic Info', icon: User, description: 'Personal details' },
  { id: 'job', label: 'Job Details', icon: Briefcase, description: 'Role & Assignment' },
  { id: 'docs', label: 'Documents', icon: FileText, description: 'Offer & ID Proofs' },
  { id: 'review', label: 'Review', icon: CheckCircle, description: 'Final check' },
];

const DEPARTMENTS = ['Engineering', 'Product', 'Sales', 'Marketing', 'HR', 'Operations'];
const LOCATIONS = ['New York HQ', 'London Office', 'Berlin Hub', 'Remote - US', 'Remote - EU'];
const GRADES = ['L1 - Intern', 'L2 - Junior', 'L3 - Mid Level', 'L4 - Senior', 'L5 - Lead', 'L6 - Manager'];
const JOB_TYPES = ['Full-Time Permanent', 'Full-Time Contract', 'Part-Time', 'Internship', 'Consultant'];
const SHIFTS = ['General (9:00 AM - 6:00 PM)', 'Morning (6:00 AM - 3:00 PM)', 'Evening (2:00 PM - 11:00 PM)', 'Night (10:00 PM - 7:00 AM)'];
const PROBATION_PERIODS = ['No Probation', '3 Months', '6 Months', '1 Year'];
const NOTICE_PERIODS = ['15 Days', '30 Days', '60 Days', '90 Days'];
const PAYROLL_TAGS_OPTIONS = ['Basic Salary', 'HRA', 'Provident Fund', 'Medical Insurance', 'Travel Allowance', 'Remote Stipend', 'Performance Bonus', 'Stock Options'];

interface OnboardXProps {
    onOnboardComplete?: (employee: Employee) => void;
}

const OnboardX: React.FC<OnboardXProps> = ({ onOnboardComplete }) => {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '', cnic: '', gender: '', dob: '', address: '',
    photo: null as File | null, photoPreview: '', department: '', role: '', grade: '', jobType: '', manager: '',
    location: '', joinDate: '', probationPeriod: '', workShift: '', noticePeriod: '', contractEndDate: '',
    payrollTags: [] as string[],
    documents: {
        offer_letter: { file: null, progress: 0, status: 'idle', required: true, label: 'Signed Offer Letter', category: 'Identity & Employment', description: 'The finalized offer signed by candidate.' },
        id_proof: { file: null, progress: 0, status: 'idle', required: true, label: 'Government ID Proof', category: 'Identity & Employment', description: 'Passport, Driving License, or National ID.' },
        experience_letter: { file: null, progress: 0, status: 'idle', required: false, label: 'Experience Letters', category: 'Education & Background', description: 'Relieving letters from previous employers.' },
        education_cert: { file: null, progress: 0, status: 'idle', required: false, label: 'Education Certificates', category: 'Education & Background', description: 'Highest degree or university diploma.' },
    } as Record<string, DocState>
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const photoInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) { setErrors(prev => { const newErrors = { ...prev }; delete newErrors[field]; return newErrors; }); }
  };

  const handleTagToggle = (tag: string) => {
    setFormData(prev => {
        const tags = prev.payrollTags.includes(tag) ? prev.payrollTags.filter(t => t !== tag) : [...prev.payrollTags, tag];
        return { ...prev, payrollTags: tags };
    });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData(prev => ({ ...prev, photo: file, photoPreview: URL.createObjectURL(file) }));
    }
  };

  const handleDocSelect = (key: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        setFormData(prev => ({ ...prev, documents: { ...prev.documents, [key]: { ...prev.documents[key], file: file, status: 'uploading', progress: 0, error: undefined } } }));
        if (file.size > 5 * 1024 * 1024) { setTimeout(() => { setFormData(prev => ({ ...prev, documents: { ...prev.documents, [key]: { ...prev.documents[key], status: 'error', progress: 0, error: 'File size exceeds 5MB limit.' } } })); }, 500); return; }
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.floor(Math.random() * 20) + 10;
            if (progress >= 100) { progress = 100; clearInterval(interval); setFormData(prev => ({ ...prev, documents: { ...prev.documents, [key]: { ...prev.documents[key], status: 'success', progress: 100 } } })); if(errors.documents) { const newErrors = {...errors}; delete newErrors.documents; setErrors(newErrors); } } 
            else { setFormData(prev => ({ ...prev, documents: { ...prev.documents, [key]: { ...prev.documents[key], progress } } })); }
        }, 300);
    }
  };

  const removeDoc = (key: string) => { setFormData(prev => ({ ...prev, documents: { ...prev.documents, [key]: { ...prev.documents[key], file: null, status: 'idle', progress: 0, error: undefined } } })); };

  const validateStep = (stepIdx: number): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;
    if (stepIdx === 0) {
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
      if (!formData.cnic.trim()) newErrors.cnic = 'CNIC / National ID is required';
      if (!formData.email.trim()) { newErrors.email = 'Email address is required'; } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) { newErrors.email = 'Please enter a valid email address'; }
      if (!formData.phone.trim()) newErrors.phone = 'Contact number is required';
      if (!formData.dob) newErrors.dob = 'Date of birth is required';
      if (!formData.gender) newErrors.gender = 'Gender selection is required';
      if (!formData.address.trim()) newErrors.address = 'Residential address is required';
    }
    if (stepIdx === 1) {
       if (!formData.department) newErrors.department = 'Department is required';
       if (!formData.role.trim()) newErrors.role = 'Designation is required';
       if (!formData.grade) newErrors.grade = 'Grade is required';
       if (!formData.jobType) newErrors.jobType = 'Job Type is required';
       if (!formData.manager.trim()) newErrors.manager = 'Reporting Manager is required';
       if (!formData.location) newErrors.location = 'Work location is required';
       if (!formData.joinDate) newErrors.joinDate = 'Joining date is required';
       if (!formData.probationPeriod) newErrors.probationPeriod = 'Probation period is required';
       if (!formData.workShift) newErrors.workShift = 'Work shift is required';
       if (!formData.noticePeriod) newErrors.noticePeriod = 'Notice period is required';
       if (formData.jobType.includes('Contract') && !formData.contractEndDate) { newErrors.contractEndDate = 'Contract end date is required'; }
    }
    if (stepIdx === 2) {
        const missingDocs = Object.entries(formData.documents).filter(([_, doc]) => doc.required && doc.status !== 'success');
        if (missingDocs.length > 0) { newErrors.documents = `Please upload all mandatory documents: ${missingDocs.map((d)=>d[1].label).join(', ')}`; isValid = false; }
    }
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); isValid = false; }
    return isValid;
  };

  const handleNext = () => { if (validateStep(currentStepIdx)) { if (currentStepIdx < STEPS.length - 1) { setCurrentStepIdx(prev => prev + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); } else { handleSubmit(); } } };
  const handleBack = () => { if (currentStepIdx > 0) { setCurrentStepIdx(prev => prev - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); } };
  const handleSubmit = () => {
    setIsSubmitting(true);
    const newEmployee: Employee = { id: `new-${Date.now()}`, employeeId: `EMP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`, name: `${formData.firstName} ${formData.lastName}`, role: formData.role, department: formData.department, location: formData.location, grade: formData.grade, status: 'Active', tags: ['New Joiner', ...formData.payrollTags], email: formData.email, avatar: formData.photoPreview || `https://ui-avatars.com/api/?name=${formData.firstName}+${formData.lastName}&background=0A3AA9&color=fff`, joinDate: formData.joinDate };
    setTimeout(() => { setIsSubmitting(false); setIsSuccess(true); if (onOnboardComplete) { onOnboardComplete(newEmployee); } }, 2000);
  };
  const formatFileSize = (bytes: number) => { if (bytes === 0) return '0 Bytes'; const k = 1024; const sizes = ['Bytes', 'KB', 'MB', 'GB']; const i = Math.floor(Math.log(bytes) / Math.log(k)); return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]; };

  const renderDocUploader = (key: string, doc: DocState) => {
      return (
          <div key={key} className={`relative rounded-xl border-2 border-dashed p-6 flex flex-col items-center justify-center text-center transition-all duration-200 bg-white shadow-sm ${doc.status === 'error' ? 'border-state-error bg-red-50/20' : doc.status === 'success' ? 'border-green-200 bg-green-50/20' : 'border-neutral-border hover:bg-neutral-page/50 hover:border-flexi-primary/50'}`}>
              {doc.status === 'idle' && (
                  <>
                      <div className="w-12 h-12 bg-neutral-page rounded-full flex items-center justify-center mb-4 text-neutral-muted group-hover:text-flexi-primary transition-colors"><UploadCloud className="w-6 h-6" /></div>
                      <h4 className="font-bold text-neutral-primary text-sm">{doc.label} {doc.required && <span className="text-state-error">*</span>}</h4>
                      <p className="text-xs text-neutral-muted mt-2 px-4 leading-relaxed">{doc.description}</p>
                      <label className="mt-4 px-4 py-3 bg-white border border-neutral-border text-xs font-bold text-flexi-primary rounded-lg shadow-sm hover:bg-flexi-light cursor-pointer transition-colors">Browse Files <input type="file" className="hidden" accept=".pdf,.jpg,.png,.jpeg" onChange={(e) => handleDocSelect(key, e)} /></label>
                  </>
              )}
              {doc.status === 'uploading' && (<div className="w-full"><Loader2 className="w-8 h-8 text-flexi-primary animate-spin mx-auto mb-4" /><h4 className="font-bold text-neutral-primary text-sm mb-1">Uploading...</h4><p className="text-xs text-neutral-muted mb-4">{doc.file?.name}</p><div className="w-full bg-neutral-page h-2 rounded-full overflow-hidden"><div className="h-full bg-flexi-primary transition-all duration-300 ease-out" style={{ width: `${doc.progress}%` }}></div></div><p className="text-[10px] text-right text-neutral-secondary mt-1 font-mono">{doc.progress}%</p></div>)}
              {doc.status === 'success' && (<div className="w-full flex items-center justify-between gap-4"><div className="flex items-center gap-3 text-left"><div className="w-10 h-10 rounded-lg bg-white border border-green-200 flex items-center justify-center text-green-600 shadow-sm"><FileText className="w-5 h-5" /></div><div className="flex-1 min-w-0"><h4 className="font-bold text-neutral-primary text-sm truncate max-w-[150px]">{doc.file?.name}</h4><p className="text-[10px] text-neutral-secondary font-mono">{formatFileSize(doc.file?.size || 0)} • Completed</p></div></div><div className="flex gap-2"><button className="p-1.5 text-neutral-muted hover:text-flexi-primary hover:bg-white rounded transition-colors" title="View"><Eye className="w-4 h-4" /></button><button onClick={() => removeDoc(key)} className="p-1.5 text-neutral-muted hover:text-state-error hover:bg-white rounded transition-colors" title="Remove"><Trash2 className="w-4 h-4" /></button></div><div className="absolute top-2 right-2"><CheckCircle2 className="w-5 h-5 text-state-success fill-white" /></div></div>)}
              {doc.status === 'error' && (<div className="w-full"><div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mb-3 mx-auto text-state-error"><XCircle className="w-6 h-6" /></div><h4 className="font-bold text-state-error text-sm mb-1">Upload Failed</h4><p className="text-xs text-neutral-secondary mb-4">{doc.error}</p><button onClick={() => removeDoc(key)} className="px-4 py-3 bg-white border border-red-200 text-xs font-bold text-state-error rounded-lg shadow-sm hover:bg-red-50 transition-colors flex items-center gap-2 mx-auto"><RefreshCw className="w-3 h-3" /> Try Again</button></div>)}
          </div>
      );
  };

  const renderStepContent = () => {
    const inputClass = "w-full px-4 py-2.5 bg-white border border-neutral-border rounded-lg text-sm text-neutral-primary focus:outline-none focus:ring-2 focus:ring-flexi-primary/20 focus:border-flexi-primary transition-all placeholder:text-neutral-muted";
    const labelClass = "block text-label font-medium text-neutral-secondary mb-1.5";
    const errorClass = "border-state-error bg-red-50/10";

    switch (currentStepIdx) {
      case 0:
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
             <div className="flex flex-col items-center justify-center sm:flex-row sm:justify-start gap-6">
                <div className="relative group cursor-pointer" onClick={() => photoInputRef.current?.click()}>
                    <div className={`w-28 h-28 rounded-full border-4 ${formData.photoPreview ? 'border-flexi-primary' : 'border-neutral-border'} overflow-hidden shadow-sm bg-neutral-page flex items-center justify-center transition-all group-hover:shadow-md`}>{formData.photoPreview ? (<img src={formData.photoPreview} alt="Preview" className="w-full h-full object-cover" />) : (<User className="w-10 h-10 text-neutral-muted group-hover:text-flexi-primary transition-colors" />)}</div>
                    <div className="absolute bottom-0 right-0 p-2 bg-flexi-primary text-white rounded-full shadow-md border-2 border-white group-hover:bg-flexi-secondary transition-colors"><Camera className="w-4 h-4" /></div>
                    <input type="file" ref={photoInputRef} onChange={handlePhotoUpload} accept="image/*" className="hidden" />
                </div>
                <div className="text-center sm:text-left"><h4 className="text-sm font-bold text-neutral-primary">Profile Photo</h4><p className="text-xs text-neutral-secondary mt-1 max-w-[200px]">Upload a clear face photo for ID card and profile. Max 2MB. JPG/PNG.</p>{formData.photo && (<button onClick={(e) => { e.stopPropagation(); setFormData(prev => ({...prev, photo: null, photoPreview: ''})); }} className="mt-2 text-xs font-bold text-state-error hover:underline">Remove Photo</button>)}</div>
             </div>
             <div className="border-t border-neutral-border my-6"></div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-0.5"><label className={labelClass}>First Name <span className="text-state-error">*</span></label><input type="text" value={formData.firstName} onChange={(e) => handleInputChange('firstName', e.target.value)} placeholder="e.g. Sarah" className={`${inputClass} ${errors.firstName ? errorClass : ''}`} />{errors.firstName && <p className="text-xs text-state-error font-medium flex items-center gap-1 mt-1"><ShieldCheck className="w-3 h-3" /> {errors.firstName}</p>}</div>
                <div className="space-y-0.5"><label className={labelClass}>Last Name <span className="text-state-error">*</span></label><input type="text" value={formData.lastName} onChange={(e) => handleInputChange('lastName', e.target.value)} placeholder="e.g. Jenkins" className={`${inputClass} ${errors.lastName ? errorClass : ''}`} />{errors.lastName && <p className="text-xs text-state-error font-medium flex items-center gap-1 mt-1"><ShieldCheck className="w-3 h-3" /> {errors.lastName}</p>}</div>
                <div className="space-y-0.5"><label className={labelClass}>CNIC / National ID <span className="text-state-error">*</span></label><div className="relative"><CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-muted" /><input type="text" value={formData.cnic} onChange={(e) => handleInputChange('cnic', e.target.value)} placeholder="XXXXX-XXXXXXX-X" className={`${inputClass} pl-10 ${errors.cnic ? errorClass : ''}`} /></div>{errors.cnic && <p className="text-xs text-state-error font-medium flex items-center gap-1 mt-1"><ShieldCheck className="w-3 h-3" /> {errors.cnic}</p>}</div>
                <div className="space-y-0.5"><label className={labelClass}>Date of Birth <span className="text-state-error">*</span></label><div className="relative"><Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-muted" /><input type="date" value={formData.dob} onChange={(e) => handleInputChange('dob', e.target.value)} className={`${inputClass} pl-10 ${errors.dob ? errorClass : ''}`} /></div>{errors.dob && <p className="text-xs text-state-error font-medium flex items-center gap-1 mt-1"><ShieldCheck className="w-3 h-3" /> {errors.dob}</p>}</div>
                <div className="space-y-0.5"><label className={labelClass}>Gender <span className="text-state-error">*</span></label><select value={formData.gender} onChange={(e) => handleInputChange('gender', e.target.value)} className={`${inputClass} ${errors.gender ? errorClass : ''}`}><option value="">Select Gender</option><option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option></select>{errors.gender && <p className="text-xs text-state-error font-medium flex items-center gap-1 mt-1"><ShieldCheck className="w-3 h-3" /> {errors.gender}</p>}</div>
                <div className="space-y-0.5"><label className={labelClass}>Phone Number <span className="text-state-error">*</span></label><div className="relative"><Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-muted" /><input type="tel" value={formData.phone} onChange={(e) => handleInputChange('phone', e.target.value)} placeholder="+1 (555) 000-0000" className={`${inputClass} pl-10 ${errors.phone ? errorClass : ''}`} /></div>{errors.phone && <p className="text-xs text-state-error font-medium flex items-center gap-1 mt-1"><ShieldCheck className="w-3 h-3" /> {errors.phone}</p>}</div>
                <div className="space-y-0.5 md:col-span-2"><label className={labelClass}>Email Address <span className="text-state-error">*</span></label><div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-muted" /><input type="email" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} placeholder="sarah.jenkins@company.com" className={`${inputClass} pl-10 ${errors.email ? errorClass : ''}`} /></div>{errors.email && <p className="text-xs text-state-error font-medium flex items-center gap-1 mt-1"><ShieldCheck className="w-3 h-3" /> {errors.email}</p>}</div>
                <div className="space-y-0.5 md:col-span-2"><label className={labelClass}>Residential Address <span className="text-state-error">*</span></label><textarea rows={3} value={formData.address} onChange={(e) => handleInputChange('address', e.target.value)} placeholder="Full street address including city and zip code..." className={`${inputClass} resize-none ${errors.address ? errorClass : ''}`} />{errors.address && <p className="text-xs text-state-error font-medium flex items-center gap-1 mt-1"><ShieldCheck className="w-3 h-3" /> {errors.address}</p>}</div>
             </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
             <div>
                <div className="bg-neutral-page/50 p-4 rounded-lg border border-neutral-border mb-6"><h4 className="text-sm font-bold text-neutral-primary flex items-center gap-2"><Building2 className="w-4 h-4 text-flexi-primary" />Role & Organization</h4></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-0.5"><label className={labelClass}>Department <span className="text-state-error">*</span></label><select value={formData.department} onChange={(e) => handleInputChange('department', e.target.value)} className={`${inputClass} ${errors.department ? errorClass : ''}`}><option value="">Select Department</option>{DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}</select>{errors.department && <p className="text-xs text-state-error font-medium mt-1">{errors.department}</p>}</div>
                    <div className="space-y-0.5"><label className={labelClass}>Designation <span className="text-state-error">*</span></label><input type="text" value={formData.role} onChange={(e) => handleInputChange('role', e.target.value)} placeholder="e.g. Senior Product Designer" className={`${inputClass} ${errors.role ? errorClass : ''}`} />{errors.role && <p className="text-xs text-state-error font-medium mt-1">{errors.role}</p>}</div>
                    <div className="space-y-0.5"><label className={labelClass}>Grade <span className="text-state-error">*</span></label><select value={formData.grade} onChange={(e) => handleInputChange('grade', e.target.value)} className={`${inputClass} ${errors.grade ? errorClass : ''}`}><option value="">Select Grade</option>{GRADES.map(g => <option key={g} value={g}>{g}</option>)}</select>{errors.grade && <p className="text-xs text-state-error font-medium mt-1">{errors.grade}</p>}</div>
                    <div className="space-y-0.5"><label className={labelClass}>Job Type <span className="text-state-error">*</span></label><select value={formData.jobType} onChange={(e) => handleInputChange('jobType', e.target.value)} className={`${inputClass} ${errors.jobType ? errorClass : ''}`}><option value="">Select Type</option>{JOB_TYPES.map(t => <option key={t} value={t}>{t}</option>)}</select>{errors.jobType && <p className="text-xs text-state-error font-medium mt-1">{errors.jobType}</p>}</div>
                    <div className="space-y-0.5"><label className={labelClass}>Work Location <span className="text-state-error">*</span></label><div className="relative"><MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-muted" /><select value={formData.location} onChange={(e) => handleInputChange('location', e.target.value)} className={`${inputClass} pl-10 appearance-none ${errors.location ? errorClass : ''}`}><option value="">Select Location</option>{LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}</select></div>{errors.location && <p className="text-xs text-state-error font-medium mt-1">{errors.location}</p>}</div>
                    <div className="space-y-0.5"><label className={labelClass}>Reporting Manager <span className="text-state-error">*</span></label><div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-muted" /><input type="text" value={formData.manager} onChange={(e) => handleInputChange('manager', e.target.value)} placeholder="Search employee by name or ID..." className={`${inputClass} pl-10 ${errors.manager ? errorClass : ''}`} /></div>{errors.manager && <p className="text-xs text-state-error font-medium mt-1">{errors.manager}</p>}</div>
                </div>
             </div>
             
             <div>
                <div className="bg-neutral-page/50 p-4 rounded-lg border border-neutral-border mb-6"><h4 className="text-sm font-bold text-neutral-primary flex items-center gap-2"><FileSignature className="w-4 h-4 text-flexi-primary" />Employment Terms & Contract</h4></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-0.5"><label className={labelClass}>Joining Date <span className="text-state-error">*</span></label><div className="relative"><Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-muted" /><input type="date" value={formData.joinDate} onChange={(e) => handleInputChange('joinDate', e.target.value)} className={`${inputClass} pl-10 ${errors.joinDate ? errorClass : ''}`} /></div>{errors.joinDate && <p className="text-xs text-state-error font-medium mt-1">{errors.joinDate}</p>}</div>
                    <div className="space-y-0.5"><label className={labelClass}>Work Shift <span className="text-state-error">*</span></label><div className="relative"><Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-muted" /><select value={formData.workShift} onChange={(e) => handleInputChange('workShift', e.target.value)} className={`${inputClass} pl-10 appearance-none ${errors.workShift ? errorClass : ''}`}><option value="">Select Shift</option>{SHIFTS.map(s => <option key={s} value={s}>{s}</option>)}</select></div>{errors.workShift && <p className="text-xs text-state-error font-medium mt-1">{errors.workShift}</p>}</div>
                    <div className="space-y-0.5"><label className={labelClass}>Probation Period <span className="text-state-error">*</span></label><select value={formData.probationPeriod} onChange={(e) => handleInputChange('probationPeriod', e.target.value)} className={`${inputClass} ${errors.probationPeriod ? errorClass : ''}`}><option value="">Select Period</option>{PROBATION_PERIODS.map(p => <option key={p} value={p}>{p}</option>)}</select>{errors.probationPeriod && <p className="text-xs text-state-error font-medium mt-1">{errors.probationPeriod}</p>}</div>
                    <div className="space-y-0.5"><label className={labelClass}>Notice Period <span className="text-state-error">*</span></label><select value={formData.noticePeriod} onChange={(e) => handleInputChange('noticePeriod', e.target.value)} className={`${inputClass} ${errors.noticePeriod ? errorClass : ''}`}><option value="">Select Notice Period</option>{NOTICE_PERIODS.map(n => <option key={n} value={n}>{n}</option>)}</select>{errors.noticePeriod && <p className="text-xs text-state-error font-medium mt-1">{errors.noticePeriod}</p>}</div>
                    {formData.jobType.includes('Contract') && (<div className="space-y-0.5"><label className={labelClass}>Contract End Date <span className="text-state-error">*</span></label><div className="relative"><Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-muted" /><input type="date" value={formData.contractEndDate} onChange={(e) => handleInputChange('contractEndDate', e.target.value)} className={`${inputClass} pl-10 ${errors.contractEndDate ? errorClass : ''}`} /></div>{errors.contractEndDate && <p className="text-xs text-state-error font-medium mt-1">{errors.contractEndDate}</p>}</div>)}
                </div>
             </div>
             
             <div>
                <div className="bg-neutral-page/50 p-4 rounded-lg border border-neutral-border mb-6"><h4 className="text-sm font-bold text-neutral-primary flex items-center gap-2"><Coins className="w-4 h-4 text-flexi-primary" />Compensation & Benefits</h4></div>
                <div className="space-y-3">
                    <label className={labelClass}>Applied Payroll Tags</label>
                    <div className="flex flex-wrap gap-2">{PAYROLL_TAGS_OPTIONS.map(tag => { const isSelected = formData.payrollTags.includes(tag); return (<button key={tag} onClick={() => handleTagToggle(tag)} className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${isSelected ? 'bg-flexi-light text-flexi-primary border-flexi-primary' : 'bg-white text-neutral-secondary border-neutral-border hover:border-neutral-400'}`}>{tag} {isSelected && <Check className="w-3 h-3 inline ml-1" />}</button>)})}</div>
                    <p className="text-xs text-neutral-muted mt-1">Select all applicable salary components and benefits.</p>
                </div>
             </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
             <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start gap-3"><ShieldCheck className="w-5 h-5 text-flexi-primary shrink-0 mt-0.5" /><div><h4 className="text-sm font-bold text-neutral-primary">Secure Document Upload</h4><p className="text-xs text-neutral-secondary mt-1">Files are encrypted. Max size 5MB per file. Supported: PDF, JPG, PNG.</p></div></div>
             {errors.documents && (<div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2 text-state-error text-sm font-medium border-state-error animate-pulse"><AlertCircle className="w-4 h-4" /> {errors.documents}</div>)}
             <div><h4 className="text-sm font-bold text-neutral-primary mb-4 flex items-center gap-2 border-b border-neutral-border pb-4"><User className="w-4 h-4 text-flexi-primary" /> Identity & Employment</h4><div className="grid grid-cols-1 md:grid-cols-2 gap-6">{renderDocUploader('offer_letter', formData.documents.offer_letter)}{renderDocUploader('id_proof', formData.documents.id_proof)}</div></div>
             <div><h4 className="text-sm font-bold text-neutral-primary mb-4 flex items-center gap-2 border-b border-neutral-border pb-4"><FileText className="w-4 h-4 text-flexi-primary" /> Education & Background</h4><div className="grid grid-cols-1 md:grid-cols-2 gap-6">{renderDocUploader('education_cert', formData.documents.education_cert)}{renderDocUploader('experience_letter', formData.documents.experience_letter)}</div></div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
             <div className="bg-white border border-neutral-border rounded-xl p-6 shadow-card relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-flexi-primary"></div>
                <h3 className="text-lg font-bold text-neutral-primary mb-6 flex items-center gap-2"><User className="w-5 h-5 text-flexi-primary" /> Personal Summary</h3>
                {formData.photoPreview && (<div className="mb-6 flex items-center gap-4"><img src={formData.photoPreview} alt="Profile" className="w-16 h-16 rounded-full border-2 border-white shadow-sm object-cover" /><div><p className="text-sm font-bold text-neutral-primary">Profile Photo</p><p className="text-xs text-neutral-secondary">Uploaded Successfully</p></div></div>)}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div><p className="text-xs text-neutral-secondary uppercase font-bold tracking-wider mb-1">Full Name</p><p className="text-sm font-medium text-neutral-primary">{formData.firstName} {formData.lastName || '-'}</p></div>
                    <div><p className="text-xs text-neutral-secondary uppercase font-bold tracking-wider mb-1">CNIC / ID</p><p className="text-sm font-medium text-neutral-primary font-mono">{formData.cnic || '-'}</p></div>
                    <div><p className="text-xs text-neutral-secondary uppercase font-bold tracking-wider mb-1">Gender</p><p className="text-sm font-medium text-neutral-primary">{formData.gender || '-'}</p></div>
                    <div><p className="text-xs text-neutral-secondary uppercase font-bold tracking-wider mb-1">Email</p><p className="text-sm font-medium text-neutral-primary">{formData.email || '-'}</p></div>
                    <div><p className="text-xs text-neutral-secondary uppercase font-bold tracking-wider mb-1">Phone</p><p className="text-sm font-medium text-neutral-primary">{formData.phone || '-'}</p></div>
                    <div><p className="text-xs text-neutral-secondary uppercase font-bold tracking-wider mb-1">DOB</p><p className="text-sm font-medium text-neutral-primary">{formData.dob || '-'}</p></div>
                    <div className="col-span-2"><p className="text-xs text-neutral-secondary uppercase font-bold tracking-wider mb-1">Address</p><p className="text-sm font-medium text-neutral-primary">{formData.address || '-'}</p></div>
                </div>
             </div>
             
             <div className="bg-white border border-neutral-border rounded-xl p-6 shadow-card relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-state-success"></div>
                <h3 className="text-lg font-bold text-neutral-primary mb-6 flex items-center gap-2"><Briefcase className="w-5 h-5 text-state-success" /> Job Assignment</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div><p className="text-xs text-neutral-secondary uppercase font-bold tracking-wider mb-1">Department</p><p className="text-sm font-medium text-neutral-primary">{formData.department || '-'}</p></div>
                    <div><p className="text-xs text-neutral-secondary uppercase font-bold tracking-wider mb-1">Designation</p><p className="text-sm font-medium text-neutral-primary">{formData.role || '-'}</p></div>
                    <div><p className="text-xs text-neutral-secondary uppercase font-bold tracking-wider mb-1">Grade</p><p className="text-sm font-medium text-neutral-primary">{formData.grade || '-'}</p></div>
                    <div><p className="text-xs text-neutral-secondary uppercase font-bold tracking-wider mb-1">Job Type</p><p className="text-sm font-medium text-neutral-primary">{formData.jobType || '-'}</p></div>
                    <div><p className="text-xs text-neutral-secondary uppercase font-bold tracking-wider mb-1">Location</p><p className="text-sm font-medium text-neutral-primary">{formData.location || '-'}</p></div>
                    <div><p className="text-xs text-neutral-secondary uppercase font-bold tracking-wider mb-1">Manager</p><p className="text-sm font-medium text-neutral-primary">{formData.manager || '-'}</p></div>
                    <div><p className="text-xs text-neutral-secondary uppercase font-bold tracking-wider mb-1">Join Date</p><p className="text-sm font-medium text-neutral-primary">{formData.joinDate || '-'}</p></div>
                    <div><p className="text-xs text-neutral-secondary uppercase font-bold tracking-wider mb-1">Shift</p><p className="text-sm font-medium text-neutral-primary">{formData.workShift || '-'}</p></div>
                    <div><p className="text-xs text-neutral-secondary uppercase font-bold tracking-wider mb-1">Probation</p><p className="text-sm font-medium text-neutral-primary">{formData.probationPeriod || '-'}</p></div>
                    <div><p className="text-xs text-neutral-secondary uppercase font-bold tracking-wider mb-1">Notice</p><p className="text-sm font-medium text-neutral-primary">{formData.noticePeriod || '-'}</p></div>
                    {formData.contractEndDate && (<div><p className="text-xs text-neutral-secondary uppercase font-bold tracking-wider mb-1">Contract End</p><p className="text-sm font-medium text-neutral-primary">{formData.contractEndDate}</p></div>)}
                </div>
             </div>
             
             <div className="bg-white border border-neutral-border rounded-xl p-6 shadow-card relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-neutral-400"></div>
                <h3 className="text-lg font-bold text-neutral-primary mb-4 flex items-center gap-2"><CheckCircle className="w-5 h-5 text-flexi-primary" /> Verification</h3>
                <label className="flex items-start gap-3 cursor-pointer"><input type="checkbox" className="mt-1 w-4 h-4 text-flexi-primary border-neutral-300 rounded focus:ring-flexi-primary" /><span className="text-sm text-neutral-secondary">I confirm that all the information provided above is accurate and the uploaded documents are authentic. I understand that any discrepancy may lead to revocation of the offer.</span></label>
             </div>
          </div>
        );
      default: return null;
    }
  };

  if (isSuccess) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[600px] text-center p-6 animate-in zoom-in-95 duration-500">
            <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6 relative"><div className="absolute inset-0 rounded-full border-4 border-green-100 animate-ping opacity-20"></div><Check className="w-12 h-12 text-state-success" /></div>
            <h2 className="text-3xl font-bold text-neutral-primary mb-3">Onboarding Initiated!</h2>
            <p className="text-neutral-secondary max-w-md mx-auto mb-8 text-lg"><span className="font-semibold text-neutral-primary">{formData.firstName} {formData.lastName}</span> has been successfully added to the system. An invitation email with login credentials has been sent.</p>
            <div className="flex gap-4">
                <button onClick={() => { setIsSuccess(false); setCurrentStepIdx(0); setFormData({ firstName: '', lastName: '', email: '', phone: '', cnic: '', gender: '', dob: '', address: '', photo: null, photoPreview: '', department: '', role: '', grade: '', jobType: '', manager: '', location: '', joinDate: '', probationPeriod: '', workShift: '', noticePeriod: '', contractEndDate: '', payrollTags: [], documents: { ...formData.documents } }); }} className="px-6 py-3 bg-white border border-neutral-border text-neutral-primary font-bold rounded-xl hover:bg-neutral-page transition-colors shadow-sm">Onboard Another</button>
                <button className="px-6 py-3 bg-flexi-primary text-white font-bold rounded-xl hover:bg-flexi-secondary transition-colors shadow-lg shadow-blue-900/20 flex items-center gap-2"><Sparkles className="w-4 h-4" /> View Employee Profile</button>
            </div>
        </div>
      );
  }

  return (
    <div className="max-w-5xl mx-auto pb-20">
      
      {/* HEADER HERO CARD */}
      <div className="mb-10 bg-gradient-to-r from-flexi-primary to-flexi-secondary rounded-2xl p-8 shadow-lg text-white">
          <div className="flex justify-between items-start">
              <div>
                  <h1 className="text-3xl font-bold tracking-tight text-white mb-2 flex items-center gap-3">
                      OnboardX Wizard
                  </h1>
                  <p className="text-blue-100 max-w-xl text-sm leading-relaxed">
                      Add a new employee to the organization in 4 simple steps. This wizard handles basic info, job assignment, document collection, and verification.
                  </p>
              </div>
              <div className="hidden sm:flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg border border-white/20 backdrop-blur-sm">
                  <UserPlus className="w-5 h-5 text-flexi-gold" />
                  <span className="text-sm font-bold text-white">New Hire</span>
              </div>
          </div>
      </div>

      <div className="mb-10 relative">
         <div className="absolute top-1/2 left-0 w-full h-0.5 bg-neutral-border -z-10 -translate-y-1/2 rounded-full"></div>
         <div className="absolute top-1/2 left-0 h-0.5 bg-flexi-primary -z-10 -translate-y-1/2 rounded-full transition-all duration-500 ease-out" style={{ width: `${(currentStepIdx / (STEPS.length - 1)) * 100}%` }}></div>
         <div className="flex justify-between items-center w-full">
            {STEPS.map((step, idx) => {
                const isActive = idx === currentStepIdx;
                const isCompleted = idx < currentStepIdx;
                return (
                    <div key={step.id} className="flex flex-col items-center gap-3 bg-neutral-page px-2 rounded-xl">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 relative ${isActive ? 'bg-gradient-to-br from-flexi-primary to-flexi-secondary text-white shadow-lg shadow-blue-500/30 scale-110' : ''} ${isCompleted ? 'bg-state-success text-white' : ''} ${!isActive && !isCompleted ? 'bg-white border-2 border-neutral-border text-neutral-muted' : ''}`}>{isCompleted ? <Check className="w-5 h-5" /> : <step.icon className="w-5 h-5" />}</div>
                        <div className="hidden sm:block text-center"><p className={`text-xs font-bold uppercase tracking-wider ${isActive ? 'text-flexi-primary' : 'text-neutral-secondary'}`}>{step.label}</p>{isActive && (<p className="text-[10px] text-neutral-muted mt-0.5 animate-in fade-in">{step.description}</p>)}</div>
                    </div>
                );
            })}
         </div>
      </div>
      <div className="bg-white rounded-xl shadow-card border border-neutral-border overflow-hidden flex flex-col min-h-[500px]">
         <div className="flex-1 p-6">{renderStepContent()}</div>
         <div className="p-6 border-t border-neutral-border bg-neutral-page/30 flex justify-between items-center">
            <button onClick={handleBack} disabled={currentStepIdx === 0 || isSubmitting} className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold border transition-all ${currentStepIdx === 0 ? 'opacity-0 pointer-events-none' : 'bg-white border-neutral-border text-neutral-secondary hover:bg-neutral-page hover:text-neutral-primary'}`}><ChevronLeft className="w-4 h-4" /> Back</button>
            <div className="flex items-center gap-4"><span className="text-xs text-neutral-muted hidden sm:inline-block">Step {currentStepIdx + 1} of {STEPS.length}</span><button onClick={handleNext} disabled={isSubmitting} className="flex items-center gap-2 px-8 py-3 bg-flexi-primary text-white text-sm font-bold rounded-lg hover:bg-flexi-secondary transition-all shadow-md shadow-blue-900/10 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed min-w-[160px] justify-center">{isSubmitting ? (<><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>) : currentStepIdx === STEPS.length - 1 ? (<>Finish Onboarding <Check className="w-4 h-4" /></>) : (<>Continue <ChevronRight className="w-4 h-4" /></>)}</button></div>
         </div>
      </div>
    </div>
  );
};

export default OnboardX;
