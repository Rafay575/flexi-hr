// ==================== API TYPES ====================
export interface ApiEntity {
  id: number;
  code: string;
  name: string;
  abbrev: string;
  active: number; // 1 for active, 0 for inactive
  created_at?: string;
  updated_at?: string;
}

export interface ApiMeta {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

// ==================== FRONTEND TYPES ====================
export interface Entity {
  id: string;
  code: string;
  name: string;
  abbrev: string;
  is_active: boolean;
}

export interface EntityRow extends Entity {
  sr: number;
}

export interface FrontendEntitiesResponse {
  data: Entity[];
  meta: ApiMeta;
}

// ==================== FORM TYPES ====================
export interface EntityFormData {
  code: string;
  name: string;
  abbrev: string;
  active: number | string; // 1/0 or "1"/"0"
}