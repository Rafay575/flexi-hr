import React from 'react';
import { UpcomingEvent } from '../types';
import { Calendar, UserPlus, LogOut } from 'lucide-react';

interface UpcomingEventsProps {
  events: UpcomingEvent[];
}

const UpcomingEvents: React.FC<UpcomingEventsProps> = ({ events }) => {
  return (
    <div className="bg-neutral-card rounded-xl shadow-card border border-neutral-border ">
      <div className="p-6 border-b border-neutral-border">
        <h3 className="font-bold text-flexi-primary text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5 text-flexi-gold" />
            Upcoming Joinings & Exits
        </h3>
      </div>
      <div className="p-5 space-y-4">
        {events.map((event) => (
          <div key={event.id} className="flex items-center gap-4 p-4 rounded-xl border border-neutral-border bg-neutral-page/30 hover:bg-neutral-page hover:border-flexi-primary/20 transition-all">
            <div className={`p-2.5 rounded-lg ${event.type === 'joining' ? 'bg-green-50 text-state-success' : 'bg-flexi-coral-light text-flexi-coral'}`}>
               {event.type === 'joining' ? <UserPlus className="h-5 w-5" /> : <LogOut className="h-5 w-5" />}
            </div>
            <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-neutral-primary">{event.name}</h4>
                <p className="text-xs text-neutral-secondary truncate font-medium">{event.role} • {event.department}</p>
            </div>
            <div className="text-right">
                <p className="text-xs font-bold text-flexi-primary bg-white px-3 py-1.5 rounded-lg border border-neutral-border shadow-sm">
                    {event.date}
                </p>
            </div>
          </div>
        ))}
        <button className="w-full py-3 text-xs font-bold text-neutral-secondary border border-dashed border-neutral-muted/50 rounded-xl hover:bg-flexi-light hover:border-flexi-primary hover:text-flexi-primary transition-all">
            View Calendar
        </button>
      </div>
    </div>
  );
};

export default UpcomingEvents;