// src/types.ts

export type Employee = {
  id: string;

  // Table/UI fields used in Directory
  name: string;
  employeeId: string;
  role: string;
  department: string;
  location: string;
  joinDate: string;
  status: string;

  // Optional fields used in UI
  email: string;
  mobile?: string;
  grade: string;
  tags: string[];

  avatar: string;

  // API extras (optional)
  company?: string;
  gender?: { id: number; name: string };
};

export type FilterState = {
  department: string[];
  location: string[];
  grade: string[];
  status: string[]; // could be "ACTIVE" or "1" etc
  tags: string[];
  designation: string[];
};

export type SavedView = {
  id: string;
  name: string;
  filters: FilterState;
  isDefault?: boolean;
};
