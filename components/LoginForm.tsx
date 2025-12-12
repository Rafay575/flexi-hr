import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Lock, Eye, EyeOff, Loader2, CheckIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { DynamicModal } from "@/components/ui/DynamicModal";

import { useLogin, useSendLoginOtp, useVerifyLoginOtp } from "@/hooks/useAuth";
import { getApiErrorMessage } from "@/components/api/auth/auth";

/* ---------- Zod validation (discriminated union) ---------- */
const passwordSchema = z.object({
  mode: z.literal("password"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

const otpSchema = z.object({
  mode: z.literal("otp"),
  email: z.string().email("Enter a valid email"),
  otp: z.string().optional(), // enforced at verify step
});

const formSchema = z.discriminatedUnion("mode", [passwordSchema, otpSchema]);

/* ---------- RHF UI type (superset so RHF is happy) ---------- */
type FormValuesUI = {
  mode: "password" | "otp";
  email: string;
  password?: string;
  otp?: string;
};

export function LoginForm() {
  const [showPw, setShowPw] = useState(false);
  const [mode, setMode] = useState<"password" | "otp">("password");
  const [otpPhase, setOtpPhase] = useState<"idle" | "awaitingOtp">("idle");
  const [otpInfo, setOtpInfo] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const loginMutation = useLogin();
  const sendOtpMutation = useSendLoginOtp();
  const verifyOtpMutation = useVerifyLoginOtp();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
    resetField,
    watch,
    getValues,
  } = useForm<FormValuesUI>({
    resolver: zodResolver<FormValuesUI, any, FormValuesUI>(formSchema),
    mode: "onChange",
    defaultValues: { mode: "password", email: "", password: "", otp: "" },
  });

  useEffect(() => {
    setValue("mode", mode, { shouldValidate: true, shouldDirty: true });

    if (mode === "otp") {
      setShowPw(false);
    } else {
      setOtpPhase("idle");
      setOtpInfo(null);
      resetField("otp");
    }
  }, [mode, setValue, resetField]);

  // Optional success modal for password path
  useEffect(() => {
    if (loginMutation.isSuccess) setOpen(true);
  }, [loginMutation.isSuccess]);

  const onSubmit: Parameters<typeof handleSubmit>[0] = async (data) => {
    const form = data as FormValuesUI;

    setFormError(null);
    setOtpInfo(null);

    try {
      if (form.mode === "password") {
        await loginMutation.mutateAsync({
          email: form.email,
          password: form.password || "",
        });
        return;
      }

      // OTP flow
      if (otpPhase === "idle") {
        await sendOtpMutation.mutateAsync({ email: form.email });
        setOtpPhase("awaitingOtp");
        setOtpInfo("If this email exists, we’ve sent a 6-digit code to continue.");
        resetField("password");
        return;
      }

      // Verify code
      const otp = (getValues("otp") || "").trim();
      if (!/^\d{6}$/.test(otp)) {
        setFormError("Please enter the 6-digit code.");
        return;
      }
      await verifyOtpMutation.mutateAsync({ email: form.email, otp });
    } catch (e) {
      setFormError(getApiErrorMessage(e));
    }
  };

  const isSubmitting =
    mode === "password"
      ? loginMutation.isPending
      : otpPhase === "idle"
      ? sendOtpMutation.isPending
      : verifyOtpMutation.isPending;

  const visibleError =
    formError ||
    (mode === "password" && loginMutation.isError
      ? getApiErrorMessage(loginMutation.error)
      : null) ||
    (mode === "otp" && otpPhase === "idle" && sendOtpMutation.isError
      ? getApiErrorMessage(sendOtpMutation.error)
      : null) ||
    (mode === "otp" && otpPhase === "awaitingOtp" && verifyOtpMutation.isError
      ? getApiErrorMessage(verifyOtpMutation.error, "Invalid or expired code.")
      : null);

  return (
    <>
      <DynamicModal
        open={open}
        onOpenChange={setOpen}
        icon={<CheckIcon className="h-10 w-10 text-white" />}
        title="Login Successful"
        description="Let's get started and take your management business to the next level!"
        primaryAction={{
          label: "Get Started",
          onClick: () => {
            setOpen(false);
            navigate("/dashboard");
          },
        }}
        secondaryAction={{ label: "Cancel", onClick: () => setOpen(false) }}
      />

      <h2 className="text-4xl font-semibold text-center mb-3">Hi, Welcome</h2>
      <p className="mb-4 text-center text-sm text-gray-500">
        Please login to HR dashboard
      </p>

      {/* Toggle */}
      <div
        role="tablist"
        aria-label="Sign in method"
        className="relative grid grid-cols-2 rounded-xl bg-slate-100 p-1 text-sm mb-6"
      >
        <button
          role="tab"
          aria-selected={mode === "password"}
          onClick={() => setMode("password")}
          className="relative rounded-lg px-3 py-2 font-medium"
        >
          {mode === "password" && (
            <span className="absolute inset-0 rounded-lg bg-white shadow transition" />
          )}
          {mode === "password" && <span className="sr-only">Selected</span>}
          <span
            className={cn(
              "relative z-10",
              mode === "password" ? "text-slate-900" : "text-slate-600"
            )}
          >
            Password
          </span>
        </button>
        <button
          role="tab"
          aria-selected={mode === "otp"}
          onClick={() => setMode("otp")}
          className="relative rounded-lg px-3 py-2 font-medium"
        >
          {mode === "otp" && (
            <span className="absolute inset-0 rounded-lg bg-white shadow transition" />
          )}
          <span
            className={cn(
              "relative z-10",
              mode === "otp" ? "text-slate-900" : "text-slate-600"
            )}
          >
            One-Time Code
          </span>
        </button>

        <div
          className={cn(
            "pointer-events-none absolute top-1 bottom-1 w-1/2 rounded-lg bg-white shadow transition-transform duration-300",
            mode === "password" ? "translate-x-0" : "translate-x-full"
          )}
          aria-hidden
        />
      </div>

      {/* Error banner */}
      {visibleError && (
        <Alert color="red" className="mb-4">
          {visibleError}
        </Alert>
      )}

      <div className="mb-3 flex items-center gap-2">
        <Separator className="flex-1 text-gray-500 pb-[1px]" />
        <span className="text-xs text-gray-500">Or Sign in with</span>
        <Separator className="flex-1 text-gray-500 pb-[1px]" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <input type="hidden" {...register("mode")} value={mode} readOnly />

        {/* Email */}
        <div className="mb-6">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 h-4 w-4 text-gray-500" />
            <Input
              id="email"
              type="email"
              placeholder="Input your email"
              className="gradient-ring pl-10 py-5"
              {...register("email")}
              aria-invalid={!!errors.email}
              autoComplete="username"
            />
          </div>
          {errors.email?.message && (
            <p className="mt-1 text-xs text-destructive">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password (hidden in OTP mode) */}
        {mode === "password" && (
          <div className="mb-6">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 h-4 w-4 text-gray-500" />
              {showPw ? (
                <EyeOff
                  className="absolute right-3 top-3.5 h-4 w-4 text-gray-500 cursor-pointer"
                  onClick={() => setShowPw(false)}
                />
              ) : (
                <Eye
                  className="absolute right-3 top-3.5 h-4 w-4 text-gray-500 cursor-pointer"
                  onClick={() => setShowPw(true)}
                />
              )}
              <Input
                id="password"
                type={showPw ? "text" : "password"}
                className="gradient-ring pl-10 py-5"
                {...register("password")}
                placeholder="Password"
                aria-invalid={!!errors.password}
                autoComplete="current-password"
              />
              {errors.password?.message && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>
        )}

        {/* OTP Input (only after code is sent) */}
        {mode === "otp" && otpPhase === "awaitingOtp" && (
          <div className="mb-6">
            <Label htmlFor="otp">6-digit code</Label>
            <div className="relative">
              <Input
                id="otp"
                inputMode="numeric"
                pattern="\d*"
                maxLength={6}
                placeholder="Enter code"
                className="gradient-ring pl-4 py-5 tracking-widest"
                {...register("otp")}
                aria-invalid={!!errors.otp}
              />
            </div>
            {errors.otp?.message && (
              <p className="mt-1 text-xs text-destructive">
                {errors.otp.message}
              </p>
            )}
            <button
              type="button"
              className="mt-2 text-xs text-slate-600 underline"
              onClick={() => {
                const email = getValues("email");
                if (email) sendOtpMutation.mutate({ email });
              }}
              disabled={sendOtpMutation.isPending}
            >
              {sendOtpMutation.isPending ? "Resending…" : "Resend code"}
            </button>
          </div>
        )}

        {/* Submit */}
        <Button
          type="submit"
          disabled={
            !isValid ||
            isSubmitting ||
            (mode === "otp" &&
              otpPhase === "awaitingOtp" &&
              verifyOtpMutation.isPending)
          }
          className={cn(
            "mb-6 w-full py-5 bg-gradient-to-b from-[#6256F9] to-[#3B2CF8]",
            "shadow-[0_0px_1px_rgba(0,0,0,0.1),0_2px_4px_rgba(0,0,0,0.2),inset_1px_1px_1px_1px_#8980FB]",
            "transition-opacity",
            (!isValid || isSubmitting) && "opacity-50 cursor-not-allowed"
          )}
        >
          {(isSubmitting || verifyOtpMutation.isPending) && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          {mode === "password"
            ? isSubmitting
              ? "Logging in…"
              : "Login"
            : otpPhase === "idle"
            ? isSubmitting
              ? "Sending…"
              : "Send code"
            : verifyOtpMutation.isPending
            ? "Verifying…"
            : "Verify & login"}
        </Button>
      </form>

      {/* OTP info banner */}
      {otpInfo && mode === "otp" && (
        <p
          role="status"
          className="mb-4 rounded-lg border border-sky-300/40 bg-sky-50 px-3 py-2 text-xs text-sky-800"
        >
          {otpInfo}
        </p>
      )}

      {/* Footer */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Checkbox id="remember" />
          <span className="text-[14px] font-normal text-gray-500">
            Remember me
          </span>
        </div>
        <Link
          to="/auth/forgot"
          className="text-[14px] font-normal text-gray-500 hover:underline"
        >
          Forgot Password?
        </Link>
      </div>
    </>
  );
}
