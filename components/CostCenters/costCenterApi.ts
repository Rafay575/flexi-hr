// lib/costCenterApi.ts
import { api } from "@/components/api/client";

export interface CostCenterResponse {
  data: any[];
  meta: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
}

// Fetch all cost centers
export async function fetchCostCenters(
  companyId: number,
  page: number = 1,
  perPage: number = 10,
  search: string = ""
): Promise<CostCenterResponse> {
  const response = await api.get("/meta/companies/cost-centers", {
    params: {
      company_id: companyId,
      page,
      per_page: perPage,
      search,
    },
  });
  return response.data;
}

// Fetch single cost center
export async function fetchCostCenter(id: number) {
  const response = await api.get(`/meta/companies/cost-centers/${id}`);
  return response.data;
}

// Create cost center
export async function createCostCenter(data: any) {
  const response = await api.post("/meta/companies/cost-centers/store", data);
  return response.data;
}

// Update cost center
export async function updateCostCenter(id: number, data: any) {
  const response = await api.put(`/meta/companies/cost-centers/update/${id}`, data);
  return response.data;
}

// Delete cost center
export async function deleteCostCenter(id: number) {
  const response = await api.delete(`/meta/companies/cost-centers/delete/${id}`);
  return response.data;
}