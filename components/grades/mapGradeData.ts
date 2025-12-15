// src/pages/Grades/mapGradeData.ts
import { GradeForUI } from "./types";

export const mapGradeData = (rows: any[]): GradeForUI[] => {
  return (rows || []).map((r) => ({
    id: Number(r.id),
    name: r.name ?? "—",
    code: r.code ?? "",
    hierarchy_level: r.hierarchy_level ?? null,

    currency_id: r.currency_id ?? null,
    currency_name: r.currency_name ?? null,
    currency_code: r.currency_code ?? null,

    min_base_salary: r.min_base_salary ?? "0.00",
    max_base_salary: r.max_base_salary ?? "0.00",

    active: Boolean(r.active),
    created_at: r.created_at,
    updated_at: r.updated_at,
  }));
};
