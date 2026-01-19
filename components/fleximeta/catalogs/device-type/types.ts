// ==================== DEVICE TYPE TYPES ====================
export interface ApiDeviceType {
  id: number;
  brand: string;
  model: string;
  connector_code: string;
  field_map_json: {
    badge: string;
    timestamp: string;
    direction: string;
  };
  active: boolean;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface DeviceType {
  id: string;
  brand: string;
  model: string;
  connector_code: string;
  field_map_json: {
    badge: string;
    timestamp: string;
    direction: string;
  };
  active: boolean;
  created_at: string;
  updated_at: string;
}


export interface ApiMeta {
  current_page: number;
  from: number;
  last_page: number;
  per_page: number;
  to: number;
  total: number;
}

export interface DeviceTypeRow extends DeviceType {
  sr: number;
}

export interface DeviceTypesResponse {
  data: DeviceType[];
  meta: ApiMeta;
}

export interface FrontendDeviceTypesResponse extends DeviceTypesResponse {}

// ==================== DEVICE TYPE FORM TYPES ====================
export interface DeviceTypeFormData {
  brand: string;
  model: string;
  connector_code: string;
  field_map_json: {
    badge: string;
    timestamp: string;
    direction: string;
  };
  active: boolean;
}

// ==================== CONNECTOR CODE OPTIONS ====================
export const CONNECTOR_CODE_OPTIONS = [
  { value: "ZK_PUSH", label: "ZKTeco Push", description: "ZKTeco devices with push API" },
  { value: "ZK_PULL", label: "ZKTeco Pull", description: "ZKTeco devices with pull API" },
  { value: "HIKVISION", label: "Hikvision", description: "Hikvision biometric devices" },
  { value: "SUPREMA", label: "Suprema", description: "Suprema biometric devices" },
  { value: "CUSTOM_API", label: "Custom API", description: "Custom API integration" },
  { value: "CSV_IMPORT", label: "CSV Import", description: "CSV file import format" },
] as const;

// ==================== COMMON BRAND OPTIONS ====================
export const DEVICE_BRAND_OPTIONS = [
  "ZKTeco",
  "Hikvision",
  "Suprema",
  "Matrix",
  "IDTech",
  "Mantra",
  "Prowatch",
  "BioMax",
  "Other"
] as const;

// ==================== FIELD MAPPING OPTIONS ====================
export const FIELD_MAPPING_OPTIONS = {
  badge: [
    { value: "emp_code", label: "Employee Code", description: "Employee ID/code field" },
    { value: "badge_no", label: "Badge Number", description: "Badge/punch card number" },
    { value: "pin", label: "PIN", description: "Personal Identification Number" },
    { value: "user_id", label: "User ID", description: "User identifier" },
  ],
  timestamp: [
    { value: "punch_time", label: "Punch Time", description: "Attendance timestamp" },
    { value: "timestamp", label: "Timestamp", description: "Generic timestamp field" },
    { value: "check_time", label: "Check Time", description: "Check-in/out time" },
    { value: "date_time", label: "Date Time", description: "Combined date-time field" },
  ],
  direction: [
    { value: "in_out", label: "In/Out", description: "Direction indicator" },
    { value: "status", label: "Status", description: "Punch status" },
    { value: "type", label: "Type", description: "Punch type" },
    { value: "direction", label: "Direction", description: "Direction field" },
  ],
} as const;