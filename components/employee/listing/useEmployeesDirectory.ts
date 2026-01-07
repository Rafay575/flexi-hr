import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { fetchEmployees, mapEmployee, sortKeyToApi } from "./employees";

export type SortDir = "asc" | "desc";

export type DirectoryServerState = {
  companyId: number;
  search: string;
  page: number;
  perPage: number;
  sortKey: string;    // e.g. "name"
  sortDir: SortDir;
  filters: {
    status?: string;        // could be "ACTIVE"
    status_id?: number;     // if you store id in filter
    department?: string;
    designation?: string;
  };
  infinite: boolean;
};

// Small helper: only send supported params
function buildParams(s: DirectoryServerState) {
  const params: any = {
    company_id: s.companyId,
    page: s.page,
    per_page: s.perPage,
    search: s.search || undefined,
    sort_by: sortKeyToApi[s.sortKey] ?? "first_name",
    sort_dir: s.sortDir,
  };

  // ✅ Status: support either id OR string
  if (s.filters.status_id) params.status_id = s.filters.status_id;
  else if (s.filters.status) params.status = s.filters.status;

  // ✅ Optional string filters (if your backend supports)
  if (s.filters.department) params.department = s.filters.department;
  if (s.filters.designation) params.designation = s.filters.designation;

  return params;
}

export function useEmployeesDirectory(state: DirectoryServerState) {
  // ✅ Normal pagination query
  const listQuery = useQuery({
    queryKey: ["employees", "list", buildParams(state)],
    queryFn: async () => {
      const json = await fetchEmployees(buildParams(state));
      return {
        rows: json.data.map(mapEmployee),
        meta: json.meta,
      };
    },
    enabled: !state.infinite,
    placeholderData: (prev) => prev, // keep previous data (smooth)
    staleTime: 10_000,
  });

  // ✅ Infinite query
  const infiniteQuery = useInfiniteQuery({
    queryKey: ["employees", "infinite", { ...buildParams({ ...state, page: 1 }) }],
    queryFn: async ({ pageParam = 1 }) => {
      const json = await fetchEmployees({ ...buildParams(state), page: pageParam });
      return {
        rows: json.data.map(mapEmployee),
        meta: json.meta,
      };
    },
    enabled: state.infinite,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { current_page, last_page } = lastPage.meta;
      return current_page < last_page ? current_page + 1 : undefined;
    },
    staleTime: 10_000,
  });

  const rows = state.infinite
    ? (infiniteQuery.data?.pages ?? []).flatMap((p) => p.rows)
    : listQuery.data?.rows ?? [];

  const meta = state.infinite
    ? infiniteQuery.data?.pages?.[infiniteQuery.data.pages.length - 1]?.meta
    : listQuery.data?.meta;

  return {
    rows,
    meta,
    isLoading: state.infinite ? infiniteQuery.isLoading : listQuery.isLoading,
    isFetching: state.infinite ? infiniteQuery.isFetching : listQuery.isFetching,

    // infinite actions
    fetchNextPage: infiniteQuery.fetchNextPage,
    hasNextPage: infiniteQuery.hasNextPage,

    // refetch
    refetch: state.infinite ? infiniteQuery.refetch : listQuery.refetch,
  };
}
