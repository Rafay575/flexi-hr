import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { api } from "@/components/api/client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/Card";

import {
  ArrowLeft,
  Globe,
  Mail,
  Phone,
  Building2,
  BadgeCheck,
  MapPin,
  Calendar,
  Hash,
  Sparkles,
  Layers,
  Network,
  Copy,
  Check,
  Shield,
  Link as LinkIcon,
} from "lucide-react";

// ---------------- Types ----------------
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
      support_email: string | null;
      links_json: { platform: string; url: string; handle?: string | null }[];
      is_active: boolean;
      is_draft: boolean;
      published_at: string | null;
    } | null;
    legal: {
      registered_email: string | null;
      main_phone: string | null;
      timezone: string | null;
      address_line_1: string | null;
      address_line_2: string | null;
      street: string | null;
      zip: string | null;
      registration_no: string | null;
      tax_vat_id: string | null;
      established_on: string | null;
      currency_id: number | null;
      country_id: number | null;
      state_id: number | null;
      city_id: number | null;
      is_draft: boolean;
      published_at: string | null;
    } | null;
    org: {
      meta: {
        entity_type_id: number | null;
        business_line_id: number | null;
        location_type_id: number | null;
        entity_type?: { name: string; code: string; abbrev?: string | null } | null;
        business_line?: { name: string; code: string } | null;
        location_type?: { name: string; code: string; scope?: string | null } | null;
        is_draft: number | null;
      } | null;
      divisions: any[];
    } | null;
  };
};

const safe = (v: any) => (v === null || v === undefined || v === "" ? "—" : String(v));

const formatDate = (iso?: string | null) => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString();
};

const normalizePlatformLabel = (p: string) => {
  const x = (p || "").toLowerCase();
  if (x === "facebook") return "Facebook";
  if (x === "instagram") return "Instagram";
  if (x === "linkedin") return "LinkedIn";
  if (x === "twitter" || x === "x") return "X";
  if (x === "youtube") return "YouTube";
  if (x === "tiktok") return "TikTok";
  return p || "—";
};

const getInitials = (name?: string | null) => {
  if (!name) return "CO";
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase()).join("") || "CO";
};

// ---------------- API ----------------
async function fetchCompanySummary(companyId: number): Promise<SummaryResponse> {
  const res = await api.get<SummaryResponse>(`/v1/companies/${companyId}/setup/summary`, {
    headers: { Accept: "application/json" },
  });

  if (!res.data?.success) throw new Error("Failed to load company summary");
  return res.data;
}

// ---------------- UI helpers ----------------
function Pill({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "success" | "warning" | "danger" | "info";
}) {
  const cls =
    tone === "success"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : tone === "warning"
      ? "bg-amber-50 text-amber-700 border-amber-200"
      : tone === "danger"
      ? "bg-rose-50 text-rose-700 border-rose-200"
      : tone === "info"
      ? "bg-sky-50 text-sky-700 border-sky-200"
      : "bg-muted/40 text-foreground border-muted";

  return (
    <span className={`text-[11px] px-2.5 py-1 rounded-full border ${cls}`}>
      {children}
    </span>
  );
}

function CopyText({ value }: { value?: string | null }) {
  const [copied, setCopied] = React.useState(false);

  const canCopy = !!value && value !== "—";
  return (
    <button
      type="button"
      disabled={!canCopy}
      onClick={async () => {
        if (!canCopy) return;
        try {
          await navigator.clipboard.writeText(value as string);
          setCopied(true);
          setTimeout(() => setCopied(false), 900);
        } catch {
          // ignore
        }
      }}
      className={`ml-2 inline-flex items-center gap-1 text-xs px-2 py-1 rounded-lg border transition ${
        canCopy
          ? "hover:bg-muted/60"
          : "opacity-50 cursor-not-allowed bg-muted/20 text-muted-foreground"
      }`}
      title={canCopy ? "Copy" : "Nothing to copy"}
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function InfoRow({
  icon,
  label,
  value,
  valueAsLink,
  copyValue,
}: {
  icon?: React.ReactNode;
  label: string;
  value: React.ReactNode;
  valueAsLink?: string | null;
  copyValue?: string | null;
}) {
  return (
    <div className="flex items-start gap-3 py-2">
      <div className="mt-0.5 text-muted-foreground">{icon}</div>
      <div className="min-w-0 flex-1">
        <div className="text-xs text-muted-foreground">{label}</div>

        <div className="flex items-center gap-2 min-w-0">
          {valueAsLink ? (
            <a
              href={valueAsLink}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-semibold text-blue-600 hover:underline break-all"
            >
              {value}
            </a>
          ) : (
            <div className="text-sm font-semibold break-all">{value}</div>
          )}

          {copyValue ? <CopyText value={copyValue} /> : null}
        </div>
      </div>
    </div>
  );
}

function SectionCard({
  title,
  subtitle,
  right,
  children,
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Card className="rounded-2xl border bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <div className="px-4 py-3 border-b bg-gradient-to-r from-muted/40 via-white to-muted/10">
        <div className="flex items-center justify-between gap-2">
          <div>
            <div className="text-sm font-semibold">{title}</div>
            {subtitle ? <div className="text-xs text-muted-foreground mt-0.5">{subtitle}</div> : null}
          </div>
          {right ? right : <Sparkles className="h-4 w-4 text-muted-foreground" />}
        </div>
      </div>
      <div className="p-4">{children}</div>
    </Card>
  );
}

function StatTile({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <Card className="rounded-2xl border bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="p-4 flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-muted/60 to-muted/20 border flex items-center justify-center">
          {icon}
        </div>
        <div className="min-w-0">
          <div className="text-xs text-muted-foreground">{label}</div>
          <div className="text-base font-semibold truncate">{value}</div>
        </div>
      </div>
    </Card>
  );
}

function SkeletonPage() {
  return (
    <div className="p-2">
      <div className="rounded-2xl border bg-white overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-[#EEF2FF] via-white to-[#ECFEFF]">
          <div className="h-8 w-72 bg-muted rounded-lg mb-3" />
          <div className="h-4 w-[520px] bg-muted rounded-lg" />
        </div>
        <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="h-20 rounded-2xl bg-muted" />
          <div className="h-20 rounded-2xl bg-muted" />
          <div className="h-20 rounded-2xl bg-muted" />
          <div className="h-20 rounded-2xl bg-muted" />
        </div>
      </div>

      <div className="mt-4 rounded-2xl border bg-white p-4">
        <div className="h-10 w-80 bg-muted rounded-xl" />
      </div>

      <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="h-56 bg-muted rounded-2xl" />
        <div className="h-56 bg-muted rounded-2xl" />
        <div className="h-56 bg-muted rounded-2xl" />
      </div>
    </div>
  );
}

// ---------------- Page ----------------
export default function CompanySummaryPage() {
  const params = useParams();
  const companyId = Number(params.id);
  const navigate = useNavigate();

  const { data, isLoading, isError, error, isFetching, refetch } = useQuery({
    queryKey: ["company-summary", companyId],
    queryFn: () => fetchCompanySummary(companyId),
    enabled: Number.isFinite(companyId) && companyId > 0,
  });

  const payload = data?.data;
  const company = payload?.company;
  const socials = payload?.socials;
  const legal = payload?.legal;
  const org = payload?.org;

  const STORAGE_BASE =
    (import.meta as any)?.env?.VITE_STORAGE_BASE_URL || "https://app.myflexihr.com/storage";

  const logoUrl = company?.logo_path ? `${STORAGE_BASE}/${company.logo_path}` : null;

  // quick counts
  const divisionsCount = org?.divisions?.length ?? 0;
  const deptsCount = Array.isArray(org?.divisions)
    ? org!.divisions.reduce((acc: number, d: any) => acc + (d?.departments?.length ?? 0), 0)
    : 0;

  const socialsTone =
    socials?.is_active ? "success" : socials ? "warning" : ("neutral" as const);

  if (!Number.isFinite(companyId) || companyId <= 0) {
    return (
      <div className="p-4">
        <div className="text-sm text-rose-600">Invalid company id in route.</div>
      </div>
    );
  }

  if (isLoading) return <SkeletonPage />;

  if (isError) {
    return (
      <div className="p-4">
        <div className="rounded-2xl border bg-white p-6">
          <div className="text-sm font-semibold text-rose-600">Failed to load</div>
          <div className="text-xs text-muted-foreground mt-1">
            {String((error as any)?.message ?? "")}
          </div>
          <div className="mt-4 flex gap-2">
            <Button variant="outline" onClick={() => refetch()}>
              Retry
            </Button>
            <Button variant="ghost" onClick={() => navigate(-1)}>
              Go back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-2">
      {/* Hero */}
      <div className="rounded-2xl border bg-white overflow-hidden mb-4 shadow-sm">
        <div className="relative p-6 ">
          <div className="absolute inset-0 pointer-events-none opacity-[0.35]">
            <div className="h-full w-full " />
          </div>

          <div className="relative flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <Link to="/flexi-hq/hr-groundzero/companies">
                <Button variant="ghost" className="h-9 px-2">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>

              <div className="flex items-start gap-4">
                <div className="h-16 w-16 rounded-2xl border bg-white flex items-center justify-center overflow-hidden shadow-sm ring-1 ring-muted">
                  {logoUrl ? (
                    <img src={logoUrl} alt="logo" className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-muted">
                      <span className="text-lg font-semibold">{getInitials(company?.legal_name)}</span>
                    </div>
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-semibold leading-tight truncate max-w-[60vw]">
                      {safe(company?.legal_name)}
                    </h1>

                    {isFetching ? (
                      <Pill tone="info">refreshing…</Pill>
                    ) : (
                      <Pill tone="neutral">ID: {companyId}</Pill>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 mt-2">
                    <Pill tone="neutral">
                      Code: <span className="font-semibold">{safe(company?.short_code)}</span>
                    </Pill>

                    {company?.website ? (
                      <Pill tone="info">
                        <a
                          href={company.website}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-700 hover:underline"
                        >
                          {company.website}
                        </a>
                      </Pill>
                    ) : (
                      <Pill tone="neutral">No website</Pill>
                    )}

                    {socials ? (
                      <Pill tone={socialsTone}>
                        Socials: <span className="font-semibold">{socials.is_active ? "ACTIVE" : "INACTIVE"}</span>
                      </Pill>
                    ) : (
                      <Pill tone="neutral">Socials: —</Pill>
                    )}

                    {legal ? (
                      <Pill tone={legal.is_draft ? "warning" : "success"}>
                        Legal: <span className="font-semibold">{legal.is_draft ? "DRAFT" : "PUBLISHED"}</span>
                      </Pill>
                    ) : (
                      <Pill tone="neutral">Legal: —</Pill>
                    )}
                  </div>

                  {company?.description ? (
                    <div className="text-sm text-muted-foreground mt-3 max-w-3xl">
                      {company.description}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="flex gap-2 shrink-0">
              <Button
                variant="outline"
                onClick={() => {
                  // adjust to your edit route
                  navigate("/flexi-hq/hr-groundzero/companies/create");
                }}
              >
                Edit
              </Button>
              <Button variant="outline" onClick={() => refetch()}>
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-3">
          <StatTile
            icon={<BadgeCheck className="h-5 w-5 text-muted-foreground" />}
            label="Entity Type"
            value={safe(org?.meta?.entity_type?.name)}
          />
          <StatTile
            icon={<Layers className="h-5 w-5 text-muted-foreground" />}
            label="Business Line"
            value={safe(org?.meta?.business_line?.name)}
          />
          <StatTile
            icon={<Network className="h-5 w-5 text-muted-foreground" />}
            label="Divisions"
            value={divisionsCount}
          />
          <StatTile
            icon={<Building2 className="h-5 w-5 text-muted-foreground" />}
            label="Departments"
            value={deptsCount}
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <div className="sticky top-0 z-10">
          <TabsList className="w-full justify-start gap-1 rounded-2xl border bg-white/80 backdrop-blur p-1 shadow-sm">
            <TabsTrigger className="rounded-xl" value="overview">
              Overview
            </TabsTrigger>
            <TabsTrigger className="rounded-xl" value="legal">
              Legal
            </TabsTrigger>
            <TabsTrigger className="rounded-xl" value="social">
              Social
            </TabsTrigger>
            <TabsTrigger className="rounded-xl" value="org">
              Org
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Overview */}
        <TabsContent value="overview" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <SectionCard
              title="About"
              subtitle="Public company profile"
              right={<Shield className="h-4 w-4 text-muted-foreground" />}
            >
              <InfoRow
                icon={<BadgeCheck className="h-4 w-4" />}
                label="Entity Type"
                value={safe(org?.meta?.entity_type?.name)}
              />
              <InfoRow
                icon={<Hash className="h-4 w-4" />}
                label="Entity Type Code"
                value={safe(org?.meta?.entity_type?.code)}
                copyValue={org?.meta?.entity_type?.code ?? null}
              />
              <InfoRow
                icon={<Globe className="h-4 w-4" />}
                label="Website"
                value={safe(company?.website)}
                valueAsLink={company?.website ?? null}
                copyValue={company?.website ?? null}
              />
              <div className="mt-3">
                <div className="text-xs text-muted-foreground">Description</div>
                <div className="text-sm mt-1 whitespace-pre-wrap">
                  {company?.description ? company.description : "—"}
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Contacts" subtitle="Support + registered contact">
              <InfoRow
                icon={<Mail className="h-4 w-4" />}
                label="Support Email"
                value={safe(socials?.support_email)}
                copyValue={socials?.support_email ?? null}
              />
              <InfoRow
                icon={<Mail className="h-4 w-4" />}
                label="Registered Email"
                value={safe(legal?.registered_email)}
                copyValue={legal?.registered_email ?? null}
              />
              <InfoRow
                icon={<Phone className="h-4 w-4" />}
                label="Main Phone"
                value={safe(legal?.main_phone)}
                copyValue={legal?.main_phone ?? null}
              />
              <InfoRow
                icon={<Globe className="h-4 w-4" />}
                label="Timezone"
                value={safe(legal?.timezone)}
              />
            </SectionCard>

            <SectionCard title="Address" subtitle="Registered location">
              <InfoRow
                icon={<MapPin className="h-4 w-4" />}
                label="Address Line 1"
                value={safe(legal?.address_line_1)}
              />
              <InfoRow
                icon={<MapPin className="h-4 w-4" />}
                label="Address Line 2"
                value={safe(legal?.address_line_2)}
              />
              <InfoRow icon={<Hash className="h-4 w-4" />} label="ZIP" value={safe(legal?.zip)} />
              <InfoRow
                icon={<Calendar className="h-4 w-4" />}
                label="Established On"
                value={formatDate(legal?.established_on)}
              />
            </SectionCard>
          </div>
        </TabsContent>

        {/* Legal */}
        <TabsContent value="legal" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <SectionCard title="Legal Registration" subtitle="Company compliance details">
              <InfoRow
                icon={<Hash className="h-4 w-4" />}
                label="Registration No."
                value={safe(legal?.registration_no)}
                copyValue={legal?.registration_no ?? null}
              />
              <InfoRow
                icon={<Hash className="h-4 w-4" />}
                label="Tax / VAT ID"
                value={safe(legal?.tax_vat_id)}
                copyValue={legal?.tax_vat_id ?? null}
              />
              <InfoRow icon={<Globe className="h-4 w-4" />} label="Timezone" value={safe(legal?.timezone)} />
              <InfoRow icon={<Calendar className="h-4 w-4" />} label="Established" value={formatDate(legal?.established_on)} />

              <div className="mt-4 flex flex-wrap gap-2">
                <Pill tone={legal?.is_draft ? "warning" : "success"}>
                  Draft: <span className="font-semibold">{legal?.is_draft ? "YES" : "NO"}</span>
                </Pill>
                <Pill tone="neutral">
                  Published: <span className="font-semibold">{safe(legal?.published_at)}</span>
                </Pill>
              </div>
            </SectionCard>

            <SectionCard title="Address Details" subtitle="Full registered address">
              <InfoRow icon={<MapPin className="h-4 w-4" />} label="Street" value={safe(legal?.street)} />
              <InfoRow icon={<MapPin className="h-4 w-4" />} label="Address Line 1" value={safe(legal?.address_line_1)} />
              <InfoRow icon={<MapPin className="h-4 w-4" />} label="Address Line 2" value={safe(legal?.address_line_2)} />
              <InfoRow icon={<Hash className="h-4 w-4" />} label="ZIP" value={safe(legal?.zip)} />
              <InfoRow icon={<Hash className="h-4 w-4" />} label="Currency ID" value={safe(legal?.currency_id)} />
            </SectionCard>
          </div>
        </TabsContent>

        {/* Social */}
        <TabsContent value="social" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <SectionCard title="Support & Status" subtitle="Social module settings">
              <InfoRow
                icon={<Mail className="h-4 w-4" />}
                label="Support Email"
                value={safe(socials?.support_email)}
                copyValue={socials?.support_email ?? null}
              />

              <div className="mt-4 flex flex-wrap gap-2">
                <Pill tone={socials?.is_active ? "success" : "warning"}>
                  Active: <span className="font-semibold">{socials?.is_active ? "YES" : "NO"}</span>
                </Pill>
                <Pill tone={socials?.is_draft ? "warning" : "success"}>
                  Draft: <span className="font-semibold">{socials?.is_draft ? "YES" : "NO"}</span>
                </Pill>
                <Pill tone="neutral">
                  Published: <span className="font-semibold">{safe(socials?.published_at)}</span>
                </Pill>
              </div>

              {!socials ? (
                <div className="mt-4 text-sm text-muted-foreground">
                  Socials module not configured yet.
                </div>
              ) : null}
            </SectionCard>

            <SectionCard title="Social Links" subtitle="Public profiles">
              {socials?.links_json?.length ? (
                <div className="space-y-3">
                  {socials.links_json.map((l, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl border p-3 bg-gradient-to-br from-white to-muted/20 hover:shadow-sm transition"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <LinkIcon className="h-4 w-4 text-muted-foreground" />
                            <div className="text-sm font-semibold truncate">
                              {normalizePlatformLabel(l.platform)}
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground mt-1 break-all">{safe(l.url)}</div>
                          {l.handle ? (
                            <div className="text-xs mt-1">
                              Handle: <span className="font-semibold">{l.handle}</span>
                            </div>
                          ) : null}
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {l.url ? (
                            <a
                              href={l.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs px-2.5 py-1 rounded-lg border bg-white hover:bg-muted/50 transition"
                            >
                              Open
                            </a>
                          ) : null}
                          <CopyText value={l.url ?? null} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">No social links.</div>
              )}
            </SectionCard>
          </div>
        </TabsContent>

        {/* Org */}
        <TabsContent value="org" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <SectionCard title="Org Meta" subtitle="Entity, business line and location type">
              <InfoRow
                icon={<Building2 className="h-4 w-4" />}
                label="Entity Type"
                value={`${safe(org?.meta?.entity_type?.name)} (${safe(org?.meta?.entity_type?.code)})`}
              />
              <InfoRow
                icon={<Layers className="h-4 w-4" />}
                label="Business Line"
                value={`${safe(org?.meta?.business_line?.name)} (${safe(org?.meta?.business_line?.code)})`}
              />
              <InfoRow
                icon={<MapPin className="h-4 w-4" />}
                label="Location Type"
                value={`${safe(org?.meta?.location_type?.name)} (${safe(org?.meta?.location_type?.code)})`}
              />

              <div className="mt-4 flex flex-wrap gap-2">
                <Pill tone={org?.meta?.is_draft ? "warning" : "success"}>
                  Draft: <span className="font-semibold">{org?.meta?.is_draft ? "YES" : "NO"}</span>
                </Pill>
              </div>
            </SectionCard>

            <SectionCard title="Divisions" subtitle="High-level org units">
              {org?.divisions?.length ? (
                <div className="text-sm text-muted-foreground">
                  Divisions: <span className="font-semibold text-foreground">{divisionsCount}</span> •
                  Departments: <span className="font-semibold text-foreground"> {deptsCount}</span>
                  <div className="mt-3 text-xs text-muted-foreground">
                    (Next step: we can render divisions → departments → designations here with a clean accordion/tree UI.)
                  </div>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">No divisions found.</div>
              )}
            </SectionCard>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
