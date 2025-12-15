// hooks/useCostCenterOptions.ts
import { useQuery } from "@tanstack/react-query";
import { api } from "@/components/api/client";

// Fetch all cost centers for parent dropdown
export async function fetchAllCostCenters(): Promise<{ value: string; label: string }[]> {
  try {
    const res = await api.get<{ data: any[] }>("/meta/companies/cost-centers", {
      params: { all: true, per_page: "all", active: true },
    });
    return (res.data?.data ?? []).map((item) => ({ 
      value: String(item.id), 
      label: `${item.code} - ${item.name}` 
    }));
  } catch (error) {
    console.error("Error fetching cost centers:", error);
    return [];
  }
}

// Fetch all locations for dropdown
export async function fetchAllLocations(): Promise<{ value: string; label: string }[]> {
  try {
    const res = await api.get<{ data: any[] }>("/meta/companies/locations", {
      params: { all: true, per_page: "all", status: "Active" },
    });
    return (res.data?.data ?? []).map((item) => ({ 
      value: String(item.id), 
      label: item.name 
    }));
  } catch (error) {
    console.error("Error fetching locations:", error);
    return [];
  }
}

// Fetch all departments for dropdown
export async function fetchAllDepartments(): Promise<{ value: string; label: string }[]> {
  try {
    const res = await api.get<{ data: any[] }>("/meta/companies/departments", {
      params: { all: true, per_page: "all", active: true },
    });
    return (res.data?.data ?? []).map((item) => ({ 
      value: String(item.id), 
      label: item.name 
    }));
  } catch (error) {
    console.error("Error fetching departments:", error);
    return [];
  }
}

// React Query hooks
export function useCostCenterOptions() {
  return useQuery({
    queryKey: ["cost-centers-all"],
    queryFn: fetchAllCostCenters,
    staleTime: 60 * 60 * 1000,
  });
}

export function useLocationOptions() {
  return useQuery({
    queryKey: ["locations-all"],
    queryFn: fetchAllLocations,
    staleTime: 60 * 60 * 1000,
  });
}

export function useDepartmentOptions() {
  return useQuery({
    queryKey: ["departments-all"],
    queryFn: fetchAllDepartments,
    staleTime: 60 * 60 * 1000,
  });
}