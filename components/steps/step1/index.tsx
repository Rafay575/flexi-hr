// ui/steps/step1/index.tsx
"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDropzone } from "react-dropzone";
import { UploadCloud, X } from "lucide-react";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";

import {
  companyStep1Schema,
  props,
  type CompanyFormValues,
} from "./types";
import { useCompanyStep1 } from "./hooks";

const Step1: React.FC<props> = ({ next, prev }) => {
  const { companyData, isPrefillLoading, saveCompany, isSaving, refetch } =
    useCompanyStep1();

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const getDefaultFiscalYm = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`; // e.g. "2025-07"
};

 const form = useForm<CompanyFormValues>({
  resolver: zodResolver(companyStep1Schema),
  defaultValues: {
    legal_name: "",
    short_code: "",
    website: "",
    description: "",
    logo_path: null,
    theme_color: "#000000",
    fiscal_year_start_month: getDefaultFiscalYm(),   // ⬅️ here
  },
});


  // Prefill when companyData is available
useEffect(() => {
  refetch();
  if (companyData?.company) {
    const c = companyData.company;

    // convert whatever backend gives (number or string) to YYYY-MM
    const fyValue = (() => {
      const val = c.fiscal_year_start_month;

      if (!val) return getDefaultFiscalYm();

      // already "YYYY-MM"
      if (typeof val === "string" && /^\d{4}-\d{2}$/.test(val)) return val;

      // numeric month (1–12) → use current year
      const n = Number(val);
      if (!Number.isNaN(n) && n >= 1 && n <= 12) {
        const year = new Date().getFullYear();
        return `${year}-${String(n).padStart(2, "0")}`;
      }

      return getDefaultFiscalYm();
    })();

    form.reset({
      legal_name: c.legal_name ?? "",
      short_code: c.short_code ?? "",
      website: c.website ?? "",
      description: c.description ?? "",
      logo_path: c.logo_path ?? null,
      theme_color: c.theme_color ?? "#000000",
      fiscal_year_start_month: fyValue,      
    });

    if (c.logo_path) {
      setPreviewUrl(c.logo_path);
    }
  }
}, [companyData, form, refetch]);


  const buildLogoSrc = (url: string | null) => {
    if (!url) return "";
    // if it's already an absolute URL or a blob preview, just use it
    if (url.startsWith("http") || url.startsWith("blob:")) return url;

    const base = process.env.API_BASE_URL_IMAGE ?? "https://app.myflexihr.com/storage/";
    return `${base}${url}`;
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: false,
    accept: { "image/*": [] },
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (!file) return;

      form.setValue("logo_path", file, { shouldValidate: true });

      const url = URL.createObjectURL(file);
      setPreviewUrl((prev) => {
        if (prev && prev.startsWith("blob:")) {
          URL.revokeObjectURL(prev);
        }
        return url;
      });
    },
  });

  const onSubmit = async (values: CompanyFormValues) => {
    await saveCompany(values); // create or update based on context
    next();
  };

  if (isPrefillLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
        noValidate
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Legal name */}
          <FormField
            control={form.control}
            name="legal_name"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>Legal name *</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="e.g. Flexi Global Inc."
                    disabled={isSaving}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Short code */}
          <FormField
            control={form.control}
            name="short_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Short code</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="e.g. FLEXI-US"
                    disabled={isSaving}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Website */}
          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="https://example.com"
                    disabled={isSaving}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* NEW: Theme color */}
          <FormField
            control={form.control}
            name="theme_color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Theme color</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-2">
                    <Input
                      {...field}
                      type="color"
                      className="h-10 w-16 p-1"
                      disabled={isSaving}
                    />
                    <Input
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value)}
                      placeholder="#000000"
                      disabled={isSaving}
                      className="flex-1"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* NEW: Fiscal year start month */}
         <FormField
  control={form.control}
  name="fiscal_year_start_month"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Fiscal year start</FormLabel>
      <FormControl>
        <Input
          type="month"
          {...field}
          value={field.value ?? ""}
          disabled={isSaving}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>

        </div>

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  rows={3}
                  placeholder="Short description about the company..."
                  disabled={isSaving}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Dropzone + preview */}
        <FormField
          control={form.control}
          name="logo_path"
          render={() => (
            <FormItem>
              <FormLabel>Logo</FormLabel>
              <FormControl>
                {previewUrl ? (
                  <div className="mt-1 flex cursor-pointer flex-col items-center justify-center rounded-md border border-dashed px-4 py-6 text-center text-xs sm:text-sm transition-colors">
                    <div className="relative h-20 w-20 rounded-md border bg-muted">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={buildLogoSrc(previewUrl)}
                        alt="Logo preview"
                        className="h-full w-full object-contain"
                      />

                      {/* close / remove button */}
                      <button
                        type="button"
                        onClick={() => {
                          const current = form.getValues("logo_path");
                          if (
                            current &&
                            current instanceof File &&
                            previewUrl.startsWith("blob:")
                          ) {
                            URL.revokeObjectURL(previewUrl);
                          }

                          setPreviewUrl(null);
                          form.setValue("logo_path", null);
                        }}
                        className="absolute -top-2 -right-2 inline-flex h-5 w-5 items-center justify-center rounded-full border bg-background text-[10px] shadow-sm"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    {...getRootProps()}
                    className={cn(
                      "mt-1 flex cursor-pointer flex-col items-center justify-center rounded-md border border-dashed px-4 py-6 text-center text-xs sm:text-sm transition-colors",
                      isDragActive
                        ? "border-primary bg-primary/5"
                        : "border-border bg-muted/20 hover:border-primary/60"
                    )}
                  >
                    <input {...getInputProps()} />
                    <UploadCloud className="mb-2 h-5 w-5 text-primary" />
                    <p className="font-medium">
                      Drop your logo here, or click to browse
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      PNG or JPG, up to 2 MB
                    </p>
                  </div>
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Actions */}
        <div className="mt-4 flex items-center justify-between">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={prev}
            disabled={isSaving}
          >
            Back
          </Button>
          <Button type="submit" size="sm" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save & continue"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default Step1;
