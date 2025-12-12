"use client";

import * as React from "react";
import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  Building2,
  Globe2,
  FileText,
  Network,
  SlidersHorizontal,
  Users,
  type LucideIcon,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/Skeleton";

import Step1 from "@/components/steps/step1";

import Step2 from "@/components/steps/step2";
import Step3 from "@/components/steps/step3";
import Step4 from "@/components/steps/step4";
import Step5 from "@/components/steps/step5";


import { CompanyProvider } from "@/context/CompanyContext";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Types & config                                                     */
/* ------------------------------------------------------------------ */

interface WizardStep {
  key: string;
  title: string; // "1", "2", ...
  label: string;
  description?: string;
  icon: LucideIcon;
  render: (
    goNext: () => void,
    goPrev: () => void,
    isLast: boolean
  ) => React.ReactNode;
}

const wizardSteps: WizardStep[] = [
  {
    key: "company-basics",
    title: "1",
    label: "Company Basics",
    description: "Tell us who you are and where you operate.",
    icon: Building2,
    render: (goNext, goPrev, isLast) => (
      <Step1 next={goNext} prev={goPrev} isLast={isLast} />
    ),
  },
  {
    key: "digital-presence",
    title: "2",
    label: "Digital Presence",
    description: "Add website, socials and public-facing links.",
    icon: Globe2,
    render: (goNext, goPrev, isLast) => (
      <Step2 next={goNext} prev={goPrev} isLast={isLast} />
    ),
  },
  {
    key: "contact-legal",
    title: "3",
    label: "Contact & Legal",
    description: "Contacts, billing and compliance information.",
    icon: FileText,
    render: (goNext, goPrev, isLast) => (
      <Step3 next={goNext} prev={goPrev} isLast={isLast} />
    ),
  },
  {
    key: "org-structure",
    title: "4",
    label: "Org Structure",
    description: "Divisions, departments and reporting lines.",
    icon: Network,
    render: (goNext, goPrev, isLast) => (
      <Step4 next={goNext} prev={goPrev} isLast={isLast} />
    ),
  },
  {
  key: "preview",
  title: "5",
  label: "Preview",
  description: "Review and confirm all company details before saving.",
  icon: Network,
  render: (goNext, goPrev, isLast) => (
    <Step5 next={goNext} prev={goPrev} isLast={isLast} />
  ),
}

 
];

/* ------------------------------------------------------------------ */
/* Stepper (segments + circles)                                       */
/* ------------------------------------------------------------------ */

interface SimpleStepperProps {
  steps: WizardStep[];
  currentIndex: number;
  onChange: (idx: number) => void;
}
const SimpleStepper: React.FC<SimpleStepperProps> = ({
  steps,
  currentIndex,
  onChange,
}) => {
  // progress from 0 → 1 between first & last step
  const progress =
    steps.length > 1 ? currentIndex / (steps.length - 1) : 0;

  return (
    <div className="py-4">
      <div className="relative mx-auto flex w-full max-w-4xl flex-col gap-6">
        {/* base grey line:
            starts at right edge of first circle (40px)
            ends at left edge of last circle (40px from right) */}
        <div className="pointer-events-none absolute left-20 right-20 top-5 h-[2px] rounded-full bg-muted-foreground/20" />

        {/* active / primary progress line */}
        <motion.div
          className="pointer-events-none absolute left-20 right-20 top-5 h-[2px] rounded-full bg-primary origin-left"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: progress }}
          transition={{ duration: 0.25 }}
        />

        {/* circles + labels */}
        <div className="relative flex w-full justify-between">
          {steps.map((step, i) => {
            const active = i === currentIndex;
            const completed = i < currentIndex;

            return (
              <button
                key={step.key}
                type="button"
                onClick={() => onChange(i)}
                className="flex flex-col items-center gap-2 text-center"
              >
                {/* circle sitting on the line */}
                <motion.div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border text-xs font-semibold",
                    completed
                      ? "bg-primary text-primary-foreground border-primary"
                      : active
                      ? "bg-white text-gray-700 border-primary"
                      : "bg-white text-gray-700 border-muted-foreground/40"
                  )}
                  initial={{ scale: 0.95, opacity: 0.9 }}
                  animate={{
                    scale: active ? 1.05 : 1,
                    opacity: 1,
                  }}
                  transition={{ type: "spring", stiffness: 260, damping: 18 }}
                >
                  {/* swap this span with an icon if you like */}
                  <span>{step.title}</span>
                </motion.div>

                {/* label + description */}
                <span
                  className={cn(
                    "text-[13px] font-semibold",
                    active
                      ? "text-foreground"
                      : completed
                      ? "text-muted-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {step.label}
                </span>
                {step.description && (
                  <span className="max-w-[180px] text-[11px] leading-snug text-muted-foreground">
                    {step.description}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};




/* ------------------------------------------------------------------ */
/* Skeleton UI                                                        */
/* ------------------------------------------------------------------ */

const CompanyStepperSkeleton: React.FC = () => {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-6">
      {/* header skeleton */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-3 w-64" />
        </div>
        <Skeleton className="h-6 w-28" />
      </div>

      {/* stepper skeleton (same box as real one) */}
      <Card className="rounded-2xl border border-primary/15 bg-background shadow-sm">
        <CardContent className="pt-6 pb-7">
          <div className="relative w-full pt-2">
            <Skeleton className="absolute left-6 right-6 top-5 h-[2px] -translate-y-1/2 rounded-full" />
            <div className="relative flex items-start justify-between px-6 pt-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="flex max-w-[190px] flex-col items-center gap-2 text-center"
                >
                  <Skeleton className="h-9 w-9 rounded-full" />
                  <div className="flex flex-col items-center gap-1">
                    <Skeleton className="h-3 w-20 rounded" />
                    <Skeleton className="h-3 w-24 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* content card skeleton */}
      <Card className="rounded-2xl border border-border/60 bg-background shadow-sm">
        <CardHeader className="space-y-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-3 w-64" />
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[90%]" />
          <Skeleton className="h-4 w-[80%]" />
          <div className="grid gap-3 sm:grid-cols-2 mt-2">
            <Skeleton className="h-10 w-full rounded-md" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
          <div className="grid gap-3 sm:grid-cols-3 mt-2">
            <Skeleton className="h-8 w-full rounded-md" />
            <Skeleton className="h-8 w-full rounded-md" />
            <Skeleton className="h-8 w-full rounded-md" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Main component                                                     */
/* ------------------------------------------------------------------ */

interface CompanyStepperProps {
  isLoading?: boolean; // pass your react-query/loading state here
}

function CompanyStepperInner({ isLoading = false }: CompanyStepperProps) {
  const [idx, setIdx] = useState(0);

  const goNext = () =>
    setIdx((i) => Math.min(i + 1, wizardSteps.length - 1));
  const goPrev = () => setIdx((i) => Math.max(i - 1, 0));

  const isLast = idx === wizardSteps.length - 1;
  const current = wizardSteps[idx];

  const progress = useMemo(
    () => Math.round(((idx + 1) / wizardSteps.length) * 100),
    [idx]
  );

  // keyboard navigation


  if (isLoading) {
    return <CompanyStepperSkeleton />;
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-6">
      {/* header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            Company Setup Wizard
          </h1>
          <p className="text-xs text-muted-foreground sm:text-sm">
            Fill these steps to get your company ready. You can always come back
            and edit.
          </p>
        </div>
        
      </div>

      {/* stepper (boxed) */}
      <SimpleStepper
        steps={wizardSteps}
        currentIndex={idx}
        onChange={setIdx}
      />

      {/* content */}
      <Card className="rounded-2xl border border-border/60 bg-background shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg flex items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs text-primary font-semibold">
              {idx + 1}
            </span>
            {current.label}
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            {current.description}
          </p>
        </CardHeader>
        <CardContent className="pt-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.key}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className=""
            >
              {current.render(goNext, goPrev, isLast)}
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}

/* Wrap with CompanyProvider as you had before */

export default function CompanyStepper(props: CompanyStepperProps) {
  return (
    <CompanyProvider>
      <CompanyStepperInner {...props} />
    </CompanyProvider>
  );
}
