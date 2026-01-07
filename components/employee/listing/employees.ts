import { api } from "@/components/api/client";


// ✅ Server shape (based on your response)
export type EmployeeApiItem = {
  id: number;
  employee_code: string;
  full_name: string;
  email: string | null;
  mobile: string | null;
  department: string | null;
  designation: string | null;
  date_of_joining: string | null;
  status: string; // e.g. "ACTIVE"
  company?: string | null;
};

export type EmployeesApiResponse = {
  success: boolean;
  data: EmployeeApiItem[];
  meta: {
    mode: "list" | string;
    total: number;
    current_page: number;
    last_page: number;
    per_page: number;
  };
};

// ✅ Your UI type (match your existing Employee interface)
export type UiEmployee = {
  id: string;
  name: string;
  employeeId: string;
  role: string;
  department: string;
  location: string; // API doesn't provide; we can show company or "-"
  joinDate: string;
  status: string;
  email: string;
  avatar: string;
  grade: string;
  tags: string[];
};

const fallbackAvatar = (name: string) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=EDEBFF&color=1E1B4B`;

// ✅ Map API -> UI
export const mapEmployee = (e: EmployeeApiItem): UiEmployee => ({
  id: String(e.id),
  name: e.full_name ?? "-",
  employeeId: e.employee_code ?? "-",
  role: e.designation ?? "-",
  department: e.department ?? "-",
  location: e.company ?? "-", // not in API, so using company
  joinDate: e.date_of_joining ? new Date(e.date_of_joining).toLocaleDateString() : "-",
  status: e.status ?? "-",
  email: e.email ?? "-",
  avatar: fallbackAvatar(e.full_name ?? "User"),
  grade: "-", // not in API
  tags: [], // not in API
});

// ✅ Sort mapping (UI -> API sort_by)
export const sortKeyToApi: Record<string, string> = {
  name: "first_name",          // your screenshot uses first_name
  employeeId: "employee_code",
  role: "designation",
  department: "department",
  location: "company",
  joinDate: "date_of_joining",
  status: "status",
};

export type EmployeesQueryParams = {
  company_id: number;
  search?: string;
  page?: number;
  per_page?: number;
  sort_by?: string;
  sort_dir?: "asc" | "desc";

  // Optional (send if backend supports)
  status_id?: number | string;
  status?: string;

  department?: string;
  designation?: string;
};

// ✅ Axios call
export async function fetchEmployees(params: EmployeesQueryParams) {
  const res = await api.get<EmployeesApiResponse>("/employees", { params });
  return res.data;
}
