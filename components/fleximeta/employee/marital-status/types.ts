// app/marital-status/types.ts

// ==================== API TYPES ====================
export interface ApiMaritalStatus {
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

export interface RawMaritalStatusesResponse {
  data: ApiMaritalStatus[];
  meta: ApiMeta;
}

// ==================== FRONTEND TYPES ====================
export interface MaritalStatus {
  id: string;
  name: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MaritalStatusRow extends MaritalStatus {
  sr: number;
}

export interface FrontendPagination {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

export interface FrontendMaritalStatusesResponse {
  data: MaritalStatus[];
  meta: FrontendPagination;
}

// ==================== FORM TYPES ====================
export interface MaritalStatusFormData {
  name: string;
  active: boolean;
}

// ==================== UTILITY FUNCTIONS ====================
export function mapApiToFrontend(apiResponse: RawMaritalStatusesResponse, page: number, perPage: number): FrontendMaritalStatusesResponse {
  return {
    data: apiResponse.data.map(maritalStatus => ({
      id: maritalStatus.id.toString(),
      name: maritalStatus.name,
      active: maritalStatus.active,
      created_at: maritalStatus.created_at,
      updated_at: maritalStatus.updated_at,
    })),
    meta: {
      total: apiResponse.meta.total,
      current_page: apiResponse.meta.current_page,
      per_page: apiResponse.meta.per_page,
      last_page: apiResponse.meta.last_page,
    },
  };
}

export function mapApiToMaritalStatusRow(apiMaritalStatus: ApiMaritalStatus, sr: number): MaritalStatusRow {
  return {
    sr,
    id: apiMaritalStatus.id.toString(),
    name: apiMaritalStatus.name,
    active: apiMaritalStatus.active,
    created_at: apiMaritalStatus.created_at,
    updated_at: apiMaritalStatus.updated_at,
  };
}