import { AxiosError } from "axios";
import { api } from "../client.ts";
import type { User } from "@/redux/slices/authSlice";

/* -------- Error helper (friendly messages */
export function getApiErrorMessage(e: unknown, fallback = "Something went wrong.") {
  const err = e as AxiosError<any>;
  if (err?.response) {
    const data = err.response.data as any;
    const msg = data?.message || data?.error;
    if (msg) return String(msg);
    if (err.response.status === 401) return "Invalid email or password.";
    if (err.response.status === 422) return "Validation failed. Please check inputs.";
    if (err.response.status >= 500) return "Server error. Please try again.";
  }
  if ((err as any)?.message === "Network Error") return "Network error. Check your connection.";
  return fallback;
}

/* -------- Normalize backend user -> your strict User type -------- */
export function normalizeUser(raw: any): User {
  const nowISO = new Date().toISOString();
  return {
    id: Number(raw?.id ?? 0),
    name: String(raw?.name ?? raw?.full_name ?? ""),
    email: String(raw?.email ?? ""),
    email_verified_at: raw?.email_verified_at ?? null,
    username: String(raw?.username ?? ""),
    role_id: Number(raw?.role_id ?? 0),
    employee_id: raw?.employee_id != null ? Number(raw.employee_id) : null,
    status: String(raw?.status ?? "active"),
    created_at: String(raw?.created_at ?? nowISO),
    updated_at: String(raw?.updated_at ?? nowISO),
    deleted_at: raw?.deleted_at ?? null,
    // keep any extra fields
    ...raw,
  };
}

/* -------- API calls (multipart/form-data) -------- */
export type LoginResponseRaw = { user: any; token: string };

export async function login(payload: { email: string; password: string }) {
  const fd = new FormData();
  fd.append("email_or_employee", payload.email);
  fd.append("password", payload.password);

  const { data } = await api.post<LoginResponseRaw>("/login", fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data; // { user, token }
}

export async function sendLoginOtp(payload: { email: string }) {
  const fd = new FormData();
  fd.append("email", payload.email);
  fd.append("purpose", "login");

  const { data } = await api.post<{ success: boolean; message?: string }>(
    "/auth/send-otp",
    fd,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return data; // { success, message? }
}

export type VerifyOtpResponseRaw = {
  success: boolean;
  token?: string;
  user?: any; // may be omitted if session cookie based
  message?: string;
};

export async function verifyLoginOtp(payload: { email: string; otp: string }) {
  const fd = new FormData();
  fd.append("email", payload.email);
  fd.append("otp", payload.otp);
  fd.append("purpose", "login");

  const { data } = await api.post<VerifyOtpResponseRaw>("/auth/verify-otp", fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data; // { success, token?, user? }
}





/** Send OTP for forgot-password */
export async function sendForgotOtp(payload: { email: string }) {
  const fd = new FormData();
  fd.append("email", payload.email);
  fd.append("purpose", "forgot_password");

  const { data } = await api.post<{ success: boolean; message?: string }>(
    "/auth/send-otp",
    fd,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return data;
}

/** Verify OTP for forgot-password; returns reset_token + ttl seconds */
export async function verifyForgotOtp(payload: { email: string; otp: string }) {
  const fd = new FormData();
  fd.append("email", payload.email);
  fd.append("otp", payload.otp);
  fd.append("purpose", "forgot_password");

  const { data } = await api.post<{
    success: boolean;
    reset_token: string;
    expires_in: number; // seconds
    message?: string;
  }>("/auth/verify-otp", fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

/** Reset password with token */
export async function resetForgotPassword(payload: {
  email: string;
  reset_token: string;
  password: string;
  password_confirmation: string;
}) {
  const fd = new FormData();
  fd.append("email", payload.email);
  fd.append("reset_token", payload.reset_token);
  fd.append("password", payload.password);
 fd.append("password_confirmation", payload.password_confirmation); 
  const { data } = await api.post<{ success: boolean }>(
    "/auth/reset-password",
    fd,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return data;
}
