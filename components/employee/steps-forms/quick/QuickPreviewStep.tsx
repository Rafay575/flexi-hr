// src/features/enrollment/steps/QuickPreviewStep.tsx
import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { api } from "@/components/api/client";
import type { StepComponentProps, StepHandle } from "../../stepComponents";

const colors = { primary: "#3D3A5C" } as const;

function Row({ k, v }: { k: string; v: any }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2 border-b border-gray-100">
      <div className="text-[12px] font-semibold" style={{ color: colors.primary }}>{k}</div>
      <div className="text-[12px] text-gray-700 text-right break-all">
        {v === null || v === undefined || v === "" ? "—" : String(v)}
      </div>
    </div>
  );
}

const QuickPreviewStep = forwardRef<StepHandle, StepComponentProps>(function QuickPreviewStep(
  { enrollmentId, disabled },
  ref
) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      if (!enrollmentId) return;
      try {
        setLoading(true);

        // ✅ fetch sections you have (add more if needed)
        const [employment, salary, attendance, documents] = await Promise.all([
          api.get(`/v1/enrollments/${enrollmentId}/sections/employment`, { headers: { Accept: "application/json", "X-Company-Id": "1" } }),
          api.get(`/v1/enrollments/${enrollmentId}/sections/salary`, { headers: { Accept: "application/json", "X-Company-Id": "1" } }),
          api.get(`/v1/enrollments/${enrollmentId}/sections/attendance`, { headers: { Accept: "application/json", "X-Company-Id": "1" } }),
          api.get(`/v1/enrollments/${enrollmentId}/sections/documents`, { headers: { Accept: "application/json", "X-Company-Id": "1" } }),
        ]);

        if (!mounted) return;

        setData({
          employment: employment?.data?.data?.values || {},
          salary: salary?.data?.data?.values || {},
          attendance: attendance?.data?.data?.values || {},
          documents: documents?.data?.data?.values || {},
        });
      } catch (e) {
        console.warn("Preview load failed", e);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    run();
    return () => {
      mounted = false;
    };
  }, [enrollmentId]);

  // ✅ Preview has NO save call. Always allow Next/Submit.
  const submit = async () => true;
  useImperativeHandle(ref, () => ({ submit }), []);

  if (loading) return <div className="text-sm text-gray-500">Loading preview...</div>;
  if (!data) return <div className="text-sm text-gray-500">No data to preview.</div>;

  const docsItems = Array.isArray(data.documents?.items) ? data.documents.items : [];

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-gray-200 p-3">
        <div className="text-sm font-bold mb-2" style={{ color: colors.primary }}>Employment</div>
        {Object.entries(data.employment).map(([k, v]) => <Row key={k} k={k} v={v} />)}
      </div>

      <div className="rounded-xl border border-gray-200 p-3">
        <div className="text-sm font-bold mb-2" style={{ color: colors.primary }}>Salary</div>
        {Object.entries(data.salary).map(([k, v]) => <Row key={k} k={k} v={v} />)}
      </div>

      <div className="rounded-xl border border-gray-200 p-3">
        <div className="text-sm font-bold mb-2" style={{ color: colors.primary }}>Attendance</div>
        {Object.entries(data.attendance).map(([k, v]) => <Row key={k} k={k} v={v} />)}
      </div>

      <div className="rounded-xl border border-gray-200 p-3">
        <div className="text-sm font-bold mb-2" style={{ color: colors.primary }}>Documents</div>

        {/* show required types */}
        <Row k="required_types" v={(data.documents.required_types || []).join(", ")} />

        {/* show uploaded file names */}
        <div className="mt-2">
          <div className="text-[12px] font-semibold mb-1" style={{ color: colors.primary }}>Uploaded Files</div>
          {docsItems.length === 0 ? (
            <div className="text-[12px] text-gray-600">—</div>
          ) : (
            <div className="space-y-1">
              {docsItems.map((it: any, idx: number) => (
                <div key={idx} className="text-[12px] text-gray-700 flex justify-between border-b border-gray-100 py-1">
                  <span className="font-semibold">{it.type}</span>
                  <span className="text-right">{it.original_name || it.path || "—"}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* show consents */}
        <div className="mt-3">
          <div className="text-[12px] font-semibold mb-1" style={{ color: colors.primary }}>Consents</div>
          {Object.entries(data.documents.consents || {}).map(([k, v]) => <Row key={k} k={k} v={v} />)}
        </div>
      </div>
    </div>
  );
});

export default QuickPreviewStep;
