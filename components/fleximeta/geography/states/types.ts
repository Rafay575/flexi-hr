// ==================== API TYPES ====================
// These are the types that match your actual API response structure

export interface ApiState {
  id: number;
  name: string;
  country_id: number;
  fips_code: string;
  iso2: string;
  country_code: string;
  latitude: string;
  longitude: string;
  flag: number; // Represents if the state is active or inactive (1 or 0)
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface ApiMeta {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

// ==================== FRONTEND TYPES ====================
// These are used by your React components

// Frontend representation of a state, simplified
export interface State {
  id: string;
  name: string;
  country_id: string;
  country_code: string;
  fips_code: string; // Prefill fips_code
  iso2: string; // Prefill iso2
  latitude: number;
  longitude: number;
  is_active: boolean;
}

// StateRow represents a row in the table with additional fields for display
export interface StateRow extends State {
  sr: number; // Serial number for the row
}

// Frontend response for the states, including meta data for pagination
export interface FrontendStatesResponse {
  data: State[]; // Array of states
  meta: {
    total: number; // Total number of states
    per_page: number; // Number of states per page
    current_page: number; // Current page
    last_page: number; // Total pages
  };
}

// ==================== FORM TYPES ====================
// These types are for forms like creating/editing a state

// Updated StateFormData to include the new fields
export interface StateFormData {
  name: string;
  country_id: string; // Country ID will be selected from a search dropdown
  country_code: string; // Country code based on selected country
  fips_code: string;
  iso2: string;
  latitude: string;
  longitude: string;
}

export interface Country {
  id: string;
  name: string;
  iso2: string;
}
// ==================== UTILITY FUNCTIONS ====================
// Helper function to convert API response to frontend format
export function mapApiToFrontend(
  apiResponse: { data: ApiState[]; meta: ApiMeta },
  page: number,
  perPage: number
): FrontendStatesResponse {
  return {
    data: apiResponse.data.map((state) => ({
      id: state.id.toString(),
      name: state.name,
      country_id: state.country_id.toString(),
      fips_code: state.fips_code,
      iso2: state.iso2,
      country_code: state.country_code,
      latitude: parseFloat(state.latitude),
      longitude: parseFloat(state.longitude),
      is_active: state.flag === 1, // Convert flag to is_active boolean
    })),
    meta: {
      total: apiResponse.meta.total,
      current_page: apiResponse.meta.current_page,
      per_page: apiResponse.meta.per_page,
      last_page: apiResponse.meta.last_page,
    },
  };
}

// Helper function to map an individual state API object to the StateRow format
export function mapApiToStateRow(apiState: ApiState, sr: number): StateRow {
  return {
    sr,
    id: apiState.id.toString(),
    name: apiState.name,
    country_id: apiState.country_id.toString(),
    fips_code: apiState.fips_code,
    iso2: apiState.iso2,  
    country_code: apiState.country_code,
    latitude: parseFloat(apiState.latitude),
    longitude: parseFloat(apiState.longitude),
    is_active: apiState.flag === 1,
  };
}
