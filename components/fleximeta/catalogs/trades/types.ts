// ==================== API TYPES ====================
export interface ApiTrade {
  id: number;
  code: string;
  name: string;
  required_for: 'all' | 'specific' | 'none';
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

export interface RawTradesResponse {
  data: ApiTrade[];
  meta: ApiMeta;
}

// ==================== FRONTEND TYPES ====================
export interface Trade {
  id: string;
  code: string;
  name: string;
  required_for: 'all' | 'specific' | 'none';
  active: boolean;
}

export interface TradeRow extends Trade {
  sr: number;
}

export interface FrontendPagination {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

export interface FrontendTradesResponse {
  data: Trade[];
  meta: FrontendPagination;
}

// ==================== FORM TYPES ====================
export interface TradeFormData {
  code: string;
  name: string;
  required_for: 'all' | 'specific' | 'none';
  active: boolean;
}

// ==================== UTILITY FUNCTIONS ====================
export function mapApiToFrontend(apiResponse: RawTradesResponse, page: number, perPage: number): FrontendTradesResponse {
  return {
    data: apiResponse.data.map(trade => ({
      id: trade.id.toString(),
      code: trade.code,
      name: trade.name,
      required_for: trade.required_for,
      active: trade.active,
    })),
    meta: {
      total: apiResponse.meta.total,
      current_page: apiResponse.meta.current_page,
      per_page: apiResponse.meta.per_page,
      last_page: apiResponse.meta.last_page,
    },
  };
}

export function mapApiToTradeRow(apiTrade: ApiTrade, sr: number): TradeRow {
  return {
    sr,
    id: apiTrade.id.toString(),
    code: apiTrade.code,
    name: apiTrade.name,
    required_for: apiTrade.required_for,
    active: apiTrade.active,
  };
}