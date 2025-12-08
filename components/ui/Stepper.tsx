
import React from 'react';
import { Check } from 'lucide-react';

export interface Step {
  id: string;
  title: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
}

export const Stepper: React.FC<StepperProps> = ({ steps, currentStep }) => {
  return (
    <div className="flex items-center w-full mb-8">
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;
        const isLast = index === steps.length - 1;

        return (
          <React.Fragment key={step.id}>
            <div className="flex items-center relative">
              <div 
                className={`
                  flex items-center justify-center w-8 h-8 rounded-full border-2 text-sm font-semibold transition-colors
                  ${isCompleted 
                    ? 'bg-primary-600 border-primary-600 text-white' 
                    : isCurrent 
                      ? 'border-primary-600 text-primary-600 bg-white' 
                      : 'border-slate-300 text-slate-500 bg-white'
                  }
                `}
              >
                {isCompleted ? <Check size={16} /> : index + 1}
              </div>
              <span 
                className={`
                  absolute top-10 w-32 -left-12 text-center text-xs font-medium transition-colors
                  ${isCurrent ? 'text-primary-600' : isCompleted ? 'text-slate-900' : 'text-slate-400'}
                `}
              >
                {step.title}
              </span>
            </div>
            
            {!isLast && (
              <div className={`flex-1 h-0.5 mx-2 min-w-[20px] transition-colors ${isCompleted ? 'bg-primary-600' : 'bg-slate-200'}`}></div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
