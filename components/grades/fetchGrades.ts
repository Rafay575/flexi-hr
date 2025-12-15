// src/pages/Grades/fetchGrades.ts
import { api } from "@/components/api/client";

export type GradesApiResponse = {
  data: any[];
  meta: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
};

const fetchGrades = async (
  page: number,
  perPage: number,
  search: string
): Promise<GradesApiResponse> => {
  const res = await api.get("/meta/employee/grade", {
    params: {
      page,
      per_page: perPage,
      search: search || "", // if backend uses `search`
      // q: search || "",     // uncomment if your backend uses `q` instead
    },
  });

  return res.data;
};

export default fetchGrades;
