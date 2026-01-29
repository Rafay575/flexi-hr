export type ShiftType = 'FIXED' | 'FLEXI' | 'ROTATING' | 'SPLIT' | 'RAMZAN';
export type ShiftStatus = 'ACTIVE' | 'INACTIVE';
export type DayOfWeek = 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN';

export interface GracePeriod {
  in: number; // minutes
  out: number; // minutes
  earlyOut?: number; // minutes
  halfDay?: number; // hours
}

export interface BreakConfig {
  duration: number; // minutes
  startTime: string; // HH:MM format
  isPaid: boolean;
}

export interface OvertimeConfig {
  dailyThreshold: number; // hours
  weeklyThreshold: number; // hours
  rateMultiplier: number; // e.g., 1.5
}

export interface ShiftTemplate {
  id: string;
  code: string;
  name: string;
  description?: string;
  type: ShiftType;
  status: ShiftStatus;
  employeeCount?: number;
  department?: string;
  location?: string;
  effectiveFrom?: string; // ISO date string
  effectiveTo?: string; // ISO date string
  createdBy: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface ShiftTypeConfig {
  type: ShiftType;
  label: string;
  description: string;
  color: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
  icon: React.ReactNode;
}

export interface DayConfig {
  code: DayOfWeek;
  label: string;
  shortLabel: string;
  isWeekend: boolean;
}