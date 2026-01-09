// app/blood-groups/types.ts

// ==================== API TYPES ====================
export interface ApiBloodGroup {
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

export interface RawBloodGroupsResponse {
  data: ApiBloodGroup[];
  meta: ApiMeta;
}

// ==================== FRONTEND TYPES ====================
export interface BloodGroup {
  id: string;
  name: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface BloodGroupRow extends BloodGroup {
  sr: number;
}

export interface FrontendPagination {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

export interface FrontendBloodGroupsResponse {
  data: BloodGroup[];
  meta: FrontendPagination;
}

// ==================== FORM TYPES ====================
export interface BloodGroupFormData {
  name: string;
  active: boolean;
}

// ==================== UTILITY FUNCTIONS ====================
export function mapApiToFrontend(apiResponse: RawBloodGroupsResponse, page: number, perPage: number): FrontendBloodGroupsResponse {
  return {
    data: apiResponse.data.map(bloodGroup => ({
      id: bloodGroup.id.toString(),
      name: bloodGroup.name,
      active: bloodGroup.active,
      created_at: bloodGroup.created_at,
      updated_at: bloodGroup.updated_at,
    })),
    meta: {
      total: apiResponse.meta.total,
      current_page: apiResponse.meta.current_page,
      per_page: apiResponse.meta.per_page,
      last_page: apiResponse.meta.last_page,
    },
  };
}

export function mapApiToBloodGroupRow(apiBloodGroup: ApiBloodGroup, sr: number): BloodGroupRow {
  return {
    sr,
    id: apiBloodGroup.id.toString(),
    name: apiBloodGroup.name,
    active: apiBloodGroup.active,
    created_at: apiBloodGroup.created_at,
    updated_at: apiBloodGroup.updated_at,
  };
}