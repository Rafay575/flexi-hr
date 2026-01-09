// types/locationType.ts
// ==================== API TYPES ====================
export interface ApiLocationType {
  id: number;
  code: string;
  name: string;
  abbrev: string;
  scope: string;
  active: number; // 1 for active, 0 for inactive
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export interface ApiMeta {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

// ==================== FRONTEND TYPES ====================
export interface LocationType {
  id: string;
  code: string;
  name: string;
  abbrev: string;
  scope: string;
  active: boolean;
}

export interface LocationTypeRow extends LocationType {
  sr: number;
}

export interface FrontendLocationTypesResponse {
  data: LocationType[];
  meta: ApiMeta;
}

// ==================== FORM TYPES ====================
export interface LocationTypeFormData {
  code: string;
  name: string;
  abbrev: string;
  scope: string;
  active: number | string; // 1/0 or "1"/"0"
}