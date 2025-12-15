// hooks/useLocationOptions.ts
import { useQuery } from "@tanstack/react-query";
import {
  fetchAllCountries,
  fetchStatesByCountry,
  fetchCitiesByState,
  fetchAllLocationTypes,
  fetchTimezones,
} from "./locationOptions";

// Country options
export function useCountryOptions() {
  return useQuery({
    queryKey: ["countries-all"],
    queryFn: fetchAllCountries,
    staleTime: 60 * 60 * 1000, // 1 hour
    refetchOnWindowFocus: false,
  });
}

// State options
export function useStateOptions(countryId?: string) {
  return useQuery({
    queryKey: ["states-by-country", countryId],
    queryFn: () => fetchStatesByCountry(countryId),
    enabled: !!countryId,
    staleTime: 30 * 60 * 1000, // 30 min
  });
}

// City options
export function useCityOptions(stateId?: string) {
  return useQuery({
    queryKey: ["cities-by-state", stateId],
    queryFn: () => fetchCitiesByState(stateId),
    enabled: !!stateId,
    staleTime: 30 * 60 * 1000,
  });
}

// Location type options
export function useLocationTypeOptions() {
  return useQuery({
    queryKey: ["location-types-all"],
    queryFn: fetchAllLocationTypes,
    staleTime: 60 * 60 * 1000, // 1 hour
    refetchOnWindowFocus: false,
  });
}

// Timezone options
export function useTimezoneOptions() {
  return useQuery({
    queryKey: ["timezones"],
    queryFn: fetchTimezones,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    refetchOnWindowFocus: false,
  });
}