// app/regions/types.ts

// ==================== API TYPES ====================
export interface ApiRegion {
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

export interface RawRegionsResponse {
  data: ApiRegion[];
  meta: ApiMeta;
}

// ==================== FRONTEND TYPES ====================
export interface Region {
  id: string;
  name: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface RegionRow extends Region {
  sr: number;
}

export interface FrontendPagination {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

export interface FrontendRegionsResponse {
  data: Region[];
  meta: FrontendPagination;
}

// ==================== FORM TYPES ====================
export interface RegionFormData {
  name: string;
  active: boolean;
}

// ==================== UTILITY FUNCTIONS ====================
export function mapApiToFrontend(apiResponse: RawRegionsResponse, page: number, perPage: number): FrontendRegionsResponse {
  return {
    data: apiResponse.data.map(region => ({
      id: region.id.toString(),
      name: region.name,
      active: region.active,
      created_at: region.created_at,
      updated_at: region.updated_at,
    })),
    meta: {
      total: apiResponse.meta.total,
      current_page: apiResponse.meta.current_page,
      per_page: apiResponse.meta.per_page,
      last_page: apiResponse.meta.last_page,
    },
  };
}

export function mapApiToRegionRow(apiRegion: ApiRegion, sr: number): RegionRow {
  return {
    sr,
    id: apiRegion.id.toString(),
    name: apiRegion.name,
    active: apiRegion.active,
    created_at: apiRegion.created_at,
    updated_at: apiRegion.updated_at,
  };
}