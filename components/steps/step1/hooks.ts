// hooks/useCompanyStep1.ts
"use client";
import { AxiosError } from "axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "@/components/api/client";
import { toast } from "sonner";
import { useCompanyContext } from "@/context/CompanyContext";
import {
  ApiResponse,
  CompanyFormValues,
  CompanyStep1Data,
} from "./types";

const buildFormData = (payload: CompanyFormValues) => {
  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;

    if (key === "logo_path" && value instanceof File) {
      formData.append("logo_path", value);
    } else {
      formData.append(key, String(value));
    }
  });

  return formData;
};

// Fetch existing company details for prefill
export const useCompanyStep1Query = () => {
  const { companyId } = useCompanyContext();
  console.log("companyId:1 =", companyId);
  const hasCompany = !!companyId;

  const query = useQuery<ApiResponse<CompanyStep1Data>>({
    queryKey: ["company-step-1", companyId],
    enabled: hasCompany, // <- will not fire when creating first time
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<CompanyStep1Data>>(
        `/v1/companies/${companyId}/setup/step-1`
      );
      return data;
    },
  });

  return { ...query, hasCompany };
};
function isAxiosError(error: unknown): error is AxiosError {
  return (error as AxiosError).response !== undefined;
}


interface ErrorResponse {
  errors: Record<string, string[]>;
  message: string;
}

export const useCompanyStep1Mutation = () => {
  const { companyId, draftBatchId, setCompanyData } = useCompanyContext();

  const mutation = useMutation<
    ApiResponse<CompanyStep1Data>,
    AxiosError<ErrorResponse>, // Explicitly typing error
    CompanyFormValues
  >({
    mutationFn: async (payload) => {
      const formData = buildFormData(payload);

      if (companyId && draftBatchId) { 
       
        const { data } = await api.post<ApiResponse<CompanyStep1Data>>(
          `/v1/companies/${companyId}/setup/step-1`,
          formData,
          {
            headers: {
              Accept: "application/json",
              "draft-batch-id": draftBatchId,
            },
          }
        );
        return data;
      }

      const { data } = await api.post<ApiResponse<CompanyStep1Data>>(
        "/v1/companies/store",
        formData,
        {
          headers: {
            Accept: "application/json",
              "draft-batch-id": draftBatchId,
          },
        }
      );
      return data;
    },
    onSuccess: (res, _vars, _ctx) => {
      if (res?.success && res.data?.company) {
        const { id } = res.data.company;
        const draftId = res.data.draft_batch_id;
        if (id && draftId) {
          setCompanyData(id, draftId);
        }
      }

      toast.success(
        companyId
          ? "Company details updated successfully"
          : "Company created successfully"
      );
    },
    onError: (error) => {
      console.error("Error saving company step 1:", error);

      // Access error.response.data.errors directly because we typed AxiosError
      if (error.response?.data?.errors) {
        const errorMessages = Object.values(error.response.data.errors)
          .flat()
          .join("\n");

        toast.error(errorMessages || "Network error or server issue. Please try again later.");
      } else {
        toast.error("Network error or server issue. Please try again later.");
      }
    },
  });

  return mutation;
};
// Nice combined hook for Step1
// Nice combined hook for Step1
export const useCompanyStep1 = () => {
  const { companyId } = useCompanyContext();
  const query = useCompanyStep1Query();
  const mutation = useCompanyStep1Mutation();

  const hasCompany = query.hasCompany;

  return {
    companyId: companyId ?? null,
    companyData: hasCompany ? query.data?.data ?? null : null,
    isPrefillLoading: hasCompany ? query.isLoading : false,
    prefillError: hasCompany ? query.error : null,
    saveCompany: mutation.mutateAsync,
    isSaving: mutation.isPending,
    // when there's no company yet, refetch is basically a no-op
    refetch: hasCompany ? query.refetch : async () => {},
  };
};

