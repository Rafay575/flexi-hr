import { api } from "@/components/api/client";

export default async function fetchCostCenters(
  companyId: number,
  page: number,
  perPage: number,
  search: string
) {
  // Your endpoint example: GET /meta/companies/cost-centers
  // If your API needs company_id in params, keep it.
  const res = await api.get("/meta/companies/cost-centers", {
    params: {
      company_id: companyId,
      page,
      per_page: perPage,
      q: search || undefined,
    },
  });

  return res.data; // {data:[], meta:{}}
}
