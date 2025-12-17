// src/pages/Designations/fetchDesignations.ts
import { api } from "@/components/api/client";

export type DesignationsMode = "list" | "tree";

export type DesignationsApiResponse = {
  data: any[];
  meta: {
    total: number;
    mode?: DesignationsMode;
    per_page?: number;
    current_page?: number;
    last_page?: number;
  };
};

const fetchDesignations = async (
  companyId: number,
  page: number,
  perPage: number,
  search: string,
  mode: DesignationsMode = "list"
): Promise<DesignationsApiResponse> => {
  const isTree = mode === "tree";

  const res = await api.post(
    "/meta/companies/designation/designation_index",
    {
      company_id: companyId,
      search: search || "",
      mode, // ✅ IMPORTANT
    },
    {
      // ✅ In tree mode, most backends return “full tree” (pagination usually not meaningful)
      params: isTree
        ? { page: 1, per_page: 1000 }
        : { page, per_page: perPage },
    }
  );

  return res.data;
};

export default fetchDesignations;
