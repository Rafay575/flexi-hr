// hooks/useCompanyStep3.ts
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api/client";
import { useCompanyContext } from "@/context/CompanyContext";
import { toast } from "sonner";
import type {
  CompanyStep3ApiData,
  CompanyStep3Form,
  CompanyStep3GetResponse,
  CompanyStep3SaveResponse,
} from "./types";

// ---------- GET: /v1/companies/{id}/setup/step-3 ----------
export function useGetCompanyStep3() {
  const { companyId, draftBatchId } = useCompanyContext();

  return useQuery<CompanyStep3ApiData | null>({
    queryKey: ["company-step-3", companyId, draftBatchId],
    enabled: !!companyId && !!draftBatchId,
    queryFn: async () => {
      const res = await api.get<CompanyStep3GetResponse>(
        `/v1/companies/${companyId}/setup/step-3`,
        {
          headers: { "Draft-Batch-Id": draftBatchId! },
        }
      );

      // ⬅️ take the `legal` object from data
      return res.data.data.legal ?? null;
    },
    refetchOnMount: "always",
    refetchOnWindowFocus: "always",
    refetchOnReconnect: "always",
    staleTime: 0,
  });
}


// ---------- POST (PATCH override): /v1/companies/{id}/setup/step-3 ----------
export function useUpdateCompanyStep3() {
  const { companyId, draftBatchId } = useCompanyContext();
  const queryClient = useQueryClient();

  return useMutation<CompanyStep3SaveResponse, unknown, CompanyStep3Form>({
    mutationFn: async (values) => {
      if (!companyId || !draftBatchId) {
        throw new Error("Missing companyId or draftBatchId");
      }

      const formData = new FormData();

      formData.append("registered_email", values.registered_email);
      formData.append("main_phone", values.main_phone);
      formData.append("timezone", values.timezone);

      formData.append("address_line_1", values.address_line_1);
       if (values.address_line_2) {
      formData.append("address_line_2", values.address_line_2);
       }
      formData.append("country_id", values.country_id);
      formData.append("state_id", values.state_id);
      formData.append("city_id", values.city_id);

      formData.append("street", values.street);
      formData.append("zip", values.zip);

      if (values.established_on) {
        formData.append("established_on", values.established_on);
      }
      if (values.registration_no) {
        formData.append("registration_no", values.registration_no);
      }
      if (values.tax_vat_id) {
        formData.append("tax_vat_id", values.tax_vat_id);
      }

      formData.append("currency_id", values.currency_id);

      // file upload
      const file = values.letterhead as File | null | undefined;
      if (file instanceof File) {
        formData.append("letterhead", file);
      }

      // Laravel-style PATCH override
      formData.append("_method", "PATCH");

      const res = await api.post<CompanyStep3SaveResponse>(
        `/v1/companies/${companyId}/setup/step-3`,
        formData,
        {
          headers: {
            "Draft-Batch-Id": draftBatchId,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return res.data;
    },

    onSuccess: (res) => {
      if (res?.success) {
        toast("Your registered details have been updated.");

        queryClient.invalidateQueries({
          queryKey: ["company-step-3", companyId, draftBatchId],
        });
      } else {
        toast("Please review the form and try again.");
      }
    },

    onError: (error) => {
      console.error("Error saving step 3:", error);
      toast("Something went wrong while saving. Please try again.");
    },
  });
}
