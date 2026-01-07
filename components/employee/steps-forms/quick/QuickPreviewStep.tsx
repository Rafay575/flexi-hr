// src/features/enrollment/steps/QuickPreviewStep.tsx
"use client";

import React, { forwardRef, useImperativeHandle, useState } from "react";
import { ShieldCheck, Send, AlertTriangle } from "lucide-react";
import { api } from "@/components/api/client";
import type { StepComponentProps, StepHandle } from "../../stepComponents";
import { toast } from "sonner";
import Loader from "@/components/common/Loader";
import { useNavigate } from "react-router-dom";
import { useEnrollmentContext } from "@/context/EnrollmentContext";

const colors = {
  primary: "#3D3A5C",
  secondary: "#8B85A8",
  beige: "#E5C9A0",
} as const;

const QuickPreviewStep = forwardRef<StepHandle, StepComponentProps>(
  function QuickPreviewStep({ enrollmentId, disabled }, ref) {
    const [submitting, setSubmitting] = useState(false);
    const [confirm, setConfirm] = useState(false);
    const navigate = useNavigate();
    const isBusy = !!disabled || submitting;
    const { clearEnrollment } = useEnrollmentContext();
    const submit = async () => {
      if (isBusy) return false;

      if (!enrollmentId) {
        toast("Enrollment draft not ready yet.");
        return false;
      }

      if (!confirm) {
        toast("Please confirm before submitting.");
        return false;
      }

      try {
        setSubmitting(true);

        // ✅ Final submit: NO BODY
        await api.post(`/v1/enrollments/${enrollmentId}/submit`, null, {
          headers: { Accept: "application/json", "X-Company-Id": "1" },
        });
        clearEnrollment();
        navigate(`/peoplehub/directory`);
        return true;
      } catch (err: any) {
        toast(err?.response?.data?.message || err?.message || "Submit failed");
        return false;
      } finally {
        setSubmitting(false);
      }
    };

    useImperativeHandle(ref, () => ({ submit }), [submit]);

    return (
      <div className="space-y-4">
        {/* Sexy confirmation card */}
        <div
          className="rounded-2xl border border-gray-200 p-4 text-white shadow-sm"
          style={{
            background: `linear-gradient(135deg, ${colors.secondary}, ${colors.primary})`,
          }}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-[11px] opacity-90">Final Step</div>
              <div className="text-xl font-extrabold leading-tight">
                Confirm & Submit
              </div>
              <div className="text-[12px] opacity-90 mt-1">
                Enrollment #{enrollmentId ?? "—"}
              </div>
            </div>

            <div className="rounded-xl bg-white/10 border border-white/15 p-2">
              <div className="flex items-center gap-2">
                <ShieldCheck
                  className="w-4 h-4"
                  style={{ color: colors.beige }}
                />
                <div className="text-[12px] font-semibold">Secure Submit</div>
              </div>
            </div>
          </div>

          <div className="mt-3 rounded-xl bg-white/10 border border-white/15 p-3">
            <div className="flex items-start gap-2">
              <AlertTriangle
                className="w-4 h-4 mt-0.5"
                style={{ color: colors.beige }}
              />
              <div className="text-[12px] leading-relaxed opacity-95">
                Once you submit, this enrollment will be <b>finalized</b>. If
                anything is wrong, go back and fix it before submitting.
              </div>
            </div>
          </div>
        </div>

        {/* Checkbox */}
        <label className="flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-3 bg-white">
          <input
            type="checkbox"
            disabled={isBusy}
            checked={confirm}
            onChange={(e) => setConfirm(e.target.checked)}
          />
          <span className="text-[12px]" style={{ color: colors.primary }}>
            I confirm everything is correct and I want to submit.
          </span>
        </label>

        {/* small helper text */}

        {submitting ? (
          <div className="text-[12px] text-gray-600 text-center">
            <Loader message="Submitting…" />
          </div>
        ) : null}

        {/* hidden button for safety (not required) */}
        <button type="button" className="hidden" aria-hidden="true" />
      </div>
    );
  }
);

export default QuickPreviewStep;
