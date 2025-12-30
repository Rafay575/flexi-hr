// src/features/enrollment/steps/DetailedOverviewStep.tsx
import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/components/api/client";
import type { StepComponentProps, StepHandle } from "../../stepComponents";

const colors = { primary: "#3D3A5C", coral: "#E8A99A" } as const;

type Option = { id: number; name: string; active?: boolean };
type ApiListResponse = { data: Option[] };

const inputClass =
  "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-200 disabled:bg-gray-50";

function Label({
  children,
  required,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="text-[11px] font-semibold mb-1 block" style={{ color: colors.primary }}>
      {children}{" "}
      {required && (
        <span className="inline-block w-1 h-1 rounded-full align-middle" style={{ background: colors.coral }} />
      )}
    </label>
  );
}

async function fetchOptions(url: string) {
  const res = await api.get<ApiListResponse>(url, {
    headers: { Accept: "application/json", "X-Company-Id": "1" },
  });
  const list = Array.isArray(res.data?.data) ? res.data.data : [];
  return list.filter((x) => (typeof x.active === "boolean" ? x.active : true));
}

// ✅ Schema matches your Postman payload (and keeps TS happy)
const schema = z.object({
  employee_code: z.string().min(1, "Employee code is required"),

  first_name: z.string().min(1, "First name is required"),
  middle_name: z.string().optional().or(z.literal("")),
  last_name: z.string().min(1, "Last name is required"),
  father_or_husband_name: z.string().min(1, "Father/Husband name is required"),

  gender_id: z.coerce.number().int().positive("Gender is required"),
  cnic_number: z.string().min(5, "CNIC is required"),
  cnic_issue_date: z.string().min(1, "CNIC issue date is required"),
  cnic_expiry_date: z.string().min(1, "CNIC expiry date is required"),

  date_of_birth: z.string().min(1, "DOB is required"),
  date_of_joining: z.string().min(1, "DOJ is required"),

  company_id: z.coerce.number().int().positive("Company is required"),
  department_id: z.coerce.number().int().positive("Department is required"),
  designation_id: z.coerce.number().int().positive("Designation is required"),

  employment_class: z.string().min(1, "Employment class is required"),
  role_id: z.coerce.number().int().positive("Role is required"),
});

type Values = z.infer<typeof schema>;

// ✅ Fixes the Resolver<unknown> TS error forever
const resolver = zodResolver(schema) as unknown as Resolver<Values>;

const DetailedOverviewStep = forwardRef<StepHandle, StepComponentProps>(function DetailedOverviewStep(
  { enrollmentId, disabled },
  ref
) {
  const [saving, setSaving] = useState(false);
  const [loadingMeta, setLoadingMeta] = useState(false);

  const [genders, setGenders] = useState<Option[]>([]);
  const [companies, setCompanies] = useState<Option[]>([]);
  const [departments, setDepartments] = useState<Option[]>([]);
  const [designations, setDesignations] = useState<Option[]>([]);
  const [roles, setRoles] = useState<Option[]>([]);

  const form = useForm<Values>({
    resolver,
    mode: "onTouched",
    defaultValues: {
      employee_code: "Auto-generated",
      first_name: "",
      middle_name: "",
      last_name: "",
      father_or_husband_name: "",

      gender_id: 0,
      cnic_number: "",
      cnic_issue_date: "",
      cnic_expiry_date: "",

      date_of_birth: "",
      date_of_joining: "",

      company_id: 0,
      department_id: 0,
      designation_id: 0,

      employment_class: "Permanent",
      role_id: 0,
    },
  });

  const e = form.formState.errors;
  const isBusy = !!disabled || saving || loadingMeta;

  // ✅ Load dropdown options
  useEffect(() => {
    let mounted = true;

    const run = async () => {
      try {
        setLoadingMeta(true);

        // 🔁 Replace endpoints if your real ones differ
        const [gen, com, dep, des, rol] = await Promise.all([
          fetchOptions("/meta/employee/gender?per_page=all"),
          fetchOptions("/meta/employee/company?per_page=all"),
          fetchOptions("/meta/employee/departments?per_page=all"),
          fetchOptions("/meta/employee/designations?per_page=all"),
          fetchOptions("/meta/employee/roles?per_page=all"),
        ]);

        if (!mounted) return;

        setGenders(gen);
        setCompanies(com);
        setDepartments(dep);
        setDesignations(des);
        setRoles(rol);

        // auto select firsts (optional)
        if (gen[0] && !form.getValues("gender_id")) form.setValue("gender_id", gen[0].id);
        if (com[0] && !form.getValues("company_id")) form.setValue("company_id", com[0].id);
        if (dep[0] && !form.getValues("department_id")) form.setValue("department_id", dep[0].id);
        if (des[0] && !form.getValues("designation_id")) form.setValue("designation_id", des[0].id);
        if (rol[0] && !form.getValues("role_id")) form.setValue("role_id", rol[0].id);
      } catch (err: any) {
        alert(err?.response?.data?.message || err?.message || "Failed to load Overview dropdowns");
      } finally {
        if (mounted) setLoadingMeta(false);
      }
    };

    run();
    return () => {
      mounted = false;
    };
  }, [form]);

  const submit = async () => {
    const ok = await form.trigger();
    if (!ok) return false;

    if (!enrollmentId) {
      alert("Enrollment draft not ready yet.");
      return false;
    }

    try {
      setSaving(true);
      const v = form.getValues();

      // ✅ payload EXACTLY like your Postman sample
      const payload = {
        employee_code: String(v.employee_code),

        first_name: String(v.first_name),
        middle_name: String(v.middle_name || ""),
        last_name: String(v.last_name),
        father_or_husband_name: String(v.father_or_husband_name),

        gender_id: String(Number(v.gender_id)), // sample shows "1"
        cnic_number: String(v.cnic_number),
        cnic_issue_date: v.cnic_issue_date,
        cnic_expiry_date: v.cnic_expiry_date,

        date_of_birth: v.date_of_birth,
        date_of_joining: v.date_of_joining,

        company_id: String(Number(v.company_id)),
        department_id: String(Number(v.department_id)),
        designation_id: String(Number(v.designation_id)),

        employment_class: v.employment_class,
        role_id: String(Number(v.role_id)), // sample shows "2"
      };

      await api.patch(`/v1/enrollments/${enrollmentId}/sections/overview`, payload, {
        headers: { Accept: "application/json", "X-Company-Id": "1" },
      });

      return true;
    } catch (err: any) {
      alert(err?.response?.data?.message || err?.message || "Failed to save Overview");
      return false;
    } finally {
      setSaving(false);
    }
  };

  useImperativeHandle(ref, () => ({ submit }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      <div>
        <Label required>Employee Code</Label>
        <input className={inputClass} disabled={isBusy} {...form.register("employee_code")} />
        {e.employee_code && <p className="mt-1 text-[11px] text-red-600">{e.employee_code.message}</p>}
      </div>

      <div>
        <Label required>First Name</Label>
        <input className={inputClass} disabled={isBusy} {...form.register("first_name")} />
        {e.first_name && <p className="mt-1 text-[11px] text-red-600">{e.first_name.message}</p>}
      </div>

      <div>
        <Label>Middle Name</Label>
        <input className={inputClass} disabled={isBusy} {...form.register("middle_name")} />
        {e.middle_name && <p className="mt-1 text-[11px] text-red-600">{e.middle_name.message}</p>}
      </div>

      <div>
        <Label required>Last Name</Label>
        <input className={inputClass} disabled={isBusy} {...form.register("last_name")} />
        {e.last_name && <p className="mt-1 text-[11px] text-red-600">{e.last_name.message}</p>}
      </div>

      <div className="md:col-span-2">
        <Label required>Father / Husband Name</Label>
        <input className={inputClass} disabled={isBusy} {...form.register("father_or_husband_name")} />
        {e.father_or_husband_name && (
          <p className="mt-1 text-[11px] text-red-600">{e.father_or_husband_name.message}</p>
        )}
      </div>

      <div>
        <Label required>Gender</Label>
        <select className={inputClass} disabled={isBusy} {...form.register("gender_id")}>
          {genders.length === 0 ? <option value="">No genders</option> : null}
          {genders.map((x) => (
            <option key={x.id} value={x.id}>
              {x.name}
            </option>
          ))}
        </select>
        {e.gender_id && <p className="mt-1 text-[11px] text-red-600">{e.gender_id.message}</p>}
      </div>

      <div>
        <Label required>CNIC Number</Label>
        <input className={inputClass} disabled={isBusy} {...form.register("cnic_number")} placeholder="35202-XXXXXXX-X" />
        {e.cnic_number && <p className="mt-1 text-[11px] text-red-600">{e.cnic_number.message}</p>}
      </div>

      <div>
        <Label required>CNIC Issue Date</Label>
        <input className={inputClass} type="date" disabled={isBusy} {...form.register("cnic_issue_date")} />
        {e.cnic_issue_date && <p className="mt-1 text-[11px] text-red-600">{e.cnic_issue_date.message}</p>}
      </div>

      <div>
        <Label required>CNIC Expiry Date</Label>
        <input className={inputClass} type="date" disabled={isBusy} {...form.register("cnic_expiry_date")} />
        {e.cnic_expiry_date && <p className="mt-1 text-[11px] text-red-600">{e.cnic_expiry_date.message}</p>}
      </div>

      <div>
        <Label required>Date of Birth</Label>
        <input className={inputClass} type="date" disabled={isBusy} {...form.register("date_of_birth")} />
        {e.date_of_birth && <p className="mt-1 text-[11px] text-red-600">{e.date_of_birth.message}</p>}
      </div>

      <div>
        <Label required>Date of Joining</Label>
        <input className={inputClass} type="date" disabled={isBusy} {...form.register("date_of_joining")} />
        {e.date_of_joining && <p className="mt-1 text-[11px] text-red-600">{e.date_of_joining.message}</p>}
      </div>

      <div>
        <Label required>Company</Label>
        <select className={inputClass} disabled={isBusy} {...form.register("company_id")}>
          {companies.length === 0 ? <option value="">No companies</option> : null}
          {companies.map((x) => (
            <option key={x.id} value={x.id}>
              {x.name}
            </option>
          ))}
        </select>
        {e.company_id && <p className="mt-1 text-[11px] text-red-600">{e.company_id.message}</p>}
      </div>

      <div>
        <Label required>Department</Label>
        <select className={inputClass} disabled={isBusy} {...form.register("department_id")}>
          {departments.length === 0 ? <option value="">No departments</option> : null}
          {departments.map((x) => (
            <option key={x.id} value={x.id}>
              {x.name}
            </option>
          ))}
        </select>
        {e.department_id && <p className="mt-1 text-[11px] text-red-600">{e.department_id.message}</p>}
      </div>

      <div>
        <Label required>Designation</Label>
        <select className={inputClass} disabled={isBusy} {...form.register("designation_id")}>
          {designations.length === 0 ? <option value="">No designations</option> : null}
          {designations.map((x) => (
            <option key={x.id} value={x.id}>
              {x.name}
            </option>
          ))}
        </select>
        {e.designation_id && <p className="mt-1 text-[11px] text-red-600">{e.designation_id.message}</p>}
      </div>

      <div>
        <Label required>Employment Class</Label>
        <select className={inputClass} disabled={isBusy} {...form.register("employment_class")}>
          {["Permanent", "Probation", "Contract", "Daily Wage"].map((x) => (
            <option key={x} value={x}>
              {x}
            </option>
          ))}
        </select>
        {e.employment_class && <p className="mt-1 text-[11px] text-red-600">{e.employment_class.message}</p>}
      </div>

      <div>
        <Label required>Role</Label>
        <select className={inputClass} disabled={isBusy} {...form.register("role_id")}>
          {roles.length === 0 ? <option value="">No roles</option> : null}
          {roles.map((x) => (
            <option key={x.id} value={x.id}>
              {x.name}
            </option>
          ))}
        </select>
        {e.role_id && <p className="mt-1 text-[11px] text-red-600">{e.role_id.message}</p>}
      </div>

      {(saving || loadingMeta) && (
        <div className="lg:col-span-3 text-[11px] text-gray-500">
          {loadingMeta ? "Loading dropdowns..." : "Saving..."}
        </div>
      )}
    </div>
  );
});

export default DetailedOverviewStep;
