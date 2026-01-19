// ==================== DOCUMENT TYPE TYPES ====================
export interface ApiDocumentType {
  id: number;
  code: string;
  label: string;
  required_for: string;
  category: string | null;
  name: string | null;
  description: string | null;
  active: boolean;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface DocumentType {
  id: string;
  code: string;
  label: string;
  required_for: string;
  category: string | null;
  name: string | null;
  description: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DocumentTypeRow extends DocumentType {
  sr: number;
}

export interface ApiMeta{
  current_page: number;
  from: number;
  last_page: number;
  per_page: number;
  to: number;
  total: number;
}
export interface DocumentTypesResponse {
  data: DocumentType[];
  meta: ApiMeta;
}

export interface FrontendDocumentTypesResponse extends DocumentTypesResponse {}

// ==================== DOCUMENT TYPE FORM TYPES ====================
export interface DocumentTypeFormData {
  code: string;
  label: string;
  required_for: string;
  category: string;
  name: string;
  description: string;
  active: boolean;
}

// ==================== REQUIRED FOR OPTIONS ====================
export const REQUIRED_FOR_OPTIONS = [
  { value: "all", label: "All Employees", description: "Required for all employees" },
  { value: "permanent", label: "Permanent Employees", description: "Required for permanent staff only" },
  { value: "contract", label: "Contract Employees", description: "Required for contract staff only" },
  { value: "probation", label: "Probation Employees", description: "Required for employees on probation" },
  { value: "consultant", label: "Consultants", description: "Required for consultants" },
  { value: "intern", label: "Interns", description: "Required for interns" },
  { value: "none", label: "Optional", description: "Optional document" },
] as const;

// ==================== DOCUMENT CATEGORY OPTIONS ====================
export const DOCUMENT_CATEGORY_OPTIONS = [
  { value: "identity", label: "Identity Documents", description: "Personal identification documents" },
  { value: "employment", label: "Employment Documents", description: "Employment-related documents" },
  { value: "educational", label: "Educational Documents", description: "Academic and educational certificates" },
  { value: "financial", label: "Financial Documents", description: "Bank and financial documents" },
  { value: "legal", label: "Legal Documents", description: "Legal and compliance documents" },
  { value: "medical", label: "Medical Documents", description: "Health and medical records" },
  { value: "other", label: "Other Documents", description: "Miscellaneous documents" },
] as const;

// ==================== COMMON DOCUMENT CODES ====================
export const COMMON_DOCUMENT_CODES = [
  "OFFER_LETTER",
  "APPOINTMENT_LETTER",
  "CONTRACT_AGREEMENT",
  "CNIC",
  "PASSPORT",
  "DRIVING_LICENSE",
  "EDUCATION_CERTIFICATE",
  "EXPERIENCE_CERTIFICATE",
  "BANK_ACCOUNT_DETAILS",
  "TAX_DECLARATION",
  "MEDICAL_CERTIFICATE",
  "NOC_PREVIOUS_EMPLOYER",
  "POLICE_VERIFICATION",
  "REFERENCE_LETTER",
  "RESUME_CV",
  "PHOTOGRAPH",
  "PAN_CARD",
  "SSN",
  "PROOF_OF_ADDRESS",
  "BIRTH_CERTIFICATE",
  "MARRIAGE_CERTIFICATE"
] as const;