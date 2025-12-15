import { Location, LocationForUI } from './types';

// mapLocationData.ts
export function mapLocationData(apiData: any[]): LocationForUI[] {
  return apiData.map((item) => ({
    id: item.id,
    name: item.name,
    location_code: item.location_code || "",
    address: item.address || "",
    
    // Make sure your API returns these ID fields
    location_type_id: item.location_type_id,
    country_id: item.country_id,
    state_id: item.state_id,
    city_id: item.city_id,
    
    // Display names
    location_type_name: item.location_type?.name || item.location_type_name || "",
    country_name: item.country?.name || item.country_name || "",
    state_name: item.state?.name || item.state_name || "",
    city_name: item.city?.name || item.city_name || "",
    
    // Other fields
    timezone: item.timezone || "UTC",
    is_virtual: item.is_virtual || false,
    active: item.active || item.status === "Active",
    status: item.status || "Active",
    
    // Timestamps
    created_at: item.created_at,
    updated_at: item.updated_at,
    deleted_at: item.deleted_at,
  }));
}