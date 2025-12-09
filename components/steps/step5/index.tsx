"use client";

import React, { useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "@/api/client";
import { props } from "./types";

import {
  Building2,
  Globe2,
  Mail,
  Phone,
  MapPin,
  Network,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCompanyContext } from "@/context/CompanyContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// ---- Types for the API response ----

type LinksJsonItem = {
  platform: string;
  url: string;
  handle: string;
};

type SummaryResponse = {
  success: boolean;
  data: {
    company: {
      id: number;
      legal_name: string;
      short_code: string | null;
      logo_path: string | null;
      description: string | null;
      website: string | null;
    };
    socials: {
      id: number;
      company_id: number;
      links_json: LinksJsonItem[];
      support_email: string | null;
      is_draft: boolean;
      draft_batch_id?: string | null;
    } | null;
    legal: {
      id: number;
      company_id: number;
      registered_email: string;
      main_phone: string | null;
      timezone: string;
      country_id: number | null;
      state_id: number | null;
      city_id: number | null;
      street: string | null;
      zip: string | null;
      registration_no: string | null;
      tax_vat_id: string | null;
      letterhead_path: string | null;
      address_line_1: string | null;
      address_line_2: string | null;
      draft_batch_id?: string | null;
    } | null;
    org: {
      meta: {
        entity_type_id: number;
        business_line_id: number;
        location_type_id: number;
        entity_type?: { name: string } | null;
        business_line?: { name: string } | null;
        location_type?: { name: string } | null;
        is_draft?: boolean | number;
        draft_batch_id?: string | null;
      };
      divisions: Array<{
        id: number;
        name: string;
        departments: Array<{
          id: number;
          name: string;
          sub_departments: Array<{ id: number; name: string }>;
        }>;
      }>;
    };
  };
};

// ------------------------------------

const Step5Preview: React.FC<props> = ({ next, prev, isLast }) => {
  const { companyId } = useCompanyContext();

  const { data, isLoading, isError, refetch } = useQuery<SummaryResponse>({
    queryKey: ["company-setup-summary", companyId],
    enabled: !!companyId,
    queryFn: async () => {
      const res = await api.get(`/v1/companies/${companyId}/setup/summary`);
      return res.data;
    },
  });
  const router = useRouter();
  useEffect(() => {
    if (companyId) refetch();
  }, [companyId, refetch]);

  const summary = data?.data;
  const socials = summary?.socials;
  const legal = summary?.legal;
  const divisions = summary?.org.divisions ?? [];

  // pick draft_batch_id (pref from org.meta, fallback to legal/socials)
  const draftBatchId =
    summary?.org.meta.draft_batch_id ??
    legal?.draft_batch_id ??
    socials?.draft_batch_id ??
    null;

  // ---------- publish mutation ----------
  const publishMutation = useMutation({
    mutationFn: async (draftBatchIdArg?: string | null) => {
      if (!companyId) throw new Error("Missing company id");

      const idempotencyKey =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : Math.random().toString(36).slice(2);

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Idempotency-Key": idempotencyKey,
      };

      if (draftBatchIdArg) {
        headers["Draft-Batch-Id"] = draftBatchIdArg;
      }

      await api.post(
        `/v1/companies/${companyId}/setup/publish`,
        {},
        { headers }
      );
    },
    onSuccess: () => {
      toast.success("Company published successfully");
      router.push("/flexi-hq/hr-groundzero/companies");
    },
    onError: () => {
      toast.error("Failed to publish company");
    }
  });

  const isPublishing = publishMutation.isPending;

  // You can customise how you build logo URL
  const logoUrl =
    summary?.company.logo_path &&
    `${process.env.NEXT_PUBLIC_API_BASE_URL_IMAGE ?? ""}/${
      summary.company.logo_path
    }`;
  const entityTag = summary?.org.meta.entity_type?.name;
  const lineTag = summary?.org.meta.business_line?.name;
  const locationTag = summary?.org.meta.location_type?.name;

  const prettyUrl = (url?: string | null) =>
    !url ? "" : url.replace(/^https?:\/\//i, "");

  const formatAddress = () => {
    if (!legal) return "";
    const parts: string[] = [];
    if (legal.address_line_1) parts.push(legal.address_line_1);
    if (legal.address_line_2) parts.push(legal.address_line_2);
    if (legal.street) parts.push(legal.street);
    if (legal.zip) parts.push(legal.zip);
    return parts.join(", ");
  };

  const fullAddress = formatAddress();

  const handlePrimaryClick = () => {
    if (isLast) {
      publishMutation.mutate(draftBatchId);
    } else {
      next();
    }
  };

  return (
    <div className="space-y-6">
      {/* Top header / status */}
      <div className="flex items-center justify-between gap-4 rounded-xl border bg-card/60 px-4 py-3">
        <div className="flex items-center gap-4">
          {logoUrl ? (
            <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-background ring-1 ring-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logoUrl}
                alt={summary?.company.legal_name ?? "Company logo"}
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/5 text-lg font-semibold text-primary ring-1 ring-primary/20">
              {summary?.company.legal_name?.charAt(0) ?? "C"}
            </div>
          )}

          <div className="space-y-1">
            <h2 className="text-lg font-semibold tracking-tight">
              {summary?.company.legal_name ?? "Company preview"}
            </h2>
            <p className="text-xs text-muted-foreground">
              Quick review of your company profile before confirming.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2 text-xs">
          {entityTag && (
            <span className="rounded-full bg-primary/5 px-3 py-1 text-[11px] font-medium text-primary">
              {entityTag}
            </span>
          )}
          {lineTag && (
            <span className="rounded-full bg-muted px-3 py-1 text-[11px] font-medium text-muted-foreground">
              {lineTag}
            </span>
          )}
          {locationTag && (
            <span className="rounded-full bg-muted px-3 py-1 text-[11px] font-medium text-muted-foreground">
              {locationTag}
            </span>
          )}
        </div>
      </div>

      {/* Loading / error */}
      {isLoading && (
        <div className="flex h-40 items-center justify-center rounded-xl border bg-muted/40 text-sm text-muted-foreground">
          Loading company summary…
        </div>
      )}

      {isError && !isLoading && (
        <div className="flex h-40 flex-col items-center justify-center gap-2 rounded-xl border border-destructive/40 bg-destructive/5 text-sm text-destructive">
          <span>Could not load company summary.</span>
          <span className="text-xs opacity-80">
            Please go back, check your connection and try again.
          </span>
        </div>
      )}

      {summary && !isLoading && !isError && (
        <>
          {/* Main grid */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* Company basics + socials */}
            <div className="rounded-xl border bg-card p-4 shadow-sm">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Building2 className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold">Company basics</h3>
                  <p className="text-xs text-muted-foreground">
                    Name, brand and public-facing details.
                  </p>
                </div>
              </div>

              <dl className="space-y-2 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Legal name</dt>
                  <dd className="font-medium text-right">
                    {summary.company.legal_name}
                  </dd>
                </div>

                {summary.company.short_code && (
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">Short code</dt>
                    <dd className="font-medium text-right">
                      {summary.company.short_code}
                    </dd>
                  </div>
                )}

                {summary.company.website && (
                  <div className="flex justify-between gap-4">
                    <dt className="flex items-center gap-1 text-muted-foreground">
                      <Globe2 className="h-3 w-3" />
                      Website
                    </dt>
                    <dd className="text-right">
                      <a
                        href={summary.company.website}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-medium text-primary underline-offset-2 hover:underline"
                      >
                        {prettyUrl(summary.company.website)}
                      </a>
                    </dd>
                  </div>
                )}

                {summary.company.description && (
                  <div className="pt-2">
                    <dt className="mb-1 text-xs font-semibold text-muted-foreground">
                      About
                    </dt>
                    <dd className="max-h-24 overflow-y-auto text-xs leading-relaxed text-muted-foreground">
                      {summary.company.description}
                    </dd>
                  </div>
                )}
              </dl>

              {socials && (
                <div className="mt-4 border-t pt-3">
                  <h4 className="mb-1 text-xs font-semibold text-muted-foreground">
                    Digital presence
                  </h4>
                  <div className="space-y-1 text-xs">
                    {socials.support_email && (
                      <div className="flex items-center justify-between gap-4">
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          Support email
                        </span>
                        <span className="font-medium">
                          {socials.support_email}
                        </span>
                      </div>
                    )}

                    {socials.links_json?.length > 0 && (
                      <div className="pt-1">
                        <span className="mb-1 block text-[11px] font-semibold text-muted-foreground">
                          Social links
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {socials.links_json.map((link) => (
                            <a
                              key={`${link.platform}-${link.handle}`}
                              href={link.url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground hover:bg-muted/80"
                            >
                              <span className="capitalize">
                                {link.platform}
                              </span>
                              <span className="opacity-70">@{link.handle}</span>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Legal + contact */}
            <div className="rounded-xl border bg-card p-4 shadow-sm">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold">Contact & Legal</h3>
                  <p className="text-xs text-muted-foreground">
                    Registration, tax and primary contact details.
                  </p>
                </div>
              </div>

              {legal ? (
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="flex items-center gap-1 text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      Registered email
                    </dt>
                    <dd className="font-medium text-right">
                      {legal.registered_email}
                    </dd>
                  </div>

                  {legal.main_phone && (
                    <div className="flex justify-between gap-4">
                      <dt className="flex items-center gap-1 text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        Main phone
                      </dt>
                      <dd className="font-medium text-right">
                        {legal.main_phone}
                      </dd>
                    </div>
                  )}

                  {legal.registration_no && (
                    <div className="flex justify-between gap-4">
                      <dt className="text-muted-foreground">
                        Registration no.
                      </dt>
                      <dd className="font-medium text-right">
                        {legal.registration_no}
                      </dd>
                    </div>
                  )}

                  {legal.tax_vat_id && (
                    <div className="flex justify-between gap-4">
                      <dt className="text-muted-foreground">Tax / VAT ID</dt>
                      <dd className="font-medium text-right">
                        {legal.tax_vat_id}
                      </dd>
                    </div>
                  )}

                  {/* full address block */}
                  <div className="pt-2">
                    <dt className="mb-1 flex items-center gap-1 text-xs font-semibold text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      Registered address
                    </dt>
                    {fullAddress ? (
                      <dd className="max-h-20 overflow-y-auto rounded-md bg-muted/60 px-2 py-1 text-xs leading-relaxed text-muted-foreground">
                        {fullAddress}
                      </dd>
                    ) : (
                      <dd className="text-xs text-muted-foreground">
                        Not provided.
                      </dd>
                    )}
                  </div>

                  <div className="pt-2">
                    <dt className="mb-1 text-xs font-semibold text-muted-foreground">
                      Timezone
                    </dt>
                    <dd className="inline-flex rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                      {legal.timezone}
                    </dd>
                  </div>
                </dl>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Legal/contact information not yet added in Step 3.
                </p>
              )}
            </div>
          </div>

          {/* Org structure preview */}
          <div className="rounded-xl border bg-card p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Network className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold">Org structure</h3>
                  <p className="text-xs text-muted-foreground">
                    Divisions, departments and reporting lines.
                  </p>
                </div>
              </div>
              <span className="rounded-full bg-muted px-3 py-1 text-[11px] font-medium text-muted-foreground">
                {divisions.length} division
                {divisions.length === 1 ? "" : "s"}
              </span>
            </div>

            {divisions.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                No divisions added yet in Step 4.
              </p>
            ) : (
              <div className="space-y-3">
                {divisions.map((div) => (
                  <div
                    key={div.id}
                    className="rounded-lg border bg-muted/40 p-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold">{div.name}</span>
                      <span className="text-[11px] text-muted-foreground">
                        {div.departments.length} dept
                        {div.departments.length === 1 ? "" : "s"}
                      </span>
                    </div>

                    {div.departments.length > 0 && (
                      <div className="mt-2 space-y-1.5 text-xs">
                        {div.departments.map((dept) => (
                          <div key={dept.id}>
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{dept.name}</span>
                              <span className="text-[11px] text-muted-foreground">
                                {dept.sub_departments.length} sub-dept
                                {dept.sub_departments.length === 1 ? "" : "s"}
                              </span>
                            </div>

                            {dept.sub_departments.length > 0 && (
                              <div className="mt-1 flex flex-wrap gap-1.5">
                                {dept.sub_departments.map((sd) => (
                                  <span
                                    key={sd.id}
                                    className="rounded-full bg-background px-2 py-0.5 text-[11px] text-muted-foreground"
                                  >
                                    {sd.name}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {publishMutation.isError && (
            <p className="text-xs text-destructive">
              Failed to publish company. Please try again.
            </p>
          )}
        </>
      )}

      {/* Navigation buttons */}
      <div className="mt-4 flex items-center justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={prev}
          className="flex items-center gap-1"
          disabled={isPublishing}
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </Button>

        <Button
          type="button"
          onClick={handlePrimaryClick}
          disabled={isPublishing}
          className={cn(
            "flex items-center gap-1",
            isLast && "bg-primary text-primary-foreground"
          )}
        >
          {isLast ? (isPublishing ? "Publishing..." : "Confirm & Save") : "Next"}
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Step5Preview;
