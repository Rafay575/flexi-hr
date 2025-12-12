// ui/steps/step4/index.tsx
"use client";

import * as React from "react";
import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/Skeleton";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Plus, Trash2, GitBranch, Building2, UserCircle } from "lucide-react";

import SearchableSelect, {
  type Option as SearchOption,
} from "@/components/common/SearchableSelect";

import {
  step4Schema,
  type Step4FormValues,
  type Step4ApiData,
  props,
} from "./types";

import {
  useBusinessLineOptions,
  useEntityTypeOptions,
  useLocationTypeOptions,
} from "./hook"; // ⬅️ adjust path if needed

import {
  useGetCompanyStep4,
  useUpdateCompanyStep4,
} from "./hook";

type OrgBuilderProps = {
  value: Step4FormValues["divisions"];
  onChange: (next: Step4FormValues["divisions"]) => void;
  disabled?: boolean;
};

const OrgStructureBuilder: React.FC<OrgBuilderProps> = ({
  value,
  onChange,
  disabled,
}) => {
  const divisions = value ?? [];

  const addDivision = () => {
    if (disabled) return;
    onChange([
      ...divisions,
      {
        id: null,
        name: "",
        head_employee_id: null,
        departments: [
          {
            id: null,
            name: "",
            head_user_id: null,
            sub_departments: [{ id: null, name: "" }],
          },
        ],
      },
    ]);
  };

  const updateDivision = (idx: number, partial: Partial<(typeof divisions)[number]>) => {
    const next = divisions.map((d, i) =>
      i === idx ? { ...d, ...partial } : d
    );
    onChange(next);
  };

  const removeDivision = (idx: number) => {
    if (disabled) return;
    const next = divisions.filter((_, i) => i !== idx);
    onChange(next);
  };

  const addDepartment = (divIdx: number) => {
    if (disabled) return;
    const next = divisions.map((d, i) => {
      if (i !== divIdx) return d;
      return {
        ...d,
        departments: [
          ...d.departments,
          {
            id: null,
            name: "",
            head_user_id: null,
            sub_departments: [{ id: null, name: "" }],
          },
        ],
      };
    });
    onChange(next);
  };

  const updateDepartment = (
    divIdx: number,
    deptIdx: number,
    partial: Partial<(typeof divisions)[number]["departments"][number]>
  ) => {
    const next = divisions.map((d, i) => {
      if (i !== divIdx) return d;
      return {
        ...d,
        departments: d.departments.map((dept, j) =>
          j === deptIdx ? { ...dept, ...partial } : dept
        ),
      };
    });
    onChange(next);
  };

  const removeDepartment = (divIdx: number, deptIdx: number) => {
    if (disabled) return;
    const next = divisions.map((d, i) => {
      if (i !== divIdx) return d;
      return {
        ...d,
        departments: d.departments.filter((_, j) => j !== deptIdx),
      };
    });
    onChange(next);
  };

  const addSubDepartment = (divIdx: number, deptIdx: number) => {
    if (disabled) return;
    const next = divisions.map((d, i) => {
      if (i !== divIdx) return d;
      return {
        ...d,
        departments: d.departments.map((dept, j) => {
          if (j !== deptIdx) return dept;
          return {
            ...dept,
            sub_departments: [
              ...dept.sub_departments,
              { id: null, name: "" },
            ],
          };
        }),
      };
    });
    onChange(next);
  };

  const updateSubDepartment = (
    divIdx: number,
    deptIdx: number,
    subIdx: number,
    partial: Partial<(typeof divisions)[number]["departments"][number]["sub_departments"][number]>
  ) => {
    const next = divisions.map((d, i) => {
      if (i !== divIdx) return d;
      return {
        ...d,
        departments: d.departments.map((dept, j) => {
          if (j !== deptIdx) return dept;
          return {
            ...dept,
            sub_departments: dept.sub_departments.map((sd, k) =>
              k === subIdx ? { ...sd, ...partial } : sd
            ),
          };
        }),
      };
    });
    onChange(next);
  };

  const removeSubDepartment = (
    divIdx: number,
    deptIdx: number,
    subIdx: number
  ) => {
    if (disabled) return;
    const next = divisions.map((d, i) => {
      if (i !== divIdx) return d;
      return {
        ...d,
        departments: d.departments.map((dept, j) => {
          if (j !== deptIdx) return dept;
          return {
            ...dept,
            sub_departments: dept.sub_departments.filter(
              (_, k) => k !== subIdx
            ),
          };
        }),
      };
    });
    onChange(next);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <GitBranch className="h-4 w-4" />
          Org structure (divisions, departments & sub-departments)
        </h3>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={addDivision}
          disabled={disabled}
        >
          <Plus className="mr-1 h-3 w-3" />
          Add division
        </Button>
      </div>

      {divisions.length === 0 && (
        <p className="text-xs text-muted-foreground">
          No divisions yet. Click <strong>Add division</strong> to get started.
        </p>
      )}

      <div className="space-y-3">
        {divisions.map((div, divIdx) => (
          <Card key={divIdx} className="p-3 space-y-3 border-dashed">
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1 flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <Input
                  value={div.name}
                  onChange={(e) =>
                    updateDivision(divIdx, { name: e.target.value })
                  }
                  placeholder="Division name"
                  disabled={disabled}
                />
              </div>

              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() => removeDivision(divIdx)}
                disabled={disabled}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>

            {/* Departments */}
            <div className="space-y-2 pl-4 border-l border-border/40">
              {div.departments.map((dept, deptIdx) => (
                <div
                  key={deptIdx}
                  className="rounded-md border bg-muted/40 p-2 space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <Input
                      value={dept.name}
                      onChange={(e) =>
                        updateDepartment(divIdx, deptIdx, {
                          name: e.target.value,
                        })
                      }
                      placeholder="Department name"
                      disabled={disabled}
                    />

                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => removeDepartment(divIdx, deptIdx)}
                      disabled={disabled}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>

                  {/* Sub-departments */}
                  <div className="space-y-1 pl-4 border-l border-border/40">
                    {dept.sub_departments.map((sd, subIdx) => (
                      <div
                        key={subIdx}
                        className="flex items-center gap-2 text-xs"
                      >
                        <Input
                          value={sd.name}
                          onChange={(e) =>
                            updateSubDepartment(divIdx, deptIdx, subIdx, {
                              name: e.target.value,
                            })
                          }
                          placeholder="Sub-department name"
                          disabled={disabled}
                        />
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          onClick={() =>
                            removeSubDepartment(divIdx, deptIdx, subIdx)
                          }
                          disabled={disabled}
                        >
                          <Trash2 className="h-3 w-3 text-destructive" />
                        </Button>
                      </div>
                    ))}

                    <Button
                      type="button"
                      variant="ghost"
                   
                      className="mt-1 h-6 px-2 text-[11px]"
                      onClick={() => addSubDepartment(divIdx, deptIdx)}
                      disabled={disabled}
                    >
                      <Plus className="mr-1 h-3 w-3" />
                      Add sub-department
                    </Button>
                  </div>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
               
                className="mt-1 h-7 px-2 text-[11px]"
                onClick={() => addDepartment(divIdx)}
                disabled={disabled}
              >
                <Plus className="mr-1 h-3 w-3" />
                Add department
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

// ----------------------
// Main Step 4 component
// ----------------------
const Step4: React.FC<props> = ({ next, prev }) => {
  const { data, isLoading } = useGetCompanyStep4();
  const { mutateAsync, isPending } = useUpdateCompanyStep4();

  const entityTypeQuery = useEntityTypeOptions();
  const businessLineQuery = useBusinessLineOptions();
  const locationTypeQuery = useLocationTypeOptions();

  const form = useForm<Step4FormValues>({
    resolver: zodResolver(step4Schema),
    defaultValues: {
      entity_type_id: "",
      business_line_id: "",
      location_type_id: "",
      divisions: [],
    },
  });

  const { control, handleSubmit, reset } = form;

  // Prefill from API
  useEffect(() => {
    if (!data) return;

    const api: Step4ApiData = data;

    reset({
    entity_type_id: data.entity_type_id ? String(data.entity_type_id) : "",
    business_line_id: data.business_line_id
      ? String(data.business_line_id)
      : "",
    location_type_id: data.location_type_id
      ? String(data.location_type_id)
      : "",
      divisions: (api.divisions ?? []).map((div) => ({
        id: div.id ?? null,
        name: div.name ?? "",
        head_employee_id: div.head_employee_id ?? null,
        departments: (div.departments ?? []).map((dept) => ({
          id: dept.id ?? null,
          name: dept.name ?? "",
          head_user_id: dept.head_user_id ?? null,
          sub_departments: (dept.sub_departments ?? []).map((sd) => ({
            id: sd.id ?? null,
            name: sd.name ?? "",
          })),
        })),
      })),
    });
  }, [data, reset]);

  const onSubmit = async (values: Step4FormValues) => {
    await mutateAsync(values);
    next();
  };

  const entityTypeOptions: SearchOption[] = entityTypeQuery.data ?? [];
  const businessLineOptions: SearchOption[] = businessLineQuery.data ?? [];
  const locationTypeOptions: SearchOption[] = locationTypeQuery.data ?? [];

  if (isLoading && !data) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Meta row: entity, business line, location type */}
        <div className="grid gap-3 sm:grid-cols-3">
          <FormField
            control={control}
            name="entity_type_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Entity type</FormLabel>
                <FormControl>
                  <SearchableSelect
                    icon={UserCircle}
                    options={entityTypeOptions}
                    value={field.value || ""}
                    onChange={field.onChange}
                    placeholder="Select entity type"
                    groupLabel="Entity types"
                    allowAll={false}
                    widthClass="w-full"
                    disabled={isPending || entityTypeQuery.isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="business_line_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business line</FormLabel>
                <FormControl>
                  <SearchableSelect
                    icon={GitBranch}
                    options={businessLineOptions}
                    value={field.value || ""}
                    onChange={field.onChange}
                    placeholder="Select business line"
                    groupLabel="Business lines"
                    allowAll={false}
                    widthClass="w-full"
                    disabled={isPending || businessLineQuery.isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="location_type_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location type</FormLabel>
                <FormControl>
                  <SearchableSelect
                    icon={Building2}
                    options={locationTypeOptions}
                    value={field.value || ""}
                    onChange={field.onChange}
                    placeholder="Select location type"
                    groupLabel="Location types"
                    allowAll={false}
                    widthClass="w-full"
                    disabled={isPending || locationTypeQuery.isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Org structure builder (divisions/departments/sub-departments) */}
        <FormField
          control={control}
          name="divisions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Organisation structure</FormLabel>
              <FormControl>
                <OrgStructureBuilder
                  value={field.value ?? []}
                  onChange={field.onChange}
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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

export default Step4;
