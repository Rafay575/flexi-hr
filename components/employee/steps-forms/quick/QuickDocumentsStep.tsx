// src/features/enrollment/steps/QuickDocumentsStep.tsx
"use client";

import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/components/api/client";
import type { StepComponentProps, StepHandle } from "../../stepComponents";
import Loader from "@/components/common/Loader";
import { toast } from "sonner";

const colors = { primary: "#3D3A5C", coral: "#E8A99A" } as const;

const inputClass =
  "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-200 disabled:bg-gray-50";

function Label({
  children,
  required,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="text-[11px] font-semibold mb-1 block" style={{ color: colors.primary }}>
      {children}{" "}
      {required && (
        <span
          className="inline-block w-1 h-1 rounded-full align-middle"
          style={{ background: colors.coral }}
        />
      )}
    </label>
  );
}

const DocTypeEnum = z.enum(["CNIC_FRONT", "CNIC_BACK", "PASSPORT_PHOTO"]);
type DocType = z.infer<typeof DocTypeEnum>;

// ✅ Prefill API response (include mime!)
type DocumentsSectionResponse = {
  success: boolean;
  data: {
    id: number;
    section: "documents";
    values: {
      required_types?: DocType[];
      items?: Array<{
        type: DocType;
        original_name?: string;
        path?: string;
        mime?: string; // ✅ important
        size?: number;
        disk?: string;
      }>;
      consents?: Record<string, any>;
    };
  };
};

const schema = z.object({
  // files (optional)
  cnic_front: z.any().optional(),
  cnic_back: z.any().optional(),
  passport_photo: z.any().optional(),

  // ONLY 3 checkboxes in UI
  consent_data_accuracy: z.boolean(),
  consent_background_check: z.boolean(),
  consent_code_of_conduct: z.boolean(),

  // preserve (hidden but must be sent)
  consent_data_collection_processing: z.boolean(),
  consent_it_acceptable_use: z.boolean(),
  consent_nda: z.boolean(),
  declared_no_conflict_of_interest: z.boolean(),

  // required_types must be sent as required_types[]
  required_types: z.array(DocTypeEnum).default(["CNIC_FRONT", "CNIC_BACK", "PASSPORT_PHOTO"]),
});

type Values = z.infer<typeof schema>;
const resolver = zodResolver(schema) as unknown as Resolver<Values>;

function toBool(v: any) {
  if (typeof v === "boolean") return v;
  if (typeof v === "string") return v.toLowerCase() === "true" || v === "1";
  if (typeof v === "number") return v === 1;
  return false;
}

function fileFromInput(v: any): File | null {
  if (!v) return null;
  if (typeof File !== "undefined" && v instanceof File) return v;
  if (typeof FileList !== "undefined" && v instanceof FileList) return v.length ? v[0] : null;
  if (Array.isArray(v) && v[0] instanceof File) return v[0];
  return null;
}

function isPreviewableImage(nameOrMimeOrUrl?: string) {
  const v = (nameOrMimeOrUrl || "").toLowerCase();
  return (
    v.includes("image/") ||
    v.endsWith(".png") ||
    v.endsWith(".jpg") ||
    v.endsWith(".jpeg") ||
    v.endsWith(".webp")
  );
}

// ✅ build full URL for existing backend file
function buildDocUrl(path?: string | null) {
  const base = (process.env.API_BASE_URL_IMAGE || "https://app.myflexihr.com/storage/")
  const p = (path || "")
  console.log( `${base}${p}`)
  if (!base || !p) return "";
  console.log( `${base}${p}`)
  return `${base}${p}`;
}

function buildItems(values: Values) {
  const items: { type: DocType; file: File }[] = [];

  const f1 = fileFromInput(values.cnic_front);
  if (f1) items.push({ type: "CNIC_FRONT", file: f1 });

  const f2 = fileFromInput(values.cnic_back);
  if (f2) items.push({ type: "CNIC_BACK", file: f2 });

  const f3 = fileFromInput(values.passport_photo);
  if (f3) items.push({ type: "PASSPORT_PHOTO", file: f3 });

  return items;
}

function truncateName(name: string, max = 15) {
  const n = (name || "").trim();
  if (n.length <= max) return n;
  return n.slice(0, max - 3) + "...";
}

function UploadBox({
  label,
  badge,
  required,
  disabled,
  accept,
  inputProps,
  existingName,
  existingPath,
  existingMime,
  previewUrl,
}: {
  label: string;
  badge?: string;
  required?: boolean;
  disabled?: boolean;
  accept: string;
  inputProps: React.InputHTMLAttributes<HTMLInputElement>;
  existingName?: string | null;
  existingPath?: string | null;
  existingMime?: string | null;
  previewUrl?: string | null;
}) {
  console.log("existingPath", existingPath);
  const existingUrl = existingPath ? buildDocUrl(existingPath) : "";
  console.log("existingUrl", existingUrl);
  // ✅ use mime OR name OR url as fallback
  const canShowExistingImage =
    !!existingUrl && isPreviewableImage(existingMime || existingName || existingUrl);

  const showPreview = !!previewUrl || canShowExistingImage;

  return (
    <div>
      <Label required={required}>
        {label}
        {badge ? (
          <span
            className="ml-2 px-2 py-[2px] rounded-md text-[10px] font-semibold"
            style={{ background: "#EFEAF7", color: "#3D3A5C" }}
          >
            {badge}
          </span>
        ) : null}
      </Label>

      <div className="rounded-xl border border-dashed border-gray-300 bg-white p-3">
        {/* ✅ existing file text + tooltip */}
        <div className="text-[11px] text-gray-600 mb-2">
          {existingName ? (
            <span>
              Already uploaded:{" "}
              <span className="font-semibold text-gray-900 cursor-help" title={existingName}>
                {truncateName(existingName, 15)}
              </span>
            </span>
          ) : (
            <span>No file uploaded yet.</span>
          )}
        </div>

        {/* ✅ preview */}
        {showPreview ? (
          <div className="mb-2">
            <div className="text-[10px] text-gray-500 mb-1">Preview:</div>
            <div className="rounded-lg border border-gray-200 overflow-hidden bg-gray-50">
              <img
                src={previewUrl || existingUrl}
                alt="preview"
                className="w-full h-[120px] object-contain"
              />
            </div>
          </div>
        ) : null}

        <input type="file" className={inputClass} disabled={disabled} accept={accept} {...inputProps} />
        <div className="mt-1 text-[10px] text-gray-500">PNG, JPG, PDF</div>
      </div>
    </div>
  );
}

const QuickDocumentsStep = forwardRef<StepHandle, StepComponentProps>(function QuickDocumentsStep(
  { enrollmentId, disabled },
  ref
) {
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ store mime too
  const [existingByType, setExistingByType] = useState<
    Record<DocType, { original_name?: string; path?: string; mime?: string } | null>
  >({
    CNIC_FRONT: null,
    CNIC_BACK: null,
    PASSPORT_PHOTO: null,
  });

  const form = useForm<Values>({
    resolver,
    mode: "onTouched",
    defaultValues: {
      required_types: ["CNIC_FRONT", "CNIC_BACK", "PASSPORT_PHOTO"],

      cnic_front: undefined,
      cnic_back: undefined,
      passport_photo: undefined,

      consent_data_accuracy: false,
      consent_background_check: false,
      consent_code_of_conduct: false,

      consent_data_collection_processing: false,
      consent_it_acceptable_use: false,
      consent_nda: false,
      declared_no_conflict_of_interest: false,
    },
  });

  const isBusy = !!disabled || saving || loading;

  // ✅ Prefill
  useEffect(() => {
    let mounted = true;

    const run = async () => {
      if (!enrollmentId) return;

      try {
        setLoading(true);

        const res = await api.get<DocumentsSectionResponse>(
          `/v1/enrollments/${enrollmentId}/sections/documents`,
          { headers: { Accept: "application/json", "X-Company-Id": "1" } }
        );

        const values = res?.data?.data?.values ?? {};

        const requiredTypes = (values.required_types?.length
          ? values.required_types
          : ["CNIC_FRONT", "CNIC_BACK", "PASSPORT_PHOTO"]) as DocType[];

        const byType: Record<DocType, { original_name?: string; path?: string; mime?: string } | null> = {
          CNIC_FRONT: null,
          CNIC_BACK: null,
          PASSPORT_PHOTO: null,
        };

        (values.items || []).forEach((it) => {
          if (it?.type) {
            byType[it.type] = {
              original_name: it.original_name,
              path: it.path,
              mime: it.mime, // ✅ store
            };
          }
        });

        const consents = values.consents || {};

        if (!mounted) return;

        setExistingByType(byType);

        form.reset(
          {
            required_types: requiredTypes,

            cnic_front: undefined,
            cnic_back: undefined,
            passport_photo: undefined,

            consent_data_accuracy: toBool(consents.consent_data_accuracy),
            consent_background_check: toBool(consents.consent_background_check),
            consent_code_of_conduct: toBool(consents.consent_code_of_conduct),

            // preserve hidden ones
            consent_data_collection_processing: toBool(consents.consent_data_collection_processing),
            consent_it_acceptable_use: toBool(consents.consent_it_acceptable_use),
            consent_nda: toBool(consents.consent_nda),
            declared_no_conflict_of_interest: toBool(consents.declared_no_conflict_of_interest),
          },
          { keepDirty: false, keepTouched: false }
        );
      } catch (err) {
        console.warn("Documents prefill failed", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    run();
    return () => {
      mounted = false;
    };
  }, [enrollmentId]); // ✅ don't include `form`

  // ✅ local selected-file previews
  const cnicFrontVal = form.watch("cnic_front");
  const cnicBackVal = form.watch("cnic_back");
  const passportVal = form.watch("passport_photo");

  const [p1, p2, p3] = useMemo(() => {
    const toUrl = (v: any) => {
      const f = fileFromInput(v);
      return f && f.type?.startsWith("image/") ? URL.createObjectURL(f) : null;
    };
    return [toUrl(cnicFrontVal), toUrl(cnicBackVal), toUrl(passportVal)];
  }, [cnicFrontVal, cnicBackVal, passportVal]);

  useEffect(() => {
    return () => {
      [p1, p2, p3].forEach((u) => u && URL.revokeObjectURL(u));
    };
  }, [p1, p2, p3]);

  const submit = async () => {
    const ok = await form.trigger();
    if (!ok) return false;

    if (!enrollmentId) {
      toast("Enrollment draft not ready yet.");
      return false;
    }

    const v = form.getValues();
    const items = buildItems(v);

    // ✅ allow submit if already uploaded in backend
    const hasExistingFront = !!existingByType.CNIC_FRONT?.path;
    const hasExistingBack = !!existingByType.CNIC_BACK?.path;
    const hasExistingPhoto = !!existingByType.PASSPORT_PHOTO?.path;

    const required = new Set(v.required_types);

    const hasFront = items.some((x) => x.type === "CNIC_FRONT") || hasExistingFront;
    const hasBack = items.some((x) => x.type === "CNIC_BACK") || hasExistingBack;
    const hasPhoto = items.some((x) => x.type === "PASSPORT_PHOTO") || hasExistingPhoto;

    if (required.has("CNIC_FRONT") && !hasFront) return (toast("CNIC Front is required."), false);
    if (required.has("CNIC_BACK") && !hasBack) return (toast("CNIC Back is required."), false);
    if (required.has("PASSPORT_PHOTO") && !hasPhoto) return (toast("Passport Photo is required."), false);

    try {
      setSaving(true);

      const fd = new FormData();

      // ✅ consents[...]
      fd.append("consents[consent_data_accuracy]", String(v.consent_data_accuracy));
      fd.append("consents[consent_background_check]", String(v.consent_background_check));
      fd.append("consents[consent_code_of_conduct]", String(v.consent_code_of_conduct));
      fd.append("consents[consent_data_collection_processing]", String(v.consent_data_collection_processing));
      fd.append("consents[consent_it_acceptable_use]", String(v.consent_it_acceptable_use));
      fd.append("consents[consent_nda]", String(v.consent_nda));
      fd.append("consents[declared_no_conflict_of_interest]", String(v.declared_no_conflict_of_interest));

      // ✅ required_types[]
      v.required_types.forEach((t) => fd.append("required_types[]", t));

      // ✅ items[i][file] & items[i][type]
      items.forEach((it, idx) => {
        fd.append(`items[${idx}][file]`, it.file);
        fd.append(`items[${idx}][type]`, it.type);
      });

      await api.post(`/v1/enrollments/${enrollmentId}/sections/documents`, fd, {
        headers: { Accept: "application/json", "X-Company-Id": "1" },
      });

      return true;
    } catch (err: any) {
      toast(err?.response?.data?.message || err?.message || "Failed to save Documents");
      return false;
    } finally {
      setSaving(false);
    }
  };

  useImperativeHandle(ref, () => ({ submit }));

  if (loading) return <Loader message="Loading Documents…" fullHeight={false} />;
  if (saving) return <Loader message="Saving Documents…" fullHeight={false} />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <UploadBox
        label="CNIC Front Image"
        badge="NADRA"
        required
        disabled={isBusy}
        accept="image/*,.pdf"
        inputProps={form.register("cnic_front")}
        existingName={existingByType.CNIC_FRONT?.original_name || null}
        existingPath={existingByType.CNIC_FRONT?.path || null}
        existingMime={existingByType.CNIC_FRONT?.mime || null}
        previewUrl={p1}
      />

      <UploadBox
        label="CNIC Back Image"
        badge="NADRA"
        required
        disabled={isBusy}
        accept="image/*,.pdf"
        inputProps={form.register("cnic_back")}
        existingName={existingByType.CNIC_BACK?.original_name || null}
        existingPath={existingByType.CNIC_BACK?.path || null}
        existingMime={existingByType.CNIC_BACK?.mime || null}
        previewUrl={p2}
      />

      <UploadBox
        label="Passport Size Photo"
        required
        disabled={isBusy}
        accept="image/*,.pdf"
        inputProps={form.register("passport_photo")}
        existingName={existingByType.PASSPORT_PHOTO?.original_name || null}
        existingPath={existingByType.PASSPORT_PHOTO?.path || null}
        existingMime={existingByType.PASSPORT_PHOTO?.mime || null}
        previewUrl={p3}
      />

      {/* ONLY 3 checkboxes like screenshot */}
      <div className="lg:col-span-3 grid grid-cols-1 gap-2 mt-1">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" disabled={isBusy} {...form.register("consent_data_accuracy")} />
          <span className="text-[12px]" style={{ color: colors.primary }}>
            I confirm all information is accurate and true
          </span>
        </label>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" disabled={isBusy} {...form.register("consent_background_check")} />
          <span className="text-[12px]" style={{ color: colors.primary }}>
            I authorize background verification checks
          </span>
        </label>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" disabled={isBusy} {...form.register("consent_code_of_conduct")} />
          <span className="text-[12px]" style={{ color: colors.primary }}>
            I agree to abide by the Company Code of Conduct
          </span>
        </label>
      </div>

    </div>
  );
});

export default QuickDocumentsStep;
