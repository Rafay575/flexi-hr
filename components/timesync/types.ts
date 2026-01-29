export interface Employee {
  id: string;
  name: string;
  avatar: string;
  dept: string;
  department?: string;
  subDepartment?: string;
  division?: string;
  company?: string;
  currentShift?: string;
  location?: string;
}

export type ShiftCode = 'M' | 'E' | 'N' | 'F' | 'OFF' | 'H' | 'L';

export interface ShiftStyle {
  label: string;
  bg: string;
  text: string;
  border?: string;
}