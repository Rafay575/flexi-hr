// src/pages/Departments/mapDepartmentData.ts
import { DepartmentForUI } from "./types";

export const mapDepartmentData = (rows: any[]): DepartmentForUI[] => {
  return (rows || []).map((r) => ({
    id: Number(r.id),
    company_id: Number(r.company_id),
    division_id: Number(r.division_id),
    cost_centre_id: r.cost_centre_id ?? null,

    unit_type: r.unit_type ?? "Department",
    name: r.name ?? "—",
    short_name: r.short_name ?? "",
    category: r.category ?? "—",
    status: r.status ?? "Inactive",

    description: r.description ?? "",
    code: r.code ?? "",
    sort_order: r.sort_order ?? 0,

    is_draft: r.is_draft ?? 0,

    company_name: r.company?.legal_name ?? "—",
    division_name: r.division?.name ?? "—",
    cost_centre_name: r.cost_centre?.name ?? "—",
  }));
};
