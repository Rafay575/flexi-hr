// types.ts

// ==================== API TYPES ====================
// These match your actual API response structure

export interface ApiCountry {
  id: number;
  name: string;
  iso3: string;
  iso2: string;
  phonecode: string;
  capital: string;
  currency: string;
  currency_symbol: string;
  tld: string;
  native: string;
  region: string;
  subregion: string;
  timezones: string;
  translations: string;
  latitude: string;
  longitude: string;
  emoji: string;
  emojiU: string;
  created_at: string;
  updated_at: string;
  flag: number;
  wikiDataId: string;
  deleted_at: string | null;
}

export interface ApiMeta {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

export interface RawCountriesResponse {
  data: ApiCountry[];
  meta: ApiMeta;
}

// ==================== FRONTEND TYPES ====================
// These are used by your React components

// Simplified Country interface for frontend
export interface Country {
  id: string;
  name: string;
  iso2: string;
  iso3: string;
  phonecode: string;
  capital: string;
  currency: string;
  currency_symbol: string;
  region: string;
  subregion: string;
  latitude: number;
  longitude: number;
  flag: number;
}

export interface CountryRow extends Country {
  sr: number;
  is_active: boolean;
}

export interface FrontendPagination {
  total: number;
  per_page: number;
current_page: number,
last_page: number
}

export interface FrontendCountriesResponse {
  data: Country[];
  meta: FrontendPagination;
}

// ==================== FORM TYPES ====================
export interface CountryFormData {
  name: string;
  iso2: string;
  iso3: string;
  phonecode: string;
  capital?: string;
  currency?: string;
  currency_symbol?: string;
  region?: string;
  subregion?: string;
  latitude?: number;
  longitude?: number;
}

// ==================== UTILITY FUNCTIONS ====================
// Helper function to convert API response to frontend format
export function mapApiToFrontend(apiResponse: RawCountriesResponse, page: number, perPage: number): FrontendCountriesResponse {
  return {
    data: apiResponse.data.map(country => ({
      id: country.id.toString(),
      name: country.name,
      iso2: country.iso2,
      iso3: country.iso3,
      phonecode: country.phonecode,
      capital: country.capital,
      currency: country.currency,
      currency_symbol: country.currency_symbol,
      region: country.region,
      subregion: country.subregion,
      latitude: parseFloat(country.latitude) || 0,
      longitude: parseFloat(country.longitude) || 0,
      flag: country.flag,
    })),
    meta: {
      total: apiResponse.meta.total,
      current_page: apiResponse.meta.current_page,
      per_page: apiResponse.meta.per_page,
      last_page: apiResponse.meta.last_page,
    },
  };
}

// Helper function to convert API country to CountryRow
export function mapApiToCountryRow(apiCountry: ApiCountry, sr: number): CountryRow {
  return {
    sr,
    id: apiCountry.id.toString(),
    name: apiCountry.name,
    iso2: apiCountry.iso2,
    iso3: apiCountry.iso3,
    phonecode: apiCountry.phonecode,
    capital: apiCountry.capital,
    currency: apiCountry.currency,
    currency_symbol: apiCountry.currency_symbol,
    region: apiCountry.region,
    subregion: apiCountry.subregion,
    latitude: parseFloat(apiCountry.latitude) || 0,
    longitude: parseFloat(apiCountry.longitude) || 0,
    flag: apiCountry.flag,
    is_active: apiCountry.flag === 1,
  };
}