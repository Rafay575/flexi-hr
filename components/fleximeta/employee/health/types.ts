// app/health/types.ts

// ==================== API TYPES ====================
export interface ApiHealth {
  id: number;
  name: string;
  active: boolean;
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

export interface RawHealthsResponse {
  data: ApiHealth[];
  meta: ApiMeta;
}

// ==================== FRONTEND TYPES ====================
export interface Health {
  id: string;
  name: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface HealthRow extends Health {
  sr: number;
}

export interface FrontendPagination {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

export interface FrontendHealthsResponse {
  data: Health[];
  meta: FrontendPagination;
}

// ==================== FORM TYPES ====================
export interface HealthFormData {
  name: string;
  active: boolean;
}

// ==================== UTILITY FUNCTIONS ====================
export function mapApiToFrontend(apiResponse: RawHealthsResponse, page: number, perPage: number): FrontendHealthsResponse {
  return {
    data: apiResponse.data.map(health => ({
      id: health.id.toString(),
      name: health.name,
      active: health.active,
      created_at: health.created_at,
      updated_at: health.updated_at,
    })),
    meta: {
      total: apiResponse.meta.total,
      current_page: apiResponse.meta.current_page,
      per_page: apiResponse.meta.per_page,
      last_page: apiResponse.meta.last_page,
    },
  };
}

export function mapApiToHealthRow(apiHealth: ApiHealth, sr: number): HealthRow {
  return {
    sr,
    id: apiHealth.id.toString(),
    name: apiHealth.name,
    active: apiHealth.active,
    created_at: apiHealth.created_at,
    updated_at: apiHealth.updated_at,
  };
}