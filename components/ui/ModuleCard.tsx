import React from "react";
import { useNavigate } from "react-router-dom";
import CountUp from "react-countup";
import { Skeleton } from "./Skeleton";

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

  // Dynamic accent styles
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
              key={count ?? 0} // re-animate when count changes
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
        Manage{" "}
        <span className="ml-1 transform group-hover:translate-x-1 transition-transform">
          →
        </span>
      </div>
    </div>
  );
};

export default ModuleCard;
