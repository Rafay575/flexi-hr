
import React, { useState } from 'react';
import { 
  ArrowLeft, CheckCircle, Clock, AlertTriangle, Monitor, Shield, 
  DollarSign, User, ChevronDown, ChevronRight, X, Archive, FileText,
  AlertCircle, CheckCircle2
} from 'lucide-react';
import { ExitRequest, DepartmentChecklist, ChecklistItem } from '../types';

interface ExitDetailsProps {
  request: ExitRequest;
  onBack: () => void;
  onUpdate: (updatedRequest: ExitRequest) => void;
}

const ExitDetails: React.FC<ExitDetailsProps> = ({ request, onBack, onUpdate }) => {
  const [activeChecklist, setActiveChecklist] = useState<string | null>('cl-it');
  const [checklists, setChecklists] = useState<DepartmentChecklist[]>(request.checklists || []);
  const [isFinalModalOpen, setIsFinalModalOpen] = useState(false);
  const [exitSummary, setExitSummary] = useState(
    `${request.name} is leaving due to ${request.reason}. Last working day is ${request.lastWorkingDay}. Clearance from IT and Admin is verified. Assets have been recovered.`
  );

  const toggleItemStatus = (checklistId: string, itemId: string) => {
    setChecklists(prev => prev.map(cl => {
        if (cl.id !== checklistId) return cl;
        return {
            ...cl,
            items: cl.items.map(item => {
                if (item.id !== itemId) return item;
                const nextStatus: ChecklistItem['status'] = item.status === 'Pending' ? 'Done' : item.status === 'Done' ? 'Blocked' : 'Pending';
                return { ...item, status: nextStatus };
            })
        };
    }));
  };

  const getDepartmentIcon = (dept: string) => {
      switch(dept) {
          case 'IT': return <Monitor className="w-5 h-5" />;
          case 'Admin': return <Shield className="w-5 h-5" />;
          case 'Finance': return <DollarSign className="w-5 h-5" />;
          case 'HR': return <User className="w-5 h-5" />;
          default: return <CheckCircle className="w-5 h-5" />;
      }
  };

  const allApproved = checklists.every(cl => cl.status === 'Approved');
  const pendingCount = checklists.reduce((acc, cl) => acc + (cl.status === 'Pending' ? 1 : 0), 0);

  const handleArchive = () => {
      // Logic to archive
      const updatedReq: ExitRequest = {
          ...request,
          status: 'Completed',
          approvalStage: 'Archived',
          checklists: checklists
      };
      onUpdate(updatedReq);
      setIsFinalModalOpen(false);
      onBack();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-border min-h-[600px] flex flex-col animate-in slide-in-from-right duration-300">
      
      {/* Header */}
      <div className="p-6 border-b border-neutral-border bg-neutral-page/30 flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-neutral-border rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5 text-neutral-secondary" />
          </button>
          <div className="flex-1">
              <div className="flex items-center gap-3">
                 <h2 className="text-xl font-bold text-neutral-primary">{request.name}</h2>
                 <span className="text-xs bg-neutral-200 text-neutral-700 px-2 py-0.5 rounded-full font-medium">{request.employeeId}</span>
              </div>
              <p className="text-sm text-neutral-secondary">{request.role} • {request.department}</p>
          </div>
          <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold text-neutral-muted uppercase">Last Working Day</p>
                  <p className="text-sm font-bold text-neutral-primary">{request.lastWorkingDay}</p>
              </div>
              <button 
                onClick={() => setIsFinalModalOpen(true)}
                className="px-4 py-2 bg-flexi-blue text-white text-sm font-bold rounded-lg hover:bg-flexi-end shadow-sm transition-all flex items-center gap-2"
              >
                  Final Approval
              </button>
          </div>
      </div>

      <div className="flex flex-col lg:flex-row flex-1">
          {/* Left: Approval Flow & Status */}
          <div className="w-full lg:w-80 border-b lg:border-b-0 lg:border-r border-neutral-border bg-neutral-page/10 p-6">
              <h3 className="text-sm font-bold text-neutral-primary mb-6">Approval Workflow</h3>
              
              <div className="relative pl-4 space-y-8">
                  {/* Stepper Lines */}
                  <div className="absolute left-[22px] top-3 bottom-3 w-0.5 bg-neutral-border -z-10"></div>

                  {[
                      { title: 'Resignation Submitted', status: 'Done', date: request.requestDate },
                      { title: 'Manager Approval', status: 'Done', date: 'Oct 12' },
                      { title: 'Department Clearance', status: 'Current', date: 'In Progress' },
                      { title: 'Final HR Settlement', status: 'Pending', date: '-' },
                      { title: 'Archived', status: 'Pending', date: '-' }
                  ].map((step, idx) => (
                      <div key={idx} className="flex gap-4 items-start">
                          <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 bg-white z-10 
                              ${step.status === 'Done' ? 'border-state-success bg-state-success' : 
                                step.status === 'Current' ? 'border-flexi-blue animate-pulse' : 'border-neutral-300'}
                          `}></div>
                          <div>
                              <p className={`text-sm font-bold ${step.status === 'Current' ? 'text-flexi-blue' : 'text-neutral-primary'}`}>
                                  {step.title}
                              </p>
                              <p className="text-xs text-neutral-secondary">{step.date}</p>
                          </div>
                      </div>
                  ))}
              </div>
          </div>

          {/* Right: Checklists */}
          <div className="flex-1 p-6 lg:p-10 bg-white">
              <div className="max-w-3xl mx-auto">
                  <h3 className="text-lg font-bold text-neutral-primary mb-6 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-flexi-blue" /> Department Clearance
                  </h3>

                  <div className="space-y-4">
                      {checklists.map(cl => {
                          const isOpen = activeChecklist === cl.id;
                          const completedItems = cl.items.filter(i => i.status === 'Done').length;
                          const totalItems = cl.items.length;
                          const isFullyApproved = cl.status === 'Approved';

                          return (
                              <div key={cl.id} className={`border rounded-xl transition-all ${isOpen ? 'border-flexi-blue shadow-sm' : 'border-neutral-border'}`}>
                                  <button 
                                    onClick={() => setActiveChecklist(isOpen ? null : cl.id)}
                                    className="w-full flex items-center justify-between p-4 bg-white rounded-xl hover:bg-neutral-page/30 transition-colors"
                                  >
                                      <div className="flex items-center gap-4">
                                          <div className={`p-2 rounded-lg ${isFullyApproved ? 'bg-green-50 text-state-success' : 'bg-blue-50 text-flexi-blue'}`}>
                                              {getDepartmentIcon(cl.department)}
                                          </div>
                                          <div className="text-left">
                                              <h4 className="font-bold text-neutral-primary">{cl.department} Clearance</h4>
                                              <p className="text-xs text-neutral-secondary">
                                                  {completedItems}/{totalItems} items verified
                                              </p>
                                          </div>
                                      </div>
                                      <div className="flex items-center gap-3">
                                          <span className={`text-xs font-bold px-2 py-1 rounded border ${
                                              cl.status === 'Approved' ? 'bg-green-50 text-state-success border-green-200' : 'bg-yellow-50 text-state-warning border-yellow-200'
                                          }`}>
                                              {cl.status}
                                          </span>
                                          {isOpen ? <ChevronDown className="w-4 h-4 text-neutral-muted" /> : <ChevronRight className="w-4 h-4 text-neutral-muted" />}
                                      </div>
                                  </button>
                                  
                                  {isOpen && (
                                      <div className="p-4 border-t border-neutral-border bg-neutral-page/10">
                                          <div className="space-y-2">
                                              {cl.items.map(item => (
                                                  <div 
                                                    key={item.id} 
                                                    onClick={() => toggleItemStatus(cl.id, item.id)}
                                                    className="flex items-center justify-between p-3 bg-white border border-neutral-border rounded-lg cursor-pointer hover:border-flexi-blue/50 transition-colors"
                                                  >
                                                      <span className={`text-sm font-medium ${item.status === 'Done' ? 'text-neutral-primary' : item.status === 'Blocked' ? 'text-neutral-400 line-through' : 'text-neutral-primary'}`}>
                                                          {item.label}
                                                      </span>
                                                      <div className={`flex items-center gap-2 px-2 py-1 rounded text-xs font-bold ${
                                                          item.status === 'Done' ? 'bg-green-50 text-state-success' : 
                                                          item.status === 'Blocked' ? 'bg-red-50 text-state-error' : 
                                                          'bg-neutral-100 text-neutral-500'
                                                      }`}>
                                                          {item.status === 'Done' && <CheckCircle2 className="w-3.5 h-3.5" />}
                                                          {item.status === 'Blocked' && <AlertTriangle className="w-3.5 h-3.5" />}
                                                          {item.status === 'Pending' && <Clock className="w-3.5 h-3.5" />}
                                                          {item.status}
                                                      </div>
                                                  </div>
                                              ))}
                                          </div>
                                          <div className="mt-4 flex justify-end">
                                              {cl.status === 'Pending' ? (
                                                  <button 
                                                    onClick={() => {
                                                        const updated = checklists.map(c => c.id === cl.id ? {...c, status: 'Approved' as const} : c);
                                                        setChecklists(updated);
                                                    }}
                                                    className="text-xs font-bold text-white bg-flexi-blue px-3 py-1.5 rounded hover:bg-flexi-end"
                                                  >
                                                      Mark as Approved
                                                  </button>
                                              ) : (
                                                  <button 
                                                    onClick={() => {
                                                        const updated = checklists.map(c => c.id === cl.id ? {...c, status: 'Pending' as const} : c);
                                                        setChecklists(updated);
                                                    }}
                                                    className="text-xs font-bold text-neutral-500 hover:text-neutral-800"
                                                  >
                                                      Revert to Pending
                                                  </button>
                                              )}
                                          </div>
                                      </div>
                                  )}
                              </div>
                          );
                      })}
                  </div>
              </div>
          </div>
      </div>

      {/* FINAL APPROVAL MODAL */}
      {isFinalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-primary/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-neutral-border animate-in zoom-in-95 duration-200 overflow-hidden">
                {/* Modal Header */}
                <div className="p-5 border-b border-neutral-border bg-neutral-page/30 flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-bold text-neutral-primary">Final Exit Approval</h3>
                        <p className="text-xs text-neutral-secondary">Review details before archiving.</p>
                    </div>
                    <button onClick={() => setIsFinalModalOpen(false)} className="p-2 hover:bg-neutral-border rounded-full text-neutral-muted">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-6">
                    
                    {/* Clearance Summary */}
                    <div className={`p-4 rounded-lg border flex items-start gap-3 ${pendingCount > 0 ? 'bg-orange-50 border-orange-200' : 'bg-green-50 border-green-200'}`}>
                        {pendingCount > 0 ? (
                            <AlertTriangle className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                        ) : (
                            <CheckCircle2 className="w-5 h-5 text-state-success shrink-0 mt-0.5" />
                        )}
                        <div>
                            <h4 className={`text-sm font-bold ${pendingCount > 0 ? 'text-orange-800' : 'text-green-800'}`}>
                                {pendingCount > 0 ? `${pendingCount} Departments Pending` : 'All Departments Cleared'}
                            </h4>
                            <div className="mt-2 flex flex-wrap gap-2">
                                {checklists.map(cl => (
                                    <span key={cl.id} className={`text-xs px-2 py-0.5 rounded border ${
                                        cl.status === 'Approved' ? 'bg-white border-green-200 text-green-700' : 'bg-white border-orange-200 text-orange-700'
                                    }`}>
                                        {cl.department}: {cl.status}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Exit Summary Text */}
                    <div>
                        <label className="text-xs font-bold text-neutral-secondary uppercase tracking-wider mb-2 block flex items-center gap-1">
                            <FileText className="w-3.5 h-3.5" /> Exit Summary
                        </label>
                        <textarea 
                            value={exitSummary}
                            onChange={(e) => setExitSummary(e.target.value)}
                            className="w-full h-24 p-3 text-sm border border-neutral-border rounded-lg bg-neutral-page/20 focus:bg-white focus:ring-2 focus:ring-flexi-blue outline-none resize-none"
                        />
                    </div>
                    
                    <div className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-state-error shrink-0" />
                        <p className="text-xs text-red-800 leading-relaxed">
                            <strong>Warning:</strong> Archiving this employee is a destructive action. Their system access will be revoked immediately, and their profile will be moved to the ex-employee database.
                        </p>
                    </div>

                </div>

                {/* Modal Footer */}
                <div className="p-5 border-t border-neutral-border bg-neutral-page/30 flex justify-end gap-3">
                    <button 
                        onClick={() => setIsFinalModalOpen(false)}
                        className="px-4 py-2 bg-white border border-neutral-border rounded-lg text-sm font-medium text-neutral-primary hover:bg-neutral-page transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleArchive}
                        className="px-4 py-2 bg-state-error text-white text-sm font-bold rounded-lg hover:bg-red-700 shadow-sm transition-colors flex items-center gap-2"
                    >
                        <Archive className="w-4 h-4" /> Archive Employee
                    </button>
                </div>
            </div>
        </div>
      )}

    </div>
  );
};

export default ExitDetails;
