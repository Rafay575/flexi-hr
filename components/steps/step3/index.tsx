// ui/steps/step3/index.tsx
"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import {
  companyStep3Schema,
  type CompanyStep3Form,
  TIMEZONE_OPTIONS,
  type TimezoneValue,
  props,
} from "./types";
import { useGetCompanyStep3, useUpdateCompanyStep3 } from "./hook";

import {
  useCountryOptions,
  useStateOptions,
  useCityOptions,
  useCurrencyOptions,
} from "../../../hooks/useLocationOptions";

import SearchableSelect, {
  type Option as SearchOption,
} from "@/components/common/SearchableSelect";
import { Flag, MapPin, Building2 } from "lucide-react";

const buildFileSrc = (path: string | null | undefined) => {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  const base = process.env.NEXT_PUBLIC_API_BASE_URL_IMAGE ?? "";
  return base + path;
};

const Step3: React.FC<props> = ({ next, prev }) => {
  const { data, isLoading } = useGetCompanyStep3();
  const { mutateAsync, isPending } = useUpdateCompanyStep3();

  const [letterheadPreview, setLetterheadPreview] = useState<string | null>(
    null
  );

  // ---------------- RHF setup ----------------
  const form = useForm<CompanyStep3Form>({
    resolver: zodResolver(companyStep3Schema),
    defaultValues: {
      registered_email: "",
      main_phone: "",
      timezone: "Asia/Karachi", // default only for brand-new
      country_id: "",
      state_id: "",
      city_id: "",
      address_line_1: "",
      address_line_2: "",
      street: "",
      zip: "",
      established_on: "",
      registration_no: "",
      tax_vat_id: "",
      currency_id: "",
      letterhead: null,
    },
  });

  const { control, handleSubmit, reset, watch, setValue } = form;

  const watchCountryId = watch("country_id");
  const watchStateId = watch("state_id");

  // ------------- Location options (RQ) -------------
  const countryQuery = useCountryOptions();
  const stateQuery = useStateOptions(watchCountryId || undefined);
  const cityQuery = useCityOptions(watchStateId || undefined);
  const currencyQuery = useCurrencyOptions();

  const countryOptions: SearchOption[] = countryQuery.data ?? [];
  const stateOptions: SearchOption[] = stateQuery.data ?? [];
  const cityOptions: SearchOption[] = cityQuery.data ?? [];
  const currencyOptions: SearchOption[] = currencyQuery.data ?? [];

  // ------------- Prefill from API -------------
  useEffect(() => {
    if (!data) return;

    // Backend sends e.g. "Asia/Dubai" or "Asia\/Dubai"
    const apiTzRaw = (data.timezone ?? "")
      .toString()
      .replace(/\\\//g, "/")
      .trim();

    const match = TIMEZONE_OPTIONS.find((tz) => tz.value === apiTzRaw);
    const safeTimezone: TimezoneValue = (match?.value ?? "Asia/Karachi") as TimezoneValue;

    reset({
      registered_email: data.registered_email ?? "",
      main_phone: data.main_phone ?? "",
      timezone: safeTimezone,

      country_id: data.country_id ? String(data.country_id) : "",
      state_id: data.state_id ? String(data.state_id) : "",
      city_id: data.city_id ? String(data.city_id) : "",

      address_line_1: data.address_line_1 ?? "",
      address_line_2: data.address_line_2 ?? "",

      street: data.street ?? "",
      zip: data.zip ?? "",
      established_on: data.established_on
        ? data.established_on.slice(0, 10)
        : "",
      registration_no: data.registration_no ?? "",
      tax_vat_id: data.tax_vat_id ?? "",
      currency_id: data.currency_id ? String(data.currency_id) : "",
      letterhead: null,
    });

    const existing = buildFileSrc(
      (data as any).letterhead_path ?? (data as any).letterhead
    );
    setLetterheadPreview(existing);
  }, [data, reset]);

  const onSubmit = async (values: CompanyStep3Form) => {
    await mutateAsync(values);
    next();
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        {/* Registered contact */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold">Registered contact</h3>
          <p className="text-xs text-muted-foreground">
            Official email and phone used for registration and notices.
          </p>

          <div className="grid gap-3 sm:grid-cols-2">
            <FormField
              control={control}
              name="registered_email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Registered email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="support@hrpsp.net"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="main_phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Main phone</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="+92-300-1234567"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Timezone */}
          <FormField
            control={control}
            name="timezone"
            render={({ field }) => (
              <FormItem className="max-w-sm">
                <FormLabel>Timezone</FormLabel>
                <FormControl>
                  <select
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                    value={field.value as TimezoneValue}
                    onChange={(e) =>
                      field.onChange(e.target.value as TimezoneValue)
                    }
                    disabled={isPending}
                  >
                    {TIMEZONE_OPTIONS.map((tz) => (
                      <option key={tz.value} value={tz.value}>
                        {tz.label}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Location */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold">Registered address</h3>
          <p className="text-xs text-muted-foreground">
            Used on contracts, invoices and compliance documents.
          </p>

          <div className="grid gap-3 sm:grid-cols-3">
            {/* Country */}
            <FormField
              control={control}
              name="country_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <SearchableSelect
                      icon={Flag}
                      options={countryOptions}
                      value={field.value || ""}
                      onChange={(val) => {
                        field.onChange(val);
                        setValue("state_id", "");
                        setValue("city_id", "");
                      }}
                      placeholder="Select country"
                      groupLabel="Countries"
                      allowAll={false}
                      widthClass="w-full"
                      disabled={isPending || countryQuery.isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* State / Province */}
            <FormField
              control={control}
              name="state_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State / Province</FormLabel>
                  <FormControl>
                    <SearchableSelect
                      icon={MapPin}
                      options={stateOptions}
                      value={field.value || ""}
                      onChange={(val) => {
                        field.onChange(val);
                        setValue("city_id", "");
                      }}
                      placeholder="Select state"
                      groupLabel="States"
                      allowAll={false}
                      widthClass="w-full"
                      disabled={
                        isPending || !watchCountryId || stateQuery.isLoading
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* City */}
            <FormField
              control={control}
              name="city_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <SearchableSelect
                      icon={Building2}
                      options={cityOptions}
                      value={field.value || ""}
                      onChange={field.onChange}
                      placeholder="Select city"
                      groupLabel="Cities"
                      allowAll={false}
                      widthClass="w-full"
                      disabled={
                        isPending || !watchStateId || cityQuery.isLoading
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">

          <FormField
            control={control}
            name="address_line_1"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address line 1</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Building, street, block..."
                    disabled={isPending}
                   className="max-h-[96px] min-h-[96px] overflow-y-auto resize-none"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
            />

          <FormField
            control={control}
            name="address_line_2"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address line 2</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Apartment, floor, landmark (optional)"
                    disabled={isPending}
                   className="max-h-[96px] min-h-[96px] overflow-y-auto resize-none"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
            />

            </div>
          {/* Existing street + zip */}
          <FormField
            control={control}
            name="street"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Street</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Main Boulevard"
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="zip"
            render={({ field }) => (
              <FormItem className="max-w-xs">
                <FormLabel>ZIP / Postal code</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="54000" disabled={isPending} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Legal & Finance */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold">Legal & finance</h3>
          <p className="text-xs text-muted-foreground">
            Registration, tax and billing currency information.
          </p>

          <div className="grid gap-3 sm:grid-cols-3">
            <FormField
              control={control}
              name="established_on"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Established on</FormLabel>
                  <FormControl>
                    <Input {...field} type="date" disabled={isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="registration_no"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Registration no.</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="REG-123456"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="tax_vat_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tax / VAT ID</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="PK-12345-789"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Currency + Letterhead */}
          <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <FormField
              control={control}
              name="currency_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Billing currency</FormLabel>
                  <FormControl>
                    <SearchableSelect
                      icon={Flag}
                      options={currencyOptions}
                      value={field.value || ""}
                      onChange={field.onChange}
                      placeholder="Select currency"
                      groupLabel="Currencies"
                      allowAll={false}
                      widthClass="w-full"
                      disabled={isPending || currencyQuery.isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="letterhead"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Letterhead</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      {letterheadPreview ? (
                        <div className="flex items-center gap-3">
                          <div className="relative h-16 w-24 overflow-hidden rounded-md border bg-muted">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={letterheadPreview}
                              alt="Letterhead preview"
                              className="h-full w-full object-contain"
                            />
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setLetterheadPreview(null);
                              field.onChange(null);
                            }}
                            disabled={isPending}
                          >
                            Remove
                          </Button>
                        </div>
                      ) : (
                        <Input
                          type="file"
                          accept="image/*,application/pdf"
                          ref={field.ref}
                          onChange={(e) => {
                            const file = e.target.files?.[0] ?? null;
                            field.onChange(file);
                            if (file) {
                              setLetterheadPreview(URL.createObjectURL(file));
                            } else {
                              setLetterheadPreview(null);
                            }
                          }}
                          disabled={isPending}
                        />
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Footer buttons */}
        <div className="mt-4 flex items-center justify-between">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={prev}
            disabled={isPending}
          >
            Back
          </Button>

          <Button type="submit" size="sm" disabled={isPending}>
            {isPending ? "Saving..." : "Save & continue"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default Step3;
