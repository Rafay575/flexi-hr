// src/features/enrollment/ComplianceBadge.tsx
import React from "react";
import { ComplianceLabel } from "./types";

export const ComplianceBadge: React.FC<{ label: ComplianceLabel }> = ({ label }) => {
  const styles: Record<string, { bg: string; color: string }> = {
    EOBI: { bg: "#F4E8D4", color: "#A67F45" },
    NADRA: { bg: "#F1F1F3", color: "#5C5966" },
    FBR: { bg: "#D1FAE5", color: "#065F46" },
    SS: { bg: "#E3E1EB", color: "#625D78" },
    "Min Wage": { bg: "#F9D9D4", color: "#A55444" },
    Safety: { bg: "#F9D9D4", color: "#A55444" },
    "Standing Orders": { bg: "#E3E1EB", color: "#514D64" },
  };

  const style = styles[label] ?? { bg: "#F1F1F3", color: "#5C5966" };

  return (
    <span
      className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold ml-1"
      style={{ backgroundColor: style.bg, color: style.color }}
    >
      {label}
    </span>
  );
};
