"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { CountryRow } from "./types";

const countryFormSchema = z.object({
  name: z.string().min(1, "Country name is required"),
  iso2: z
    .string()
    .min(2, "ISO2 code must be 2 characters")
    .max(2, "ISO2 code must be 2 characters"),
  iso3: z
    .string()
    .min(3, "ISO3 code must be 3 characters")
    .max(3, "ISO3 code must be 3 characters"),
  phonecode: z.string().min(1, "Phone code is required"),
  capital: z.string().optional(),
  currency: z.string().optional(),
  currency_symbol: z.string().optional(),
  region: z.string().optional(),
  subregion: z.string().optional(),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
});

interface EditCountryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: z.infer<typeof countryFormSchema>) => Promise<void>;
  isLoading: boolean;
  country: CountryRow | null;
}

export const EditCountryModal: React.FC<EditCountryModalProps> = ({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
  country,
}) => {
  const form = useForm<z.infer<typeof countryFormSchema>>({
    resolver: zodResolver(countryFormSchema),
    defaultValues: {
      name: "",
      iso2: "",
      iso3: "",
      phonecode: "",
      capital: "",
      currency: "",
      currency_symbol: "",
      region: "",
      subregion: "",
    },
  });

  useEffect(() => {
    if (country && open) {
      form.reset({
        name: country.name,
        iso2: country.iso2,
        iso3: country.iso3,
        phonecode: country.phonecode,
        capital: country.capital || "",
        currency: country.currency || "",
        currency_symbol: country.currency_symbol || "",
        region: country.region || "",
        subregion: country.subregion || "",
        latitude: country.latitude,
        longitude: country.longitude,
      });
    }
  }, [country, open, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] bg-white overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Country</DialogTitle>
          <DialogDescription>
            Update the details for {country?.name}.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Pakistan" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="iso2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ISO2 Code *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., PK" maxLength={2} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="iso3"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ISO3 Code *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., PAK" maxLength={3} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phonecode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Code *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., +92" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="capital"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capital</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Islamabad" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Currency</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., PKR" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="currency_symbol"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Currency Symbol</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Rs" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="region"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Region</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Asia" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="subregion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subregion</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Southern Asia" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* {form.formState.errors && (
  <pre>{JSON.stringify(form.formState.errors, null, 2)}</pre>
)} */}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#1E1B4B] hover:bg-[#2A2675]"
                disabled={isLoading}
                onClick={() => console.log("Update Country")}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Country
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
