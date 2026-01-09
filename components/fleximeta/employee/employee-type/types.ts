// app/employee-type/types.ts

// ==================== API TYPES ====================
export interface ApiEmployeeType {
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

export interface RawEmployeeTypesResponse {
  data: ApiEmployeeType[];
  meta: ApiMeta;
}

// ==================== FRONTEND TYPES ====================
export interface EmployeeType {
  id: string;
  name: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface EmployeeTypeRow extends EmployeeType {
  sr: number;
}

export interface FrontendPagination {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

export interface FrontendEmployeeTypesResponse {
  data: EmployeeType[];
  meta: FrontendPagination;
}

// ==================== FORM TYPES ====================
export interface EmployeeTypeFormData {
  name: string;
  active: boolean;
}

// ==================== UTILITY FUNCTIONS ====================
export function mapApiToFrontend(apiResponse: RawEmployeeTypesResponse, page: number, perPage: number): FrontendEmployeeTypesResponse {
  return {
    data: apiResponse.data.map(employeeType => ({
      id: employeeType.id.toString(),
      name: employeeType.name,
      active: employeeType.active,
      created_at: employeeType.created_at,
      updated_at: employeeType.updated_at,
    })),
    meta: {
      total: apiResponse.meta.total,
      current_page: apiResponse.meta.current_page,
      per_page: apiResponse.meta.per_page,
      last_page: apiResponse.meta.last_page,
    },
  };
}

export function mapApiToEmployeeTypeRow(apiEmployeeType: ApiEmployeeType, sr: number): EmployeeTypeRow {
  return {
    sr,
    id: apiEmployeeType.id.toString(),
    name: apiEmployeeType.name,
    active: apiEmployeeType.active,
    created_at: apiEmployeeType.created_at,
    updated_at: apiEmployeeType.updated_at,
  };
}