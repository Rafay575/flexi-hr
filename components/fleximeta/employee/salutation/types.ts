// app/salutation/types.ts

// ==================== API TYPES ====================
export interface ApiSalutation {
  id: number;
  name: string;
  active: number; // Note: API returns 1/0, not boolean
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

export interface RawSalutationsResponse {
  data: ApiSalutation[];
  meta: ApiMeta;
}

// ==================== FRONTEND TYPES ====================
export interface Salutation {
  id: string;
  name: string;
  active: boolean; // Converted to boolean for frontend
  created_at: string;
  updated_at: string;
}

export interface SalutationRow extends Salutation {
  sr: number;
}

export interface FrontendPagination {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

export interface FrontendSalutationsResponse {
  data: Salutation[];
  meta: FrontendPagination;
}

// ==================== FORM TYPES ====================
export interface SalutationFormData {
  name: string;
  active: boolean;
}

// ==================== UTILITY FUNCTIONS ====================
export function mapApiToFrontend(apiResponse: RawSalutationsResponse, page: number, perPage: number): FrontendSalutationsResponse {
  return {
    data: apiResponse.data.map(salutation => ({
      id: salutation.id.toString(),
      name: salutation.name,
      active: salutation.active === 1, // Convert 1/0 to boolean
      created_at: salutation.created_at,
      updated_at: salutation.updated_at,
    })),
    meta: {
      total: apiResponse.meta.total,
      current_page: apiResponse.meta.current_page,
      per_page: apiResponse.meta.per_page,
      last_page: apiResponse.meta.last_page,
    },
  };
}

export function mapApiToSalutationRow(apiSalutation: ApiSalutation, sr: number): SalutationRow {
  return {
    sr,
    id: apiSalutation.id.toString(),
    name: apiSalutation.name,
    active: apiSalutation.active === 1, // Convert 1/0 to boolean
    created_at: apiSalutation.created_at,
    updated_at: apiSalutation.updated_at,
  };
}