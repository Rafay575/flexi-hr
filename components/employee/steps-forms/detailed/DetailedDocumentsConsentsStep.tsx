// src/features/enrollment/steps/DetailedDocumentsConsentsStep2.tsx
"use client";

import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import { api } from "@/components/api/client";
import type { StepComponentProps, StepHandle } from "../../stepComponents";
import Loader from "@/components/common/Loader";
import { toast } from "sonner";

const colors = { primary: "#3D3A5C", coral: "#E8A99A" } as const;

// ✅ 2048 KB max
const MAX_FILE_KB = 2048;
const MAX_FILE_BYTES = MAX_FILE_KB * 1024;

type ConsentKey =
  | "consent_data_accuracy"
  | "consent_background_check"
  | "consent_code_of_conduct"
  | "consent_data_collection_processing"
  | "consent_it_acceptable_use"
  | "consent_nda"
  | "declared_no_conflict_of_interest";

type DocType =
  | "CNIC_FRONT"
  | "CNIC_BACK"
  | "PASSPORT_PHOTO"
  | "MATRICULATION_CERTIFICATE"
  | "INTERMEDIATE_CERTIFICATE"
  | "DEGREE_TRANSCRIPT"
  | "EXPERIENCE_LETTERS"
  | "LAST_SALARY_SLIP"
  | "BANK_STATEMENT"
  | "MEDICAL_FITNESS"
  | "POLICE_VERIFICATION"
  | "PASSPORT_COPY"
  | "DRIVING_LICENSE_COPY"
  | "PROFESSIONAL_CERTIFICATES";

type DocDef = {
  type: DocType;
  label: string;
  required?: boolean;
  badge?: "NADRA" | "Safety";
};

type Item = { type: DocType; file: File | null };

const CONSENTS: { key: ConsentKey; label: string }[] = [
  { key: "consent_data_accuracy", label: "I confirm my data is accurate" },
  { key: "consent_background_check", label: "I consent to background check" },
  { key: "consent_code_of_conduct", label: "I agree to the code of conduct" },
  { key: "consent_data_collection_processing", label: "I consent to data collection & processing" },
  { key: "consent_it_acceptable_use", label: "I agree to IT acceptable use policy" },
  { key: "consent_nda", label: "I agree to NDA" },
  { key: "declared_no_conflict_of_interest", label: "I declare no conflict of interest" },
];

const DOCS: DocDef[] = [
  { type: "CNIC_FRONT", label: "CNIC Front Image", required: true, badge: "NADRA" },
  { type: "CNIC_BACK", label: "CNIC Back Image", required: true, badge: "NADRA" },
  { type: "PASSPORT_PHOTO", label: "Passport Size Photo", required: true },

  { type: "MATRICULATION_CERTIFICATE", label: "Matriculation Certificate", required: true },
  { type: "INTERMEDIATE_CERTIFICATE", label: "Intermediate Certificate", required: true },
  { type: "DEGREE_TRANSCRIPT", label: "Degree/Transcript", required: true },

  { type: "EXPERIENCE_LETTERS", label: "Experience Letters", required: true },
  { type: "LAST_SALARY_SLIP", label: "Last Salary Slip", required: true },
  { type: "BANK_STATEMENT", label: "Bank Statement", required: true },

  { type: "MEDICAL_FITNESS", label: "Medical Fitness", required: true, badge: "Safety" },
  { type: "POLICE_VERIFICATION", label: "Police Verification", required: true },
  { type: "PASSPORT_COPY", label: "Passport Copy", required: true },

  { type: "DRIVING_LICENSE_COPY", label: "Driving License Copy", required: true },
  { type: "PROFESSIONAL_CERTIFICATES", label: "Professional Certificates", required: true },
];

function Dot() {
  return <span className="inline-block w-1 h-1 rounded-full align-middle" style={{ background: colors.coral }} />;
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="ml-2 inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold bg-amber-100 text-amber-700">
      {children}
    </span>
  );
}

function UploadBox({
  label,
  required,
  badge,
  disabled,
  file,
  onPick,
  helpText,
}: {
  label: string;
  required?: boolean;
  badge?: "NADRA" | "Safety";
  disabled?: boolean;
  file: File | null;
  onPick: (f: File | null) => void;
  helpText?: string;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className="space-y-1">
      <div className="text-[11px] font-semibold" style={{ color: colors.primary }}>
        {label} {required ? <Dot /> : null}
        {badge ? <Badge>{badge}</Badge> : null}
      </div>

      <div
        className="rounded-xl border-2 border-dashed border-gray-300 p-3 cursor-pointer hover:bg-gray-50 transition"
        onClick={() => !disabled && inputRef.current?.click()}
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600">⬆️</div>

          <div className="flex-1">
            <div className="text-[12px] font-semibold" style={{ color: colors.primary }}>
              {file ? "File selected" : "Click to upload"}
            </div>
            <div className="text-[10px] text-gray-500">{helpText || "PNG, JPG, PDF"}</div>
            {file ? <div className="mt-1 text-[11px] text-gray-700 font-semibold">{file.name}</div> : null}
          </div>

          {file ? (
            <button
              type="button"
              disabled={disabled}
              className="text-[11px] font-semibold text-red-600 hover:underline disabled:opacity-60"
              onClick={(e) => {
                e.stopPropagation();
                onPick(null);
                if (inputRef.current) inputRef.current.value = "";
              }}
            >
              Remove
            </button>
          ) : null}
        </div>

        <input
          ref={inputRef}
          type="file"
          className="hidden"
          disabled={disabled}
          accept="image/*,.pdf"
          onChange={(e) => {
            const f = e.target.files?.[0] ?? null;
            onPick(f);
            // if rejected, parent will set null; ensure input clears too
            if (!f) e.target.value = "";
          }}
        />
      </div>
    </div>
  );
}

const DetailedDocumentsConsentsStep2 = forwardRef<StepHandle, StepComponentProps>(
  function DetailedDocumentsConsentsStep2({ enrollmentId, disabled }, ref) {
    const [saving, setSaving] = useState(false);
    const [prefillLoading, setPrefillLoading] = useState(false);

    const [consents, setConsents] = useState<Record<ConsentKey, boolean>>({
      consent_data_accuracy: true,
      consent_background_check: true,
      consent_code_of_conduct: true,
      consent_data_collection_processing: true,
      consent_it_acceptable_use: true,
      consent_nda: true,
      declared_no_conflict_of_interest: true,
    });

    const [items, setItems] = useState<Item[]>(() => DOCS.map((d) => ({ type: d.type, file: null })));

    const requiredTypes = useMemo<DocType[]>(() => DOCS.filter((d) => d.required).map((d) => d.type), []);
    const isBusy = !!disabled || saving || prefillLoading;

    // Optional prefill
    useEffect(() => {
      let mounted = true;

      const run = async () => {
        if (!enrollmentId) return;
        try {
          setPrefillLoading(true);
          const res = await api.get(`/v1/enrollments/${enrollmentId}/sections/documents`, {
            headers: { Accept: "application/json", "X-Company-Id": "1" },
          });

          const c = (res as any)?.data?.data?.values?.consents ?? (res as any)?.data?.data?.consents ?? null;
          if (!mounted) return;

          if (c && typeof c === "object") {
            setConsents((prev) => ({
              ...prev,
              consent_data_accuracy: !!c.consent_data_accuracy,
              consent_background_check: !!c.consent_background_check,
              consent_code_of_conduct: !!c.consent_code_of_conduct,
              consent_data_collection_processing: !!c.consent_data_collection_processing,
              consent_it_acceptable_use: !!c.consent_it_acceptable_use,
              consent_nda: !!c.consent_nda,
              declared_no_conflict_of_interest: !!c.declared_no_conflict_of_interest,
            }));
          }
        } catch {
          // ignore
        } finally {
          if (mounted) setPrefillLoading(false);
        }
      };

      run();
      return () => {
        mounted = false;
      };
    }, [enrollmentId]);

  
    const setFile = (type: DocType, file: File | null) => {
      if (file && file.size > MAX_FILE_BYTES) {
        toast(`File too large. Max allowed is ${MAX_FILE_KB} KB (2 MB).`);
        // reject file
        setItems((prev) => prev.map((x) => (x.type === type ? { ...x, file: null } : x)));
        return;
      }

      setItems((prev) => prev.map((x) => (x.type === type ? { ...x, file } : x)));
    };

    const validate = () => {
      if (!enrollmentId) {
        toast("Enrollment draft not ready yet.");
        return false;
      }

      const anyConsentFalse = CONSENTS.some((c) => consents[c.key] !== true);
      if (anyConsentFalse) {
        toast("Please accept all consents to proceed.");
        return false;
      }

      // enforce required docs
      const missing = DOCS.filter((d) => d.required).filter((d) => !items.find((x) => x.type === d.type)?.file);
      if (missing.length) {
        toast(`Please upload: ${missing.map((m) => m.label).join(", ")}`);
        return false;
      }

      // double-check size before submit (safety)
      const tooBig = items.find((it) => it.file && it.file.size > MAX_FILE_BYTES);
      if (tooBig?.file) {
        toast(`"${tooBig.file.name}" is larger than ${MAX_FILE_KB} KB.`);
        return false;
      }

      return true;
    };

    const submit = async () => {
      if (!validate()) return false;

      try {
        setSaving(true);

        const fd = new FormData();

        (Object.keys(consents) as ConsentKey[]).forEach((k) => {
          fd.append(`consents[${k}]`, consents[k] ? "true" : "false");
        });

        requiredTypes.forEach((t) => fd.append("required_types[]", t));

        items.forEach((it, i) => {
          fd.append(`items[${i}][type]`, it.type);
          if (it.file) fd.append(`items[${i}][file]`, it.file);
        });

        await api.post(`/v1/enrollments/${enrollmentId}/sections/documents`, fd, {
          headers: { Accept: "application/json", "X-Company-Id": "1" },
        });

        toast("Documents & consents saved.");
        return true;
      } catch (err: any) {
        toast(err?.response?.data?.message || err?.message || "Failed to save Documents & Consents");
        return false;
      } finally {
        setSaving(false);
      }
    };

    useImperativeHandle(ref, () => ({ submit }), [enrollmentId, items, consents]);

    if (!!enrollmentId && prefillLoading) return <Loader message="Loading Documents & Consents…" fullHeight={false} />;
    if (saving) return <Loader message="Saving Documents & Consents…" fullHeight={false} />;

    return (
      <div className="space-y-4">
        {/* Consents */}
        <div className="rounded-xl border border-gray-200 p-3">
          <div className="text-[12px] font-bold mb-2" style={{ color: colors.primary }}>
            Consents
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {CONSENTS.map((c) => (
              <label key={c.key} className="flex items-start gap-2 rounded-lg border border-gray-200 p-2">
                <input
                  type="checkbox"
                  className="mt-0.5"
                  disabled={isBusy}
                  checked={!!consents[c.key]}
                  onChange={(e) => setConsents((prev) => ({ ...prev, [c.key]: e.target.checked }))}
                />
                <span className="text-[12px]" style={{ color: colors.primary }}>
                  {c.label}
                </span>
              </label>
            ))}
          </div>

          <div className="mt-2 text-[11px] text-gray-500">
            All consents must be checked. Max file size: <span className="font-semibold">{MAX_FILE_KB} KB</span>.
          </div>
        </div>

        {/* Uploads grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {DOCS.map((d) => (
            <UploadBox
              key={d.type}
              label={d.label}
              required={d.required}
              badge={d.badge}
              disabled={isBusy}
              file={items.find((x) => x.type === d.type)?.file ?? null}
              onPick={(f) => setFile(d.type, f)}
              helpText={`PNG, JPG, PDF • Max ${MAX_FILE_KB} KB`}
            />
          ))}
        </div>
      </div>
    );
  }
);

export default DetailedDocumentsConsentsStep2;
