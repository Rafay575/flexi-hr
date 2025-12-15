// utils/mapCostCenterData.ts
import { CostCenterForUI } from "./types";

export function mapCostCenterData(apiData: any[]): CostCenterForUI[] {
  return apiData.map((item) => ({
    id: item.id,
    company_id: item.company_id,
    code: item.code || "",
    name: item.name || "",
    department_id: item.department_id,
    department_name: item.department?.name || "",
    location_id: item.location_id,
    location_name: item.location?.name || "",
    parent_id: item.parent_id,
    parent_name: item.parent?.name || "",
    valid_from: item.valid_from,
    valid_to: item.valid_to,
    active: item.active || false,
    status: item.active ? "Active" : "Inactive",
    is_draft: item.is_draft || false,
    created_at: item.created_at,
    updated_at: item.updated_at,
  }));
}