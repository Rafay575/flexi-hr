import { useMutation } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

import { useAppDispatch } from "@/redux/store/hooks";
import {
  setCredentials,
  setError,
  logout as logoutAction,
} from "@/redux/slices/authSlice";

import {
  login, // returns LoginResponseRaw
  sendLoginOtp, // returns unknown/envelope-ish
  verifyLoginOtp, // returns VerifyOtpResponseRaw
  getApiErrorMessage,
  normalizeUser,
  type LoginResponseRaw,
  type VerifyOtpResponseRaw,
} from "@/components/api/auth/auth"; // adjust path if you changed it
import type { User } from "@/redux/slices/authSlice";

/* ------------------------------------------------
   Helper: unwrap envelope or accept raw objects
   Accepts either:
   - { status, message?, data: T }
   - T (bare)
-------------------------------------------------- */
type ApiEnvelope<T> = { status?: string; message?: string; data?: T };

function unwrapEnvelope<T>(res: T | ApiEnvelope<T>): T {
  if (res && typeof res === "object" && "data" in (res as any)) {
    return (res as ApiEnvelope<T>).data as T;
  }
  return res as T;
}

/* What we actually need from login/verify responses */
type LoginData = { user: any; token: string };
type VerifyOtpData = { user: any; token?: string };

const cookieOpts = {
  expires: 7,
  sameSite: "lax" as const,
  path: "/",
  secure:
    typeof window !== "undefined"
      ? window.location.protocol === "https:"
      : true,
};

/* -------------------------------------------
   PASSWORD LOGIN  (email+password)
-------------------------------------------- */
export function useLogin() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return useMutation<LoginResponseRaw, Error, { email: string; password: string }>({
    mutationFn: login,
    onSuccess: (raw) => {
      const data = unwrapEnvelope<LoginData>(raw as any); // handles both envelope/bare

      if (!data?.user || !data?.token) {
        dispatch(setError("Unexpected login response."));
        return;
      }

      const user: User = normalizeUser(data.user);

      Cookies.set("auth_token", data.token, cookieOpts);
      dispatch(setCredentials({ user, token: data.token })); // persists to localStorage via slice

      navigate("/dashboard");
    },
    onError: (e) => {
      dispatch(
        setError(getApiErrorMessage(e, "Login failed. Please try again."))
      );
    },
  });
}

/* -------------------------------------------
   SEND OTP (Step 1)
-------------------------------------------- */
export function useSendLoginOtp() {
  return useMutation<any, Error, { email: string }>({
    mutationFn: sendLoginOtp,
  });
}

/* -------------------------------------------
   VERIFY OTP (Step 2)
-------------------------------------------- */
export function useVerifyLoginOtp() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return useMutation<VerifyOtpResponseRaw, Error, { email: string; otp: string }>({
    mutationFn: verifyLoginOtp,
    onSuccess: (raw) => {
      const data = unwrapEnvelope<VerifyOtpData>(raw as any);

      if (!data?.user) {
        dispatch(setError("Unexpected verify response."));
        return;
      }

      const user: User = normalizeUser(data.user);

      if (data.token) {
        Cookies.set("auth_token", data.token, cookieOpts);
      }

      dispatch(setCredentials({ user, token: data.token ?? "" }));

      navigate("/dashboard");
    },
    onError: (e) => {
      dispatch(
        setError(getApiErrorMessage(e, "Invalid or expired code."))
      );
    },
  });
}

/* -------------------------------------------
   LOGOUT (client-only)
-------------------------------------------- */
export function useLogout() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async () => {
      Cookies.remove("auth_token");
      dispatch(logoutAction());
    },
    onSuccess: () => navigate("/auth/login"),
    onError: (e) => {
      dispatch(setError(getApiErrorMessage(e, "Failed to log out.")));
    },
  });
}
