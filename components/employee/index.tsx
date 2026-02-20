// src/features/enrollment/OnboardX.tsx
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
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
  Bolt,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useEnrollmentContext } from "@/context/EnrollmentContext";
import { quickFormSteps, detailedFormSteps } from "./steps";
import { StepDef } from "./types";
import { buildZodSchema } from "./buildSchema";
import { api } from "@/components/api/client";

import { stepComponents, StepHandle } from "./stepComponents";
import { toast } from "sonner";

/**
 * ✅ Add third mode
 */
type ModeX = "quick" | "detailed" | "instant";

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
  fromMode: ModeX;
  toMode: ModeX;
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

  const label = (m: ModeX) =>
    m === "quick" ? "Quick" : m === "detailed" ? "Detailed" : "Instant";

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
          Switch to {label(toMode)}?
        </h3>

        <p className="mt-1 text-[12px] text-gray-600 leading-relaxed">
          If you continue, your current <b>{label(fromMode)}</b> draft data will
          be <b>deleted</b>. You will start a new <b>{label(toMode)}</b> draft.
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

// ─────────────────────────────────────────────────────────────
// Instant Create Step (fields you provided)
// ─────────────────────────────────────────────────────────────

// If you already have these in a shared place, import them instead.
// Kept local to make this file drop-in.
type EmpStatus = "ACTIVE" | "ON_LEAVE" | "INACTIVE";
type EmploymentType = "PERMANENT" | "CONTRACT" | "INTERN";

const DEPARTMENTS = ["Engineering", "Product", "HR", "Finance", "Ops", "IT"];
const DESIGNATIONS = [
  "Software Engineer",
  "Senior Engineer",
  "Team Lead",
  "Product Analyst",
  "HR Officer",
  "Accountant",
  "Ops Coordinator",
  "IT Support",
];
const LOCATIONS = ["Lahore", "Islamabad", "Karachi", "Remote"];

const TYPE_CONFIG: Record<EmploymentType, { label: string }> = {
  PERMANENT: { label: "Permanent" },
  CONTRACT: { label: "Contract" },
  INTERN: { label: "Intern" },
};

const STATUS_CONFIG: Record<EmpStatus, { label: string }> = {
  ACTIVE: { label: "Active" },
  ON_LEAVE: { label: "On Leave" },
  INACTIVE: { label: "Inactive" },
};

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({
  label,
  children,
}) => (
  <div className="space-y-2">
    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
      {label}
    </p>
    {children}
  </div>
);

type InstantCreateProps = {
  disabled?: boolean;
};

const InstantCreateEmployee = forwardRef<StepHandle, InstantCreateProps>(
  function InstantCreateEmployee({ disabled }, ref) {
    const [name, setName] = useState("Ahmed Khan");
    const [employeeId, setEmployeeId] = useState("EMP-2001");
    const [email, setEmail] = useState("ahmed.khan@company.com");
    const [phone, setPhone] = useState("+92 300 0000000");
    const [department, setDepartment] = useState("Engineering");
    const [designation, setDesignation] = useState("Software Engineer");
    const [location, setLocation] = useState("Lahore");
    const [employmentType, setEmploymentType] =
      useState<EmploymentType>("PERMANENT");
    const [status, setStatus] = useState<EmpStatus>("ACTIVE");
    const [joinedAt, setJoinedAt] = useState("2025-01-01");
    const [managerName, setManagerName] = useState("You (Manager)");

    const [saving, setSaving] = useState(false);

    const buildPayload = () => ({
      name,
      employeeId,
      email,
      phone,
      department,
      designation,
      location,
      employmentType,
      status,
      joinedAt,
      managerName,
      avatar: name
        .split(" ")
        .slice(0, 2)
        .map((x) => x[0]?.toUpperCase())
        .join(""),
    });

    // This is what OnboardX expects when clicking Next/Submit.
    useImperativeHandle(ref, () => ({
      submit: async () => {
        if (disabled || saving) return false;

        // minimal validation (keep it simple)
        if (!name.trim() || !email.trim() || !employeeId.trim()) {
          toast("Name, Employee ID and Email are required");
          return false;
        }

        try {
          setSaving(true);

          // ✅ Replace this endpoint with your real create-employee API
          // Example:
          // await api.post("/v1/employees", buildPayload(), { headers: { ... } });

          console.log("INSTANT CREATE EMPLOYEE PAYLOAD", buildPayload());
          toast("Employee created (instant)!");

          return true;
        } catch (e: any) {
          toast(e?.response?.data?.message || e?.message || "Create failed");
          return false;
        } finally {
          setSaving(false);
        }
      },
    }));

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Name">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={disabled || saving}
            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 outline-none focus:ring-4 focus:ring-[#3E3B6F]/5 disabled:opacity-60"
          />
        </Field>

        <Field label="Employee ID">
          <input
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            disabled={disabled || saving}
            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 outline-none focus:ring-4 focus:ring-[#3E3B6F]/5 disabled:opacity-60"
          />
        </Field>

        <Field label="Email">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={disabled || saving}
            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 outline-none focus:ring-4 focus:ring-[#3E3B6F]/5 disabled:opacity-60"
          />
        </Field>

        <Field label="Phone">
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={disabled || saving}
            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 outline-none focus:ring-4 focus:ring-[#3E3B6F]/5 disabled:opacity-60"
          />
        </Field>

        <Field label="Department">
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            disabled={disabled || saving}
            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-bold text-gray-700 outline-none focus:ring-4 focus:ring-[#3E3B6F]/5 disabled:opacity-60"
          >
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Designation">
          <select
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
            disabled={disabled || saving}
            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-bold text-gray-700 outline-none focus:ring-4 focus:ring-[#3E3B6F]/5 disabled:opacity-60"
          >
            {DESIGNATIONS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Location">
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            disabled={disabled || saving}
            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-bold text-gray-700 outline-none focus:ring-4 focus:ring-[#3E3B6F]/5 disabled:opacity-60"
          >
            {LOCATIONS.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Employment Type">
          <select
            value={employmentType}
            onChange={(e) => setEmploymentType(e.target.value as any)}
            disabled={disabled || saving}
            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-bold text-gray-700 outline-none focus:ring-4 focus:ring-[#3E3B6F]/5 disabled:opacity-60"
          >
            {Object.keys(TYPE_CONFIG).map((t) => (
              <option key={t} value={t}>
                {TYPE_CONFIG[t as EmploymentType].label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Status">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
            disabled={disabled || saving}
            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-bold text-gray-700 outline-none focus:ring-4 focus:ring-[#3E3B6F]/5 disabled:opacity-60"
          >
            {Object.keys(STATUS_CONFIG).map((s) => (
              <option key={s} value={s}>
                {STATUS_CONFIG[s as EmpStatus].label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Joined At">
          <input
            type="date"
            value={joinedAt}
            onChange={(e) => setJoinedAt(e.target.value)}
            disabled={disabled || saving}
            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-bold text-gray-700 outline-none focus:ring-4 focus:ring-[#3E3B6F]/5 disabled:opacity-60"
          />
        </Field>

        <div className="md:col-span-2">
          <Field label="Manager Name">
            <input
              value={managerName}
              onChange={(e) => setManagerName(e.target.value)}
              disabled={disabled || saving}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 outline-none focus:ring-4 focus:ring-[#3E3B6F]/5 disabled:opacity-60"
            />
          </Field>
        </div>

        <div className="md:col-span-2 pt-2">
          <button
            type="button"
            disabled={disabled || saving}
            onClick={() => ref && (ref as any)?.current?.submit?.()}
            className="w-full px-3 py-2 rounded-lg font-semibold text-xs text-white flex items-center justify-center gap-2 disabled:opacity-60"
            style={{
              background: `linear-gradient(135deg, ${colors.secondary}, ${colors.primary})`,
            }}
          >
            {saving ? "Creating..." : "Create Employee Instantly"}
            <Bolt className="w-3.5 h-3.5" />
          </button>
          <p className="mt-2 text-[11px] text-gray-500 text-center">
            This is the Instant tab. Wire it to your real API endpoint.
          </p>
        </div>
      </div>
    );
  },
);

export default function OnboardX() {
  const [uiMode, setUiMode] = useState<ModeX>("quick");
  const [step, setStep] = useState<number>(0);

  const [switching, setSwitching] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingMode, setPendingMode] = useState<ModeX | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const {
    enrollmentId,
    mode: enrollmentMode,
    stepIndex,
    startEnrollmentDraft,
    clearEnrollment,
  } = useEnrollmentContext();

  // Sync UI from backend draft state (only for QUICK/DETAILED)
  useEffect(() => {
    if (!enrollmentMode) return;

    // If backend draft exists, we stay in quick/detailed.
    const m: ModeX = enrollmentMode === "QUICK" ? "quick" : "detailed";
    setUiMode(m);
    setStep(stepIndex ?? 0);
  }, [enrollmentMode, stepIndex]);

  // Create initial QUICK draft ONCE on first visit (StrictMode safe)
  const hasInitRef = useRef(false);
  useEffect(() => {
    if (hasInitRef.current) return;

    // If draft already exists, don't create a new one.
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
  const steps = useMemo<StepDef[]>(() => {
    if (uiMode === "quick") return quickFormSteps;
    if (uiMode === "detailed") return detailedFormSteps;

    // ✅ Instant mode = single “step” for UI consistency
    return [
      {
        id: "instant-create",
        title: "Instant Create",
        subtitle: "Create an employee instantly (no enrollment wizard).",
        icon: Bolt,
        fields: [], // no zod fields in wizard schema
      },
    ] as any;
  }, [uiMode]);

  const current = steps[step];
  const total = steps.length;

  // keep your zod schema building
  const schema = useMemo(() => buildZodSchema(steps), [steps]);

  const form = useForm({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: {},
  });

  const { handleSubmit, getValues } = form;

  const progress = ((step + 1) / total) * 100;
  const totalFields = useMemo(
    () => steps.reduce((s, st) => s + (st.fields?.length ?? 0), 0),
    [steps],
  );
  const requiredFields = useMemo(
    () =>
      steps.reduce(
        (s, st) =>
          s + (st.fields?.filter?.((f: any) => f.required)?.length ?? 0),
        0,
      ),
    [steps],
  );

  // Current step component ref
  const stepRef = useRef<StepHandle | null>(null);

  // Switch Mode flow
  const requestToggleMode = useCallback(
    (m: ModeX) => {
      if (switching) return;
      if (m === uiMode) return;

      setPendingMode(m);
      setConfirmOpen(true);
    },
    [switching, uiMode],
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

      // 1) delete existing draft (if id exists) ONLY if we were in quick/detailed
      //    (Instant doesn't create drafts by itself)
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

      // 3) start new draft ONLY for quick/detailed.
      if (pendingMode === "quick" || pendingMode === "detailed") {
        await startEnrollmentDraft({
          mode: pendingMode === "quick" ? "QUICK" : "DETAILED",
          type: "CREATE",
          employee_id: null,
        });
      }

      // 4) reset UI
      setUiMode(pendingMode);
      setStep(0);
    } catch (e: any) {
      toast(
        e?.response?.data?.message || e?.message || "Failed to switch form",
      );
    } finally {
      setConfirmLoading(false);
      setSwitching(false);
      setConfirmOpen(false);
      setPendingMode(null);
    }
  }, [pendingMode, enrollmentId, clearEnrollment, startEnrollmentDraft]);

  // Footer Next: call current step submit() then goNext
  const goNext = async () => {
    if (switching || confirmLoading) return;

    const ok = await stepRef.current?.submit?.();
    if (!ok) return;

    setStep((s) => Math.min(total - 1, s + 1));
  };

  const goPrev = () => {
    if (switching || confirmLoading) return;
    setStep((s) => Math.max(0, s - 1));
  };

  const onSubmit = async () => {
    console.log("FINAL SUBMIT", { enrollmentId, values: getValues() });
    toast("Form Submitted!");
  };

  const Icon = current.icon;

  // pick correct step component
  const StepComponent =
    uiMode === "instant"
      ? (InstantCreateEmployee as any)
      : stepComponents[uiMode][step];

  const modeBtnStyle = (active: boolean) => ({
    background: active ? "white" : "transparent",
    color: active ? colors.primary : "#706C7A",
    boxShadow: active ? "0 1px 2px rgba(0,0,0,0.08)" : "none",
  });

  return (
    <div>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-200">
        <div className=" mx-auto px-3 h-12 flex items-center justify-between">
          <div
            className="flex items-center gap-1 p-0.5 rounded-lg"
            style={{ background: "#F1F1F3" }}
          >
            {(["quick", "detailed", "instant"] as const).map((m) => (
              <button
                key={m}
                onClick={() => requestToggleMode(m)}
                disabled={switching}
                className="px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all flex items-center gap-1"
                style={modeBtnStyle(uiMode === m)}
              >
                {m === "quick" ? (
                  <>
                    <Zap className="w-3 h-3" /> Quick
                  </>
                ) : m === "detailed" ? (
                  <>
                    <LayoutDashboard className="w-3 h-3" /> Detailed
                  </>
                ) : (
                  <>
                    <Bolt className="w-3 h-3" /> Instant
                  </>
                )}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className=" mx-auto px-3 py-4">
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
                {uiMode === "quick"
                  ? "Quick Form"
                  : uiMode === "detailed"
                    ? "Detailed Form"
                    : "Instant Create"}{" "}
                • {total} Steps • {totalFields} Fields • {requiredFields}{" "}
                Required
                {enrollmentId && uiMode !== "instant"
                  ? ` • Draft #${enrollmentId}`
                  : ""}
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

        {/* Form container */}
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

          {/* STEP CONTENT */}
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

          {/* Footer Buttons */}
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
              ),
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
