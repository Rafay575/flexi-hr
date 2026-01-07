// src/features/employeeTransfers/hooks/useTransferEmployees.ts
import { useEffect, useMemo, useRef, useState } from "react";
import { api } from "@/components/api/client";

export type ApiTransferEmployee = {
  id: number;
  emp_code: string;
  name: string;
  grade?: string | null;
  location?: string | null;
  department?: string | null;
  designation?: string | null;
  avatar_url?: string | null;
  avatar_text?: string | null;
  role?: string | null;
};

type Meta = {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
};

type Resp = { data: ApiTransferEmployee[]; meta: Meta };

function useDebounced<T>(value: T, ms = 400) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return v;
}

export function useTransferEmployees() {
  const perPage = 15;

  const [items, setItems] = useState<ApiTransferEmployee[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounced(search, 350);

  const pageRef = useRef(1);
  const lastPageRef = useRef(1);
  const canLoadRef = useRef(true);

  const sentinelRef = useRef<HTMLDivElement>(null);

  const fetchPage = async (page: number, replace = false) => {
    if (!canLoadRef.current) return;
    setLoading(true);
    setError("");

    try {
      const res = await api.get<Resp>("/employee-transfers/employees", {
        params: {
          search: debouncedSearch || undefined,
          per_page: perPage,
          page,
        },
      });

      const newItems = res.data?.data ?? [];
      const meta = res.data?.meta;

      pageRef.current = meta?.current_page ?? page;
      lastPageRef.current = meta?.last_page ?? 1;

      setItems((prev) => (replace ? newItems : [...prev, ...newItems]));
    } catch (e: any) {
      setError(e?.response?.data?.message || "Failed to load employees.");
    } finally {
      setLoading(false);
    }
  };

  const refresh = () => {
    pageRef.current = 1;
    lastPageRef.current = 1;
    canLoadRef.current = true;
    fetchPage(1, true);
  };

  // initial + whenever search changes
  useEffect(() => {
    pageRef.current = 1;
    lastPageRef.current = 1;
    canLoadRef.current = true;
    fetchPage(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  // infinite scroll observer
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting) return;
        if (loading) return;

        const next = pageRef.current + 1;
        if (next > lastPageRef.current) return;

        fetchPage(next, false);
      },
      { root: null, rootMargin: "400px", threshold: 0.01 }
    );

    obs.observe(el);
    return () => obs.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, debouncedSearch]);

  return {
    items,
    loading,
    error,
    search,
    setSearch,
    sentinelRef,
    refresh,
  };
}
