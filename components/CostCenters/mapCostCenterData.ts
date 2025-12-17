import { CostCenterForUI } from "./types";

export const mapCostCenterData = (rows: any[]): CostCenterForUI[] => {
  return (rows || []).map((r: any) => ({
    id: Number(r.id),
    company_id: Number(r.company_id),
    code: r.code ?? null,
    name: r.name ?? "",
    department_id: r.department_id ?? null,
    location_id: r.location_id ?? null,
    is_draft: !!r.is_draft,
    active: !!r.active,

    valid_from: r.valid_from ?? null,

    department_name: r.department?.name ?? null,
    location_name: r.location?.name ?? null,
  }));
};
