// src/pages/Designations/mapDesignationData.ts
import { DesignationForUI } from "./types";

export const mapDesignationData = (rows: any[]): DesignationForUI[] => {
  return rows.map((r) => ({
    id: r.id,
    company_id: r.company_id,
    department_id: r.department_id,
    grade_id: r.grade_id ?? null,
    reports_to_id: r.reports_to_id ?? null,

    title: r.title,
    code: r.code ?? null,
    job_level: r.job_level ?? null,

    active: r.active == 1 || r.active === true,

    company_name: r.company_name ?? null,
    department_name: r.department_name ?? null,
    grade_name: r.grade_name ?? null,
    reports_to_title: r.reports_to_title ?? null,

    // ✅ new
    active_emp_count: r.active_emp_count ?? 0,
  }));
};
