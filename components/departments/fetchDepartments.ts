// src/pages/Departments/fetchDepartments.ts
import { api } from "@/components/api/client";

export type DepartmentsApiResponse = {
  data: any[];
  pagination: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
};

const fetchDepartments = async (
  companyId: number,
  page: number,
  perPage: number,
  search: string
): Promise<DepartmentsApiResponse> => {
  // ✅ since your route name is departments_index, most likely it's POST
  const res = await api.post("/departments/departments_index", {
    company_id: companyId,
    page,
    per_page: perPage,
    search: search || "", // if backend uses search
    // q: search || "",     // uncomment if backend uses q
  });

  return res.data;
};

export default fetchDepartments;
