import React from 'react';
import { ArrowUpRight, ArrowDownRight, Users, UserPlus, UserMinus, ArrowRightLeft } from 'lucide-react';
import { StatMetric } from '../types';

interface StatCardProps {
  metric: StatMetric;
}

const StatCard: React.FC<StatCardProps> = ({ metric }) => {
  const getIcon = () => {
    switch (metric.id) {
      case 'total': return <Users className="h-5 w-5 " />;
      case 'new': return <UserPlus className="h-5 w-5 " />;
      case 'exits': return <UserMinus className="h-5 w-5 " />;
      case 'transfers': return <ArrowRightLeft className="h-5 w-5 " />;
      default: return <Users className="h-5 w-5 " />;
    }
  };

  const getIconBg = () => {
    switch (metric.color) {
      case 'blue': return 'bg-flexi-primary';
      case 'success': return 'bg-state-success';
      case 'warning': return 'bg-flexi-gold';
      case 'error': return 'bg-flexi-coral';
      default: return 'bg-flexi-primary';
    }
  };

  const getTrendColor = () => {
      if (metric.trendUp) return 'text-state-success'; 
      return 'text-flexi-coral'; 
  };

  return (
    <div className="bg-neutral-card rounded-xl p-6 shadow-card border border-neutral-border/60 hover:shadow-soft transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${getIconBg()} shadow-md`}>
          {getIcon()}
        </div>
        {metric.trend && (
          <div className={`flex items-center text-xs font-bold ${getTrendColor()} bg-neutral-page px-2 py-1 rounded-md`}>
            {metric.trendUp ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
            {metric.trend}
          </div>
        )}
      </div>
      <div>
        <p className="text-neutral-secondary text-xs font-bold uppercase tracking-wider opacity-80">{metric.label}</p>
        <h3 className="text-4xl font-bold text-flexi-primary mt-1 font-sans">{metric.value}</h3>
      </div>
    </div>
  );
};

export default StatCard;