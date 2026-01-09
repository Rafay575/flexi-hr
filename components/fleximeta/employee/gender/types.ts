// app/gender/types.ts

// ==================== API TYPES ====================
export interface ApiGender {
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

export interface RawGendersResponse {
  data: ApiGender[];
  meta: ApiMeta;
}

// ==================== FRONTEND TYPES ====================
export interface Gender {
  id: string;
  name: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface GenderRow extends Gender {
  sr: number;
}

export interface FrontendPagination {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

export interface FrontendGendersResponse {
  data: Gender[];
  meta: FrontendPagination;
}

// ==================== FORM TYPES ====================
export interface GenderFormData {
  name: string;
  active: boolean;
}

// ==================== UTILITY FUNCTIONS ====================
export function mapApiToFrontend(apiResponse: RawGendersResponse, page: number, perPage: number): FrontendGendersResponse {
  return {
    data: apiResponse.data.map(gender => ({
      id: gender.id.toString(),
      name: gender.name,
      active: gender.active,
      created_at: gender.created_at,
      updated_at: gender.updated_at,
    })),
    meta: {
      total: apiResponse.meta.total,
      current_page: apiResponse.meta.current_page,
      per_page: apiResponse.meta.per_page,
      last_page: apiResponse.meta.last_page,
    },
  };
}

export function mapApiToGenderRow(apiGender: ApiGender, sr: number): GenderRow {
  return {
    sr,
    id: apiGender.id.toString(),
    name: apiGender.name,
    active: apiGender.active,
    created_at: apiGender.created_at,
    updated_at: apiGender.updated_at,
  };
}