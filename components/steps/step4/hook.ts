
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/components/api/client";
import { useCompanyContext } from "@/context/CompanyContext";
import { toast } from "sonner";

import type {
  Step4ApiData,
  Step4FormValues,
  Step4SaveResponse,
  Step4DivisionApi,
  Step4DepartmentApi,
  Step4SubDepartmentApi,
} from "./types";

// 🔹 match your real backend response shape
type RawStep4Response = {
  success: boolean;
  data: {
    meta: {
      entity_type_id: number | null;
      business_line_id: number | null;
      location_type_id: number | null;
      // other meta fields we don't care about right now...
    } | null;
    divisions: Step4DivisionApi[];
  } | null;
};

// ─────────────────────────────────────
//  GET: /v1/companies/{id}/setup/step-4
// ─────────────────────────────────────
export function useGetCompanyStep4() {
  const { companyId, draftBatchId } = useCompanyContext();

  return useQuery<Step4ApiData | null>({
    queryKey: ["company-step-4", companyId, draftBatchId],
    enabled: !!companyId && !!draftBatchId,
    queryFn: async () => {
      const res = await api.get<RawStep4Response>(
        `/v1/companies/${companyId}/setup/step-4`,
        {
          headers: {
            "Draft-Batch-Id": draftBatchId ?? "",
            Accept: "application/json",
          },
        }
      );

      const payload = res.data.data;
      if (!payload) return null;

      const meta = payload.meta ?? null;

      // 🔥 reshape into the flat shape your Step4 form expects
      const transformed: Step4ApiData = {
        entity_type_id: meta?.entity_type_id ?? null,
        business_line_id: meta?.business_line_id ?? null,
        location_type_id: meta?.location_type_id ?? null,
        divisions: payload.divisions ?? [],
      };

      return transformed;
    },
    staleTime: 60_000,
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}


// ─────────────────────────────────────
//  POST: /v1/companies/{id}/setup/step-4
//  (create + update in one payload)
// ─────────────────────────────────────

export function useUpdateCompanyStep4() {
  const { companyId, draftBatchId } = useCompanyContext();
  const queryClient = useQueryClient();

  return useMutation<Step4SaveResponse, unknown, Step4FormValues>({
    mutationFn: async (values) => {
      if (!companyId || !draftBatchId) {
        throw new Error("Missing companyId or draftBatchId");
      }

      // Map RHF string IDs → numbers (or null) for API
      const payload: Step4ApiData = {
        entity_type_id: values.entity_type_id
          ? Number(values.entity_type_id)
          : null,
        business_line_id: values.business_line_id
          ? Number(values.business_line_id)
          : null,
        location_type_id: values.location_type_id
          ? Number(values.location_type_id)
          : null,

        divisions: (values.divisions ?? []).map((div): Step4DivisionApi => ({
          id: div.id ?? null,
          name: div.name,
          head_employee_id: div.head_employee_id ?? null,
          departments: (div.departments ?? []).map(
            (dept): Step4DepartmentApi => ({
              id: dept.id ?? null,
              name: dept.name,
              head_user_id: dept.head_user_id ?? null,
              sub_departments: (dept.sub_departments ?? []).map(
                (sd): Step4SubDepartmentApi => ({
                  id: sd.id ?? null,
                  name: sd.name,
                })
              ),
            })
          ),
        })),
      };

      // One endpoint for both create + update
      const res = await api.patch<Step4SaveResponse>(
        `/v1/companies/${companyId}/setup/step-4`,
        payload,
        {
          headers: {
            "Draft-Batch-Id": draftBatchId,
            Accept: "application/json",
          },
        }
      );

      return res.data;
    },

    onSuccess: (res) => {
      if (res?.success) {
        toast.success("Org structure saved.");
        queryClient.invalidateQueries({
          queryKey: ["company-step-4", companyId, draftBatchId],
        });
      } else {
        toast.error(res?.message || "Please review the organisation details.");
      }
    },

    onError: (error) => {
      console.error("Error saving step 4:", error);
      toast.error("Something went wrong while saving. Please try again.");
    },
  });
}



async function fetchBusinessLinesAll() {
  const res = await api.get("/meta/companies/business", {
    params: { per_page: "all" },
  });
  return res.data.data; // array only
}

async function fetchEntityTypesAll() {
  const res = await api.get("/meta/companies/entities", {
    params: { per_page: "all" },
  });
  return res.data.data;
}

async function fetchLocationTypesAll() {
  const res = await api.get("/meta/companies/location", {
    params: { per_page: "all" },
  });
  return res.data.data;
}

export type Option = { value: string; label: string };

export function useBusinessLineOptions() {
  return useQuery<Option[], Error>({
    queryKey: ["meta-business-lines-all"],
    queryFn: async () => {
      const list = await fetchBusinessLinesAll();
      return list.map((item: any) => ({
        value: String(item.id),
        label: item.name, // or item.code?
      }));
    },
    staleTime: 1000 * 60 * 10, // 10 mins
  });
}

// -------------------------------
//  ENTITY TYPES
// -------------------------------
export function useEntityTypeOptions() {
  return useQuery<Option[], Error>({
    queryKey: ["meta-entity-types-all"],
    queryFn: async () => {
      const list = await fetchEntityTypesAll();
      return list.map((item: any) => ({
        value: String(item.id),
        label: item.name,
      }));
    },
    staleTime: 1000 * 60 * 10,
  });
}

// -------------------------------
//  LOCATION TYPES
// -------------------------------
export function useLocationTypeOptions() {
  return useQuery<Option[], Error>({
    queryKey: ["meta-location-types-all"],
    queryFn: async () => {
      const list = await fetchLocationTypesAll();
      return list.map((item: any) => ({
        value: String(item.id),
        label: item.name,
      }));
    },
    staleTime: 1000 * 60 * 10,
  });
}
