// src/features/employeeTransfers/hooks/useTransferLookups.ts
import { useEffect, useMemo, useState } from "react";
import { api } from "@/components/api/client";

type ListMeta = { per_page?: any; total?: number; current_page?: number; last_page?: number; mode?: string };

type ApiDesignation = { id: number; title: string; active: number };
type ApiDepartment = { id: number; name: string; status?: string };
type ApiGrade = { id: number; name: string; active?: boolean };
type ApiLocation = { id: number; name: string; active?: boolean; location_type_name?: string | null };

type ApiListResponse<T> = { data: T[]; meta?: ListMeta };
export type Option = { value: number; label: string };

function getCompanyIdInternal(): number {
  const raw =
    localStorage.getItem("company_id") ||
    localStorage.getItem("companyId") ||
    localStorage.getItem("active_company_id");

  const n = raw ? Number(raw) : NaN;
  return Number.isFinite(n) && n > 0 ? n : 1; // safe default
}

export function useTransferLookups() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [designations, setDesignations] = useState<ApiDesignation[]>([]);
  const [departments, setDepartments] = useState<ApiDepartment[]>([]);
  const [grades, setGrades] = useState<ApiGrade[]>([]);
  const [locations, setLocations] = useState<ApiLocation[]>([]);

  useEffect(() => {
    let alive = true;

    async function load() {
      setLoading(true);
      setError("");

      try {
        const companyId = getCompanyIdInternal();

        const [desgRes, deptRes, gradeRes, locRes] = await Promise.all([
          api.post<ApiListResponse<ApiDesignation>>(
            "/meta/companies/designation/designation_index",
            {},
            { params: { per_page: "all" } }
          ),

          api.post<ApiListResponse<ApiDepartment>>(
            "/departments/departments_index",
            { company_id: companyId },
            { params: { per_page: "all" } }
          ),

          api.get<ApiListResponse<ApiGrade>>("/meta/employee/grade", {
            params: { per_page: "all" },
          }),

          api.get<ApiListResponse<ApiLocation>>("/meta/companies/locations", {
            params: { per_page: "all" },
          }),
        ]);

        if (!alive) return;

        setDesignations(desgRes.data?.data ?? []);
        setDepartments(deptRes.data?.data ?? []);
        setGrades(gradeRes.data?.data ?? []);
        setLocations(locRes.data?.data ?? []);
      } catch (e: any) {
        if (!alive) return;
        setError(e?.response?.data?.message || "Failed to load dropdown data.");
      } finally {
        if (alive) setLoading(false);
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, []);

  const designationOptions: Option[] = useMemo(
    () => (designations ?? []).filter((d) => !!d.active).map((d) => ({ value: d.id, label: d.title })),
    [designations]
  );

  const departmentOptions: Option[] = useMemo(
    () =>
      (departments ?? [])
        .filter((d) => (d.status ? d.status.toLowerCase() === "active" : true))
        .map((d) => ({ value: d.id, label: d.name })),
    [departments]
  );

  const gradeOptions: Option[] = useMemo(
    () => (grades ?? []).map((g) => ({ value: g.id, label: g.name })),
    [grades]
  );

  const locationOptions: Option[] = useMemo(
    () =>
      (locations ?? [])
        .filter((l) => (typeof l.active === "boolean" ? l.active : true))
        .map((l) => ({
          value: l.id,
          label: l.location_type_name ? `${l.name} (${l.location_type_name})` : l.name,
        })),
    [locations]
  );

  // helper to map id -> label (for review step)
  const maps = useMemo(() => {
    const toMap = (opts: Option[]) => new Map(opts.map((o) => [o.value, o.label] as const));
    return {
      designationMap: toMap(designationOptions),
      departmentMap: toMap(departmentOptions),
      gradeMap: toMap(gradeOptions),
      locationMap: toMap(locationOptions),
    };
  }, [designationOptions, departmentOptions, gradeOptions, locationOptions]);

  return {
    loading,
    error,
    designationOptions,
    departmentOptions,
    gradeOptions,
    locationOptions,
    ...maps,
  };
}
