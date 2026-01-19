// ==================== API TYPES ====================
export interface Component {
  code: string;
  pct: number;
}

export interface PayloadJson {
  components: Component[];
}

export interface ApiGradeTemplate {
  id: number;
  code: string;
  name: string;
  description: string | null;
  payload_json: PayloadJson;
  active: boolean;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ApiMeta {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

export interface RawGradeTemplatesResponse {
  data: ApiGradeTemplate[];
  meta: ApiMeta;
}

// ==================== FRONTEND TYPES ====================
export interface GradeTemplate {
  id: string;
  code: string;
  name: string;
  description: string | null;
  payload_json: PayloadJson;
  active: boolean;
}

export interface GradeTemplateRow extends GradeTemplate {
  sr: number;
}

export interface FrontendPagination {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

export interface FrontendGradeTemplatesResponse {
  data: GradeTemplate[];
  meta: FrontendPagination;
}

// ==================== FORM TYPES ====================
export interface ComponentFormData {
  code: string;
  pct: number;
}

export interface GradeTemplateFormData {
  code: string;
  name: string;
  description?: string;
  components: ComponentFormData[];
  active: boolean;
}

// ==================== UTILITY FUNCTIONS ====================
export function mapApiToFrontend(apiResponse: RawGradeTemplatesResponse, page: number, perPage: number): FrontendGradeTemplatesResponse {
  return {
    data: apiResponse.data.map(template => ({
      id: template.id.toString(),
      code: template.code,
      name: template.name,
      description: template.description,
      payload_json: template.payload_json,
      active: template.active,
    })),
    meta: {
      total: apiResponse.meta.total,
      current_page: apiResponse.meta.current_page,
      per_page: apiResponse.meta.per_page,
      last_page: apiResponse.meta.last_page,
    },
  };
}

export function mapApiToGradeTemplateRow(apiTemplate: ApiGradeTemplate, sr: number): GradeTemplateRow {
  return {
    sr,
    id: apiTemplate.id.toString(),
    code: apiTemplate.code,
    name: apiTemplate.name,
    description: apiTemplate.description,
    payload_json: apiTemplate.payload_json,
    active: apiTemplate.active,
  };
}