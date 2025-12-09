// ui/steps/step2/index.tsx
"use client";

import * as React from "react";
import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
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
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Trash2 } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import {
  digitalPresenceSchema,
  type DigitalPresenceForm,
  PLATFORM_OPTIONS,
  props,
} from "./types";
import { useDigitalPresence } from "./hooks";
import { cn } from "@/lib/utils";


const Step2: React.FC<props> = ({ next, prev }) => {
  const { socials, isLoading, updateDigitalPresence, isPending } =
    useDigitalPresence();

  // RHF v8 generics: <TFieldValues, TContext, TTransformedValues>
  const form = useForm<DigitalPresenceForm, any, DigitalPresenceForm>({
    resolver: zodResolver(digitalPresenceSchema as any),
    defaultValues: {
      support_email: "",
      links: [],
    },
  });

  const { control, handleSubmit, reset, watch } = form;

  const { fields, append, remove } = useFieldArray<DigitalPresenceForm, "links">(
    {
      control,
      name: "links",
    }
  );

  // Prefill from API (socials.links_json -> form.links)
  useEffect(() => {
    if (!socials) return;

    reset({
      support_email: socials.support_email ?? "",
      links: socials.links_json?.length
        ? socials.links_json.map((link) => ({
            platform:
              (link.platform as (typeof PLATFORM_OPTIONS)[number]) ?? "other",
            handle: link.handle ?? "",
            url: link.url ?? "",
          }))
        : [],
    });
  }, [socials, reset]);

  const onSubmit = async (values: DigitalPresenceForm) => {
    // values already in { support_email, links: [...] } shape
    await updateDigitalPresence(values);
    next();
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  const links = watch("links");

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
        noValidate
      >
        {/* Support email */}
        <FormField
          control={control}
          name="support_email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Support email</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  placeholder="support@yourcompany.com"
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Social links section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Social profiles</p>
              <p className="text-xs text-muted-foreground">
                Add your public social handles and URLs.
              </p>
            </div>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() =>
                append({
                  platform: "linkedin",
                  handle: "",
                  url: "",
                })
              }
              disabled={isPending}
            >
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              Add link
            </Button>
          </div>

          {fields.length === 0 && (
            <div className="rounded-md border border-dashed px-3 py-4 text-xs text-muted-foreground">
              No social links added yet. Click{" "}
              <span className="font-medium">“Add link”</span> to start.
            </div>
          )}

          <div className="space-y-3">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className={cn(
                  "grid gap-3 rounded-md border bg-muted/40 p-3",
                  "sm:grid-cols-[1.1fr_1.1fr_2fr_auto]"
                )}
              >
                {/* Platform select */}
                <FormField
                  control={control}
                  name={`links.${index}.platform`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[11px]">
                        Platform
                      </FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={isPending}
                        >
                          <SelectTrigger className="h-9 w-full">
                            <SelectValue placeholder="Select platform" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="linkedin">
                              LinkedIn
                            </SelectItem>
                            <SelectItem value="facebook">
                              Facebook
                            </SelectItem>
                            <SelectItem value="twitter">
                              Twitter
                            </SelectItem>
                            <SelectItem value="instagram">
                              Instagram
                            </SelectItem>
                            <SelectItem value="website">
                              Website
                            </SelectItem>
                            <SelectItem value="other">
                              Other
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Handle */}
                <FormField
                  control={control}
                  name={`links.${index}.handle`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[11px]">
                        Handle
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="@yourbrand"
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* URL */}
                <FormField
                  control={control}
                  name={`links.${index}.url`}
                  render={({ field }) => (
                    <FormItem className="sm:col-span-1">
                      <FormLabel className="text-[11px]">
                        URL
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="https://linkedin.com/company/yourbrand"
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Remove button */}
                <div className="flex items-center justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                    disabled={isPending}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
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
            {isPending
              ? "Saving..."
              : links.length
              ? "Save & continue"
              : "Skip & continue"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default Step2;
