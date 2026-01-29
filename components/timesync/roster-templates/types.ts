export type ShiftType = 'M' | 'E' | 'N' | 'F' | 'OFF';
export type PatternType = 'FIXED' | 'ROTATING' | 'CUSTOM';
export type TemplateStatus = 'ACTIVE' | 'DRAFT' | 'ARCHIVED';
export type RotationDirection = 'FORWARD' | 'BACKWARD';

export interface RosterTemplate {
  id: string;
  name: string;
  description: string;
  patternType: PatternType;
  patternTypeLabel: string;
  cycleDays: number;
  includedShifts: ShiftType[];
  activeTeamsCount: number;
  status: TemplateStatus;
  createdAt: Date;
  updatedAt: Date;
  patternMatrix?: ShiftType[][]; // 2D array: [week][day] = ShiftType
  numberOfTeams?: number;
  rotationDirection?: RotationDirection;
}

export interface PatternInsights {
  coverageType: '24/7 Continuity' | 'Business Hours' | 'Custom';
  weekendEquity: 'High (Rotational)' | 'Medium' | 'Low (Fixed)';
  restCompliance: {
    passed: boolean;
    violations: string[];
  };
  summary: string;
}

export interface ShiftTypeConfig {
  code: ShiftType;
  label: string;
  color: string;
  bgColor: string;
  textColor: string;
  borderColor?: string;
}

export interface DayCell {
  week: number;
  day: number;
  shift: ShiftType;
  isDisabled: boolean;
}