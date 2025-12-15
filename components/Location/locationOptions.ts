// lib/locationOptions.ts
import { api } from "@/components/api/client";

type ApiItem = { id: number; name: string };

// ——— Fetch all countries ———
export async function fetchAllCountries(): Promise<{ value: string; label: string }[]> {
  try {
    const res = await api.get<{ data: ApiItem[] }>("/countries", {
      params: { all: true, per_page: "all" },
    });
    return (res.data?.data ?? []).map((c) => ({ 
      value: String(c.id), 
      label: c.name 
    }));
  } catch (error) {
    console.error("Error fetching countries:", error);
    return [];
  }
}

// ——— Fetch states by country ID ———
export async function fetchStatesByCountry(
  countryId?: string
): Promise<{ value: string; label: string }[]> {
  if (!countryId) return [];
  try {
    const res = await api.get<{ data: ApiItem[] }>("/states", {
      params: { country_id: countryId, all: true, per_page: "all" },
    });
    return (res.data?.data ?? []).map((s) => ({ 
      value: String(s.id), 
      label: s.name 
    }));
  } catch (error) {
    console.error("Error fetching states:", error);
    return [];
  }
}

// ——— Fetch cities by state ID ———
export async function fetchCitiesByState(
  stateId?: string
): Promise<{ value: string; label: string }[]> {
  if (!stateId) return [];
  try {
    const res = await api.get<{ data: ApiItem[] }>("/cities", {
      params: { state_id: stateId, all: true, per_page: "all" },
    });
    return (res.data?.data ?? []).map((c) => ({ 
      value: String(c.id), 
      label: c.name 
    }));
  } catch (error) {
    console.error("Error fetching cities:", error);
    return [];
  }
}

// ——— Fetch all location types ———
export async function fetchAllLocationTypes(): Promise<{ value: string; label: string }[]> {
  try {
    const res = await api.get<{ data: any[] }>("/meta/companies/location", {
      params: { per_page: "all" },
    });
    return (res.data?.data ?? []).map((item) => ({ 
      value: String(item.id), 
      label: item.name,
      code: item.code,
      abbrev: item.abbrev,
      scope: item.scope,
      active: item.active,
    }));
  } catch (error) {
    console.error("Error fetching location types:", error);
    return [];
  }
}

// ——— Fetch timezones ———
export async function fetchTimezones(): Promise<{ value: string; label: string }[]> {
  // You can fetch these from your API or use a static list
  const timezones = [
    { value: "UTC", label: "UTC" },
    { value: "America/New_York", label: "EST (America/New_York)" },
    { value: "America/Chicago", label: "CST (America/Chicago)" },
    { value: "America/Denver", label: "MST (America/Denver)" },
    { value: "America/Los_Angeles", label: "PST (America/Los_Angeles)" },
    { value: "Europe/London", label: "GMT (Europe/London)" },
    { value: "Asia/Kolkata", label: "IST (Asia/Kolkata)" },
  ];
  return timezones;
}