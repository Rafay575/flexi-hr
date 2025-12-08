import React from 'react';
import { ActivityItem } from '../types';
import { Clock } from 'lucide-react';

interface RecentActivityProps {
  activities: ActivityItem[];
}

const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => {
  return (
    <div className="bg-neutral-card rounded-xl shadow-card border border-neutral-border flex flex-col h-full">
      <div className="p-6 border-b border-neutral-border flex justify-between items-center">
        <h3 className="font-bold text-flexi-primary text-lg flex items-center gap-2">
            <Clock className="h-5 w-5 text-flexi-gold" />
            Recent Activity
        </h3>
        <button className="text-xs font-bold text-flexi-primary hover:text-flexi-secondary uppercase tracking-wide">View All</button>
      </div>
      <div className="p-0">
        {activities.map((item, index) => (
          <div 
            key={item.id} 
            className={`flex items-start gap-4 p-5 hover:bg-neutral-page/50 transition-colors ${index !== activities.length - 1 ? 'border-b border-neutral-border/50' : ''}`}
          >
            <img 
              src={item.avatarUrl} 
              alt={item.user} 
              className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-neutral-primary truncate">
                <span className="font-bold">{item.user}</span> 
                <span className="text-neutral-secondary font-medium"> {item.action} </span>
                {item.target && <span className="font-bold text-flexi-primary">{item.target}</span>}
              </p>
              <p className="text-xs text-neutral-muted mt-1 font-medium">{item.time}</p>
            </div>
            <div className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${
                item.type === 'onboard' ? 'bg-state-success' :
                item.type === 'exit' ? 'bg-flexi-coral' :
                item.type === 'transfer' ? 'bg-flexi-gold' :
                'bg-flexi-primary'
            }`} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;