// hooks/useDigitalPresence.ts
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/components/api/client";
import { useCompanyContext } from "@/context/CompanyContext";
import { toast } from "sonner";
import type { DigitalPresenceForm } from "./types";

/* -------------------- API response types -------------------- */

export interface SocialLink {
  url: string;
  handle: string;
  platform: string;
}

export interface Socials {
  id: number;
  company_id: number;
  links_json: SocialLink[]; // API still returns links_json
  support_email: string;
  is_draft: boolean;
  draft_batch_id: string;
  superseded_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse {
  success: boolean;
  data: {
    socials: Socials | null;
  };
}

export interface UpdateDigitalPresenceResponse {
  success: boolean;
  message?: string;
}

/* ------------------------ Query: get step-2 ------------------------ */

export const useDigitalPresenceQuery = () => {
  const { companyId } = useCompanyContext();

  const query = useQuery<ApiResponse>({
    queryKey: ["company-step-2", companyId],
    enabled: !!companyId,
    queryFn: async () => {
      const { data } = await api.get<ApiResponse>(
        `/v1/companies/${companyId}/setup/step-2`
      );
      return data;
    },
  });

  return query;
}

/* ---------------------- Mutation: update step-2 --------------------- */

export const useDigitalPresenceMutation = () => {
  const { companyId, draftBatchId } = useCompanyContext();
  const queryClient = useQueryClient();

  const mutation = useMutation<
    UpdateDigitalPresenceResponse,
    unknown,
    DigitalPresenceForm
  >({
    mutationFn: async (payload) => {
      if (!companyId || !draftBatchId) {
        throw new Error("Missing companyId or draftBatchId in context");
      }

      // 👇 We send exactly this shape:
      // {
      //   support_email: "...",
      //   links: [ { platform, url, handle? }, ... ]
      // }
      const { data } = await api.patch<UpdateDigitalPresenceResponse>(
        `/v1/companies/${companyId}/setup/step-2`,
        payload,
        {
          headers: {
            "draft-batch-id": draftBatchId,
          },
        }
      );

      return data;
    },
    onSuccess: (res) => {
      if (res?.success) {
        toast.success("Digital presence updated successfully");
      } else {
        toast.error(res?.message ?? "Error updating digital presence");
      }

      queryClient.invalidateQueries({ queryKey: ["company-step-2", companyId] });
    },
    onError: (error: any) => {
      // Handle error in toast
      console.error("Error updating digital presence:", error);
      
      // Show error message in toast
      if (error?.response?.data?.errors) {
        const errorMessages = error.response.data.errors;
        Object.values(errorMessages).forEach((messages: string[]) => {
          messages.forEach((message) => toast.error(message));
        });
      } else {
        toast.error("An error occurred while updating digital presence.");
      }
    },
  });

  return mutation;
};

/* --------------------- Combined hook for Step2 ---------------------- */

export const useDigitalPresence = () => {
  const { companyId } = useCompanyContext();
  const query = useDigitalPresenceQuery();
  const mutation = useDigitalPresenceMutation();

  return {
    companyId,
    socials: query.data?.data.socials ?? null,
    isLoading: query.isLoading,
    error: query.error,
    updateDigitalPresence: mutation.mutateAsync,
    isPending: mutation.isPending,
  };
};
