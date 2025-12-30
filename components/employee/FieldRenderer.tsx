// src/features/enrollment/fields/FieldRenderer.tsx
import React from "react";
import { Controller, Control, FieldErrors } from "react-hook-form";
import { Upload } from "lucide-react";
import { FormField } from "./types";

const colors = {
  primary: "#3D3A5C",
  secondary: "#8B85A8",
  beige: "#E5C9A0",
  coral: "#E8A99A",
} as const;

type Props = {
  field: FormField;
  control: Control<any>;
  errors: FieldErrors<any>;
};

export function FieldRenderer({ field, control, errors }: Props) {
  const errorMsg = (errors?.[field.key] as any)?.message as string | undefined;

  const baseStyle: React.CSSProperties = {
    border: errorMsg ? "2px solid #EF4444" : "2px solid #E5E4E8",
    borderRadius: "8px",
    padding: "6px 10px",
    fontSize: "13px",
    fontWeight: 500,
    color: colors.primary,
    width: "100%",
    outline: "none",
    background: field.disabled ? "#F8F8F9" : "white",
  };

  if (field.type === "select") {
    return (
      <div>
        <Controller
          name={field.key}
          control={control}
          render={({ field: rhf }) => (
            <select
              {...rhf}
              style={{ ...baseStyle, cursor: "pointer" }}
              disabled={field.disabled}
            >
              <option value="">Select...</option>
              {field.options.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          )}
        />
        {errorMsg && <p className="mt-1 text-[10px] text-red-500 font-semibold">{errorMsg}</p>}
      </div>
    );
  }

  if (field.type === "textarea") {
    return (
      <div>
        <Controller
          name={field.key}
          control={control}
          render={({ field: rhf }) => (
            <textarea
              {...rhf}
              style={{ ...baseStyle, minHeight: "60px", resize: "vertical" }}
              placeholder={field.placeholder}
              disabled={field.disabled}
            />
          )}
        />
        {errorMsg && <p className="mt-1 text-[10px] text-red-500 font-semibold">{errorMsg}</p>}
      </div>
    );
  }

  if (field.type === "checkbox") {
    return (
      <div>
        <Controller
          name={field.key}
          control={control}
          defaultValue={false}
          render={({ field: rhf }) => (
            <label className="flex items-start gap-2 cursor-pointer py-1">
              <input
                type="checkbox"
                checked={!!rhf.value}
                onChange={(e) => rhf.onChange(e.target.checked)}
                className="mt-0.5"
                style={{ accentColor: colors.primary } as React.CSSProperties}
                disabled={field.disabled}
              />
              <span className="text-xs font-medium leading-tight" style={{ color: colors.primary }}>
                {field.label}
              </span>
            </label>
          )}
        />
        {errorMsg && <p className="mt-1 text-[10px] text-red-500 font-semibold">{errorMsg}</p>}
      </div>
    );
  }

  if (field.type === "file") {
    return (
      <div>
        <Controller
          name={field.key}
          control={control}
          render={({ field: rhf }) => (
            <label
              className="flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer"
              style={{ border: "2px dashed #D2D0D7", background: "white" }}
            >
              <input
                type="file"
                className="hidden"
                disabled={field.disabled}
                accept={field.accept ?? "image/*,.pdf"}
                onChange={(e) => rhf.onChange(e.target.files?.[0] ?? null)}
              />
              <div
                className="w-7 h-7 rounded flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${colors.secondary}, ${colors.primary})` }}
              >
                <Upload className="w-3.5 h-3.5 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-semibold truncate" style={{ color: colors.primary }}>
                  {rhf.value?.name ? rhf.value.name : "Click to upload"}
                </p>
                <p className="text-[9px] text-gray-400">PNG, JPG, PDF</p>
              </div>
            </label>
          )}
        />
        {errorMsg && <p className="mt-1 text-[10px] text-red-500 font-semibold">{errorMsg}</p>}
      </div>
    );
  }

  // text/tel/email/date/number
  return (
    <div>
      <Controller
        name={field.key}
        control={control}
        render={({ field: rhf }) => (
          <input
            {...rhf}
            type={field.type}
            style={baseStyle}
            placeholder={field.placeholder}
            disabled={field.disabled}
          />
        )}
      />
      {errorMsg && <p className="mt-1 text-[10px] text-red-500 font-semibold">{errorMsg}</p>}
    </div>
  );
}
