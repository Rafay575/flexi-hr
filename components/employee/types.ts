// src/features/enrollment/types.ts
export type Mode = "quick" | "detailed";

export type ComplianceLabel =
  | "EOBI"
  | "NADRA"
  | "FBR"
  | "SS"
  | "Min Wage"
  | "Safety"
  | "Standing Orders"
  | (string & {});

export type FieldType =
  | "text"
  | "tel"
  | "email"
  | "date"
  | "number"
  | "select"
  | "textarea"
  | "checkbox"
  | "file";

export type BaseField = {
  name: string;            // display label
  key: string;             // IMPORTANT: form field key (no spaces)
  type: FieldType;
  required: boolean;
  placeholder?: string;
  disabled?: boolean;
  compliance?: ComplianceLabel;
};

export type SelectField = BaseField & { type: "select"; options: string[] };
export type TextareaField = BaseField & { type: "textarea" };
export type CheckboxField = BaseField & { type: "checkbox"; label: string };
export type FileField = BaseField & { type: "file"; accept?: string };

export type InputField = BaseField & {
  type: Exclude<FieldType, "select" | "textarea" | "checkbox" | "file">;
};

export type FormField = SelectField | TextareaField | CheckboxField | FileField | InputField;

export type StepDef = {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  fields: FormField[];
};
