import React from 'react';
import { Plus, Users, ArrowRightLeft, LogOut, UploadCloud, ChevronRight } from 'lucide-react';

interface QuickActionProps {
  type: 'add' | 'directory' | 'transfer' | 'exit' | 'upload';
  onClick?: () => void;
}

const QuickAction: React.FC<QuickActionProps> = ({ type, onClick }) => {
  let label = '';
  let description = '';
  let Icon = Users;
  let colorClass = '';
  let iconBgClass = '';

  switch (type) {
    case 'add':
      label = 'Add Employee';
      description = 'Start OnboardX';
      Icon = Plus;
      colorClass = 'group-hover:text-primary';
      iconBgClass = 'text-primary bg-light';
      break;
    case 'directory':
      label = 'Directory';
      description = 'View staff';
      Icon = Users;
      colorClass = 'group-hover:text-state-success';
      iconBgClass = 'text-state-success bg-green-50';
      break;
    case 'transfer':
      label = 'Transfer';
      description = 'Dept/Role';
      Icon = ArrowRightLeft;
      colorClass = 'group-hover:text-gold';
      iconBgClass = 'text-gold bg-gold-light'; // Use Gold tint
      break;
    case 'exit':
      label = 'Offboard';
      description = 'Start Exit';
      Icon = LogOut;
      colorClass = 'group-hover:text-coral';
      iconBgClass = 'text-coral bg-coral-light'; // Use Coral tint
      break;
    case 'upload':
      label = 'Uploads';
      description = 'Bulk import';
      Icon = UploadCloud;
      colorClass = 'group-hover:text-secondary';
      iconBgClass = 'text-secondary bg-neutral-page';
      break;
  }

  return (
    <button 
      onClick={onClick}
      className="flex flex-col items-start p-5 rounded-xl border border-neutral-border bg-neutral-card hover:bg-neutral-page/50 hover:border-primary/30 hover:shadow-soft transition-all duration-300 group w-full text-left"
    >
      <div className={`p-3 rounded-xl mb-3 ${iconBgClass} transition-colors`}>
        <Icon className="h-6 w-6" />
      </div>
      <div className="w-full">
        <div className="flex justify-between items-center">
            <h4 className={`font-bold text-neutral-primary text-sm ${colorClass} transition-colors`}>{label}</h4>
            <ChevronRight className="h-4 w-4 text-neutral-muted  transition-opacity -translate-x-2 group-hover:translate-x-0" />
        </div>
        <p className="text-xs text-neutral-secondary font-medium mt-1">{description}</p>
      </div>
    </button>
  );
};

export default QuickAction;