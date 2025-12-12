// src/pages/Dashboard.tsx (or wherever this lives)
import React from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import CountUp from "react-countup";
import {
  Building2,
  GitFork,
  Users,
  MapPin,
  Wallet,
  BookUser,
  Layers,
  ArrowRight,
} from "lucide-react";

import { api } from "@/components/api/client"; 
import { PageHeader } from "../components/ui/PageHeader";
import { Skeleton } from "../components/ui/Skeleton";

type DashboardCardsResponse = {
  cards: {
    company_profile: {
      label: string;
      value: number;
    };
    divisions_groups: {
      label: string;
      value: number;
      breakdown: {
        divisions: number;
        groups: number;
      };
    };
    departments_lines: {
      label: string;
      value: number;
      breakdown: {
        departments: number;
        businessLines: number;
      };
    };
    designations: {
      label: string;
      value: number;
    };
    grades_bands: {
      label: string;
      value: number;
    };
    locations: {
      label: string;
      value: number;
    };
    cost_centers: {
      label: string;
      value: number;
    };
  };
};

interface ModuleCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  path: string;
  count?: number;
  isLoading: boolean;
  accent: "accent1" | "accent2";
}

const ModuleCard: React.FC<ModuleCardProps> = ({
  title,
  description,
  icon: Icon,
  path,
  count,
  isLoading,
  accent,
}) => {
  const navigate = useNavigate();

  const iconBg =
    accent === "accent1"
      ? "bg-brand-accent1/20 text-orange-700"
      : "bg-brand-accent2/20 text-rose-700";
  const hoverBorder =
    accent === "accent1"
      ? "hover:border-brand-accent1"
      : "hover:border-brand-accent2";

  return (
    <div
      onClick={() => navigate(path)}
      className={`group bg-white rounded-xl border border-slate-100 p-6 cursor-pointer shadow-card hover:shadow-card-hover ${hoverBorder} transition-all duration-300 relative overflow-hidden flex flex-col`}
    >
      <div className="flex justify-between items-start mb-6">
        <div className={`p-3.5 rounded-xl ${iconBg} transition-colors`}>
          <Icon size={24} />
        </div>

        {isLoading ? (
          <Skeleton className="h-8 w-12 rounded-lg" />
        ) : (
          <span className="text-3xl font-bold text-slate-900 tracking-tight">
            <CountUp
              key={count ?? 0} // re-animates when count changes
              end={count ?? 0}
              duration={0.8}
              separator=","
            />
          </span>
        )}
      </div>

      <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-brand-primary transition-colors">
        {title}
      </h3>
      <p className="text-sm text-slate-500 mb-6 line-clamp-2 min-h-[40px] font-medium leading-relaxed">
        {description}
      </p>

      <div className="mt-auto flex items-center text-sm font-bold text-slate-400 group-hover:text-brand-primary transition-colors">
        Manage
        <ArrowRight
          size={16}
          className="ml-1 transform group-hover:translate-x-1 transition-transform"
        />
      </div>
    </div>
  );
};

const fetchDashboard = async (): Promise<DashboardCardsResponse> => {
  const res = await api.get("/flexi-hq/dashboard"); // ✅ uses baseURL + token from interceptor
  return res.data;
};

export const Dashboard: React.FC = () => {
  const { data, isLoading } = useQuery<DashboardCardsResponse>({
    queryKey: ["flexi-hq-dashboard"],
    queryFn: fetchDashboard,
  });

  const cards = data?.cards;

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader
        title="Flexi HQ"
        description="Core Foundation & Organization Architecture"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <ModuleCard
          title="Company Profile"
          description="Manage legal entities, subsidiaries, and registration details."
          icon={Building2}
          path="/companies"
          count={cards?.company_profile.value}
          isLoading={isLoading}
          accent="accent1"
        />

        <ModuleCard
          title="Divisions & Groups"
          description="Define top-level business units and functional groups."
          icon={Layers}
          path="/divisions"
          count={cards?.divisions_groups.value}
          isLoading={isLoading}
          accent="accent2"
        />

        <ModuleCard
          title="Departments & Lines"
          description="Structure operational departments, reporting lines, and teams."
          icon={GitFork}
          path="/departments"
          count={cards?.departments_lines.value}
          isLoading={isLoading}
          accent="accent1"
        />

        <ModuleCard
          title="Designations"
          description="Maintain job titles directory and reporting hierarchy."
          icon={BookUser}
          path="/designations"
          count={cards?.designations.value}
          isLoading={isLoading}
          accent="accent2"
        />

        <ModuleCard
          title="Grades & Bands"
          description="Configure salary bands, levels, and compensation grades."
          icon={Users}
          path="/grades"
          count={cards?.grades_bands.value}
          isLoading={isLoading}
          accent="accent1"
        />

        <ModuleCard
          title="Locations"
          description="Manage global offices, branches, and remote hubs."
          icon={MapPin}
          path="/locations"
          count={cards?.locations.value}
          isLoading={isLoading}
          accent="accent2"
        />

        <ModuleCard
          title="Cost Centers"
          description="Track financial cost codes and budget allocations."
          icon={Wallet}
          path="/cost-centers"
          count={cards?.cost_centers.value}
          isLoading={isLoading}
          accent="accent1"
        />
      </div>
    </div>
  );
};
