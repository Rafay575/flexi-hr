// src/features/enrollment/OnboardX.tsx
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Save,
  Send,
  Shield,
  Zap,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useEnrollmentContext } from "@/context/EnrollmentContext";
import { quickFormSteps, detailedFormSteps } from "./steps";
import { Mode, StepDef } from "./types";
import { buildZodSchema } from "./buildSchema";
import { api } from "@/components/api/client";

import { stepComponents, StepHandle } from "./stepComponents";
import { toast } from "sonner";

const colors = {
  primary: "#3D3A5C",
  secondary: "#8B85A8",
  beige: "#E5C9A0",
  coral: "#E8A99A",
} as const;

// ─────────────────────────────────────────────────────────────
// Confirm Modal
// ─────────────────────────────────────────────────────────────
type ConfirmSwitchModalProps = {
  open: boolean;
  fromMode: Mode;
  toMode: Mode;
  onCancel: () => void;
  onContinue: () => void;
  loading?: boolean;
};

function ConfirmSwitchModal({
  open,
  fromMode,
  toMode,
  onCancel,
  onContinue,
  loading,
}: ConfirmSwitchModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center">
      <button
        type="button"
        onClick={onCancel}
        className="absolute inset-0 bg-black/40"
        aria-label="Close"
      />

      <div className="relative w-[92%] max-w-md rounded-xl bg-white border border-gray-200 shadow-xl p-4">
        <h3 className="text-sm font-bold" style={{ color: colors.primary }}>
          Switch to {toMode === "quick" ? "Quick" : "Detailed"} form?
        </h3>

        <p className="mt-1 text-[12px] text-gray-600 leading-relaxed">
          If you continue, your current{" "}
          <b>{fromMode === "quick" ? "Quick" : "Detailed"}</b> draft data will
          be <b>deleted</b>. You will start a new{" "}
          <b>{toMode === "quick" ? "Quick" : "Detailed"}</b> draft.
        </p>

        <div className="mt-4 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-3 py-2 rounded-lg border text-xs font-semibold disabled:opacity-50"
            style={{ borderColor: "#D5D3E0", color: colors.primary }}
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onContinue}
            disabled={loading}
            className="px-3 py-2 rounded-lg text-xs font-semibold text-white disabled:opacity-50"
            style={{
              background: `linear-gradient(135deg, ${colors.secondary}, ${colors.primary})`,
            }}
          >
            {loading ? "Please wait..." : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function OnboardX() {
  const [uiMode, setUiMode] = useState<Mode>("quick");
  const [step, setStep] = useState<number>(0);

  const [switching, setSwitching] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingMode, setPendingMode] = useState<Mode | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const {
    enrollmentId,
    mode: enrollmentMode,
    stepIndex,
    startEnrollmentDraft,
    clearEnrollment,
  } = useEnrollmentContext();

  // Sync UI from backend draft state
  useEffect(() => {
    if (!enrollmentMode) return;
    setUiMode(enrollmentMode === "QUICK" ? "quick" : "detailed");
    setStep(stepIndex ?? 0);
  }, [enrollmentMode, stepIndex]);

  // Create initial QUICK draft ONCE on first visit (StrictMode safe)
  const hasInitRef = useRef(false);
  useEffect(() => {
    if (hasInitRef.current) return;

    if (enrollmentMode || enrollmentId) {
      hasInitRef.current = true;
      return;
    }

    hasInitRef.current = true;

    void startEnrollmentDraft({
      mode: "QUICK",
      type: "CREATE",
      employee_id: null,
    });
  }, [startEnrollmentDraft, enrollmentMode, enrollmentId]);

  // steps + schema (kept for progress, counts, titles)
  const steps = useMemo<StepDef[]>(
    () => (uiMode === "quick" ? quickFormSteps : detailedFormSteps),
    [uiMode]
  );
  const current = steps[step];
  const total = steps.length;

  // keep your zod schema building (even if step components also validate internally)
  const schema = useMemo(() => buildZodSchema(steps), [steps]);

  // this form remains (you can later remove if each step owns its own state)
  const form = useForm({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: {},
  });

  const { handleSubmit, getValues } = form;

  const progress = ((step + 1) / total) * 100;
  const totalFields = useMemo(
    () => steps.reduce((s, st) => s + st.fields.length, 0),
    [steps]
  );
  const requiredFields = useMemo(
    () =>
      steps.reduce(
        (s, st) => s + st.fields.filter((f) => f.required).length,
        0
      ),
    [steps]
  );

  // Current step component ref
  const stepRef = useRef<StepHandle | null>(null);

  // Switch Mode flow
  const requestToggleMode = useCallback(
    (m: Mode) => {
      if (switching) return;
      if (m === uiMode) return;

      setPendingMode(m);
      setConfirmOpen(true);
    },
    [switching, uiMode]
  );

  const onConfirmCancel = useCallback(() => {
    setConfirmOpen(false);
    setPendingMode(null);
  }, []);

  const onConfirmContinue = useCallback(async () => {
    if (!pendingMode) return;

    try {
      setConfirmLoading(true);
      setSwitching(true);

      // 1) delete existing draft (if id exists)
      if (enrollmentId) {
        await api.delete(`/v1/enrollments/${enrollmentId}`, {
          headers: {
            Accept: "application/json",
            "X-Company-Id": "1",
          },
        });
      }

      // 2) clear local
      clearEnrollment();

      // 3) start new draft with new mode
      await startEnrollmentDraft({
        mode: pendingMode === "quick" ? "QUICK" : "DETAILED",
        type: "CREATE",
        employee_id: null,
      });

      // 4) reset UI
      setUiMode(pendingMode);
      setStep(0);
    } catch (e: any) {
      toast(
        e?.response?.data?.message || e?.message || "Failed to switch form"
      );
    } finally {
      setConfirmLoading(false);
      setSwitching(false);
      setConfirmOpen(false);
      setPendingMode(null);
    }
  }, [pendingMode, enrollmentId, clearEnrollment, startEnrollmentDraft]);

  // Footer Next: call current step submit() (API) then goNext
  const goNext = async () => {
    if (switching || confirmLoading) return;

    // call step API via ref
    const ok = await stepRef.current?.submit?.();
    if (!ok) return;

    setStep((s) => Math.min(total - 1, s + 1));
  };

  const goPrev = () => {
    if (switching || confirmLoading) return;
    setStep((s) => Math.max(0, s - 1));
  };

  const onSubmit = async () => {
    // final submit (example)
    console.log("FINAL SUBMIT", { enrollmentId, values: getValues() });
    toast("Form Submitted!");
  };

  const Icon = current.icon;

  // pick correct step component from map
  const StepComponent = stepComponents[uiMode][step];

  return (
    <div>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-3 h-12 flex items-center justify-between">
          <div
            className="flex items-center gap-1 p-0.5 rounded-lg"
            style={{ background: "#F1F1F3" }}
          >
            {(["quick", "detailed"] as const).map((m) => (
              <button
                key={m}
                onClick={() => requestToggleMode(m)}
                disabled={switching}
                className="px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all flex items-center gap-1"
                style={{
                  background: uiMode === m ? "white" : "transparent",
                  color: uiMode === m ? colors.primary : "#706C7A",
                  boxShadow:
                    uiMode === m ? "0 1px 2px rgba(0,0,0,0.08)" : "none",
                }}
              >
                {m === "quick" ? (
                  <>
                    <Zap className="w-3 h-3" /> Quick
                  </>
                ) : (
                  <>
                    <LayoutDashboard className="w-3 h-3" /> Detailed
                  </>
                )}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-3 py-4">
        {/* Progress Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-3 mb-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1
                className="font-bold text-lg"
                style={{ color: colors.primary }}
              >
                Employee Enrollment
              </h1>
              <p className="text-[11px] text-gray-500">
                {uiMode === "quick" ? "Quick Form" : "Detailed Form"} • {total}{" "}
                Steps • {totalFields} Fields • {requiredFields} Required
                {enrollmentId ? ` • Draft #${enrollmentId}` : ""}
              </p>
            </div>
          </div>

          <div className="mb-3">
            <div className="flex justify-between text-[11px] font-semibold mb-1">
              <span style={{ color: colors.primary }}>
                Step {step + 1} of {total}
              </span>
              <span style={{ color: colors.secondary }}>
                {Math.round(progress)}%
              </span>
            </div>
            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${progress}%`,
                  background: `linear-gradient(90deg, ${colors.secondary}, ${colors.primary})`,
                }}
              />
            </div>
          </div>

          <div className="flex items-center justify-center gap-1 flex-wrap">
            {steps.map((s, idx) => {
              const StepIcon = s.icon;
              const isActive = idx === step;
              const isCompleted = idx < step;

              return (
                <button
                  key={s.id}
                  onClick={() => setStep(idx)}
                  disabled={switching}
                  className="flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-semibold transition-all"
                  style={{
                    background: isActive
                      ? `linear-gradient(135deg, ${colors.secondary}, ${colors.primary})`
                      : isCompleted
                      ? "#F4E8D4"
                      : "#F1F1F3",
                    color: isActive
                      ? "white"
                      : isCompleted
                      ? "#A67F45"
                      : "#8A8694",
                  }}
                >
                  {isCompleted ? (
                    <Check className="w-3 h-3" />
                  ) : (
                    <StepIcon className="w-3 h-3" />
                  )}
                  <span className="hidden sm:inline">
                    {s.title.split(" ")[0]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Form container (keep your design) */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-xl border border-gray-200 overflow-hidden"
        >
          <div
            className="px-4 py-3 border-b border-gray-100"
            style={{ background: "#F8F7FA" }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${colors.secondary}, ${colors.primary})`,
                }}
              >
                <Icon className="w-4 h-4 text-white" />
              </div>

              <div className="flex-1">
                <h2
                  className="font-bold text-base"
                  style={{ color: colors.primary }}
                >
                  {current.title}
                </h2>
                <p className="text-[11px] text-gray-500">{current.subtitle}</p>
              </div>
            </div>
          </div>

          {/* ✅ STEP CONTENT (separate component), inside same padding like before */}
          <div className="p-4">
            {StepComponent ? (
              <StepComponent
                ref={stepRef}
                enrollmentId={enrollmentId}
                disabled={switching || confirmLoading}
              />
            ) : (
              <div className="text-sm text-gray-500">
                Missing StepComponent for mode <b>{uiMode}</b> step{" "}
                <b>{step}</b>
              </div>
            )}
          </div>

          {/* Footer Buttons (your design same) */}
          <div
            className="px-4 py-3 border-t border-gray-100"
            style={{ background: "#FAFAFA" }}
          >
            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={goPrev}
                disabled={step === 0 || switching || confirmLoading}
                className="px-3 py-1.5 rounded-lg font-semibold text-xs border-2 flex items-center gap-1 disabled:opacity-40"
                style={{ borderColor: "#D5D3E0", color: colors.primary }}
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Previous
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  className="px-2 py-1.5 rounded-lg font-semibold text-xs flex items-center gap-1 hover:bg-gray-100"
                  style={{ color: "#706C7A" }}
                  onClick={() => console.log("SAVE DRAFT", enrollmentId)}
                >
                  <Save className="w-3.5 h-3.5" />
                </button>

                {step === total - 1 ? (
                  <button
                    type="button"
                    onClick={goNext}
                    disabled={switching || confirmLoading}
                    className="px-3 py-1.5 rounded-lg font-semibold text-xs text-white flex items-center gap-1 disabled:opacity-60"
                    style={{
                      background: `linear-gradient(135deg, ${colors.secondary}, ${colors.primary})`,
                    }}
                  >
                    <Send className="w-3.5 h-3.5" /> Submit
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={goNext}
                    disabled={switching || confirmLoading}
                    className="px-3 py-1.5 rounded-lg font-semibold text-xs text-white flex items-center gap-1 disabled:opacity-60"
                    style={{
                      background: `linear-gradient(135deg, ${colors.secondary}, ${colors.primary})`,
                    }}
                  >
                    Next <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </form>

        {/* Confirm Switch Modal */}
        <ConfirmSwitchModal
          open={confirmOpen}
          fromMode={uiMode}
          toMode={pendingMode ?? uiMode}
          loading={confirmLoading}
          onCancel={onConfirmCancel}
          onContinue={onConfirmContinue}
        />

        {/* Footer */}
        <div
          className="mt-4 rounded-xl p-3 text-white text-center"
          style={{
            background: `linear-gradient(135deg, ${colors.primary}, #232135)`,
          }}
        >
          <div className="flex items-center justify-center gap-1.5 mb-1.5">
            <Shield className="w-3.5 h-3.5" style={{ color: colors.beige }} />
            <span className="font-bold text-xs">
              Pakistan Labor Law Compliance
            </span>
          </div>
          <div className="flex flex-wrap justify-center gap-3 text-[10px]">
            {["EOBI Act", "Provincial SS", "FBR Tax", "Standing Orders"].map(
              (law) => (
                <span key={law} className="flex items-center gap-1">
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: colors.beige }}
                  />
                  {law}
                </span>
              )
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
