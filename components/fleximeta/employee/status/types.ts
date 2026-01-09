// app/employee-status/types.ts

// ==================== API TYPES ====================
export interface ApiEmployeeStatus {
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

export interface RawEmployeeStatusesResponse {
  data: ApiEmployeeStatus[];
  meta: ApiMeta;
}

// ==================== FRONTEND TYPES ====================
export interface EmployeeStatus {
  id: string;
  name: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface EmployeeStatusRow extends EmployeeStatus {
  sr: number;
}

export interface FrontendPagination {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

export interface FrontendEmployeeStatusesResponse {
  data: EmployeeStatus[];
  meta: FrontendPagination;
}

// ==================== FORM TYPES ====================
export interface EmployeeStatusFormData {
  name: string;
  active: boolean;
}

// ==================== UTILITY FUNCTIONS ====================
export function mapApiToFrontend(apiResponse: RawEmployeeStatusesResponse, page: number, perPage: number): FrontendEmployeeStatusesResponse {
  return {
    data: apiResponse.data.map(status => ({
      id: status.id.toString(),
      name: status.name,
      active: status.active,
      created_at: status.created_at,
      updated_at: status.updated_at,
    })),
    meta: {
      total: apiResponse.meta.total,
      current_page: apiResponse.meta.current_page,
      per_page: apiResponse.meta.per_page,
      last_page: apiResponse.meta.last_page,
    },
  };
}

export function mapApiToEmployeeStatusRow(apiStatus: ApiEmployeeStatus, sr: number): EmployeeStatusRow {
  return {
    sr,
    id: apiStatus.id.toString(),
    name: apiStatus.name,
    active: apiStatus.active,
    created_at: apiStatus.created_at,
    updated_at: apiStatus.updated_at,
  };
}