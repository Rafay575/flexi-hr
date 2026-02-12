import React, { useMemo, useState } from "react";
import {
  X,
  CheckCircle2,
  TrendingUp,
  Calendar,
  AlertTriangle,
  Moon,
  Sun,
  Zap,
  LayoutGrid,
  Plus,
  Trash2,
  Info,
  ArrowRight,
  Settings2,
  History as HistoryIcon,
  ShieldCheck,
} from "lucide-react";
import type { SubmitHandler } from "react-hook-form";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";

// ✅ your axios instance (keep your existing file, import it)
import { api } from "@/components/api/client"; // <-- change path if needed

type ShiftType = "FIXED" | "FLEXI" | "ROTATING" | "SPLIT" | "RAMZAN";
type TabId = "basic" | "timing" | "breaks" | "grace" | "ot" | "days";

// ---------------------------
// Helpers
// ---------------------------
const timeToMinutes = (t: string) => {
  const [hh, mm] = t.split(":").map((x) => parseInt(x, 10));
  if (Number.isNaN(hh) || Number.isNaN(mm)) return 0;
  return hh * 60 + mm;
};

const minutesBetween = (start: string, end: string) => {
  const s = timeToMinutes(start);
  const e = timeToMinutes(end);
  if (e >= s) return e - s;
  return 24 * 60 - s + e;
};

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

const pad2 = (n: number) => String(n).padStart(2, "0");

const fmt12 = (t: string) => {
  const [hh, mm] = t.split(":").map(Number);
  const ampm = hh >= 12 ? "PM" : "AM";
  const h12 = hh % 12 === 0 ? 12 : hh % 12;
  return `${h12}:${pad2(mm)} ${ampm}`;
};

const minutesFromMidnight = (t: string) => {
  const [hh, mm] = t.split(":").map(Number);
  return hh * 60 + mm;
};

const toPct = (mins: number) => `${(mins / 1440) * 100}%`;

// If segment crosses midnight, split into 2 pieces so timeline can render correctly.
const getSegments = (start: string, end: string) => {
  const s = minutesFromMidnight(start);
  const e = minutesFromMidnight(end);

  if (e >= s) return [{ leftMins: s, widthMins: e - s }];

  return [
    { leftMins: s, widthMins: 1440 - s },
    { leftMins: 0, widthMins: e },
  ];
};

const getShiftSegments = (start: string, end: string) => getSegments(start, end);

// ---------------------------
// Zod schema (FORM SHAPE)
// ---------------------------
const breakSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Break name is required"),
  start: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time"),
  end: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time"),
  type: z.enum(["PAID", "UNPAID"]).default("UNPAID"),
  autoDeduct: z.boolean().default(false),
  display_order: z.number().int().min(1).default(1),
});

const formSchema = z
  .object({
    // Basic
    code: z.string().min(1, "Shift code is required"),
    name: z.string().min(1, "Display name is required"),
    description: z.string().optional().default(""),
    shiftType: z.enum(["FIXED", "FLEXI", "ROTATING", "SPLIT", "RAMZAN"]).default("FIXED"),

    // Timing
    startTime: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time"),
    endTime: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time"),

    // Flexi
    flexiRequiredHours: z.number().min(1).max(24).default(8),
    flexiWindowStart: z.string().regex(/^\d{2}:\d{2}$/).default("07:00"),
    flexiWindowEnd: z.string().regex(/^\d{2}:\d{2}$/).default("20:00"),

    // Grace & Buffer
    graceIn: z.number().int().min(0).max(180).default(15),
    graceOut: z.number().int().min(0).max(180).default(15),
    earlyPunchBuffer: z.number().int().min(0).max(600).default(30),
    latePunchBuffer: z.number().int().min(0).max(600).default(15),

    // Overtime
    otAllowed: z.boolean().default(true),
    otThreshold: z.number().int().min(0).max(600).default(30),
    otMaxDailyHours: z.number().min(0).max(24).default(4),
    otMultiplierWeekday: z.number().min(1).max(10).default(1.5),
    otMultiplierWeekend: z.number().min(1).max(10).default(2.0),
    otMultiplierHoliday: z.number().min(1).max(10).default(2.5),

    // Days & Exceptions
    activeWeekdays: z
      .array(z.enum(["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]))
      .min(1, "Select at least one weekday")
      .default(["monday", "tuesday", "wednesday", "thursday", "friday"]),

    fridayOverride: z.boolean().default(true),
    friBreakStart: z.string().regex(/^\d{2}:\d{2}$/).default("12:30"),
    friBreakEnd: z.string().regex(/^\d{2}:\d{2}$/).default("14:30"),

    // Breaks
    breaks: z.array(breakSchema).default([]),
  })
  .superRefine((data, ctx) => {
    const shiftMins = minutesBetween(data.startTime, data.endTime);
    if (shiftMins <= 0) {
      ctx.addIssue({
        code: "custom",
        message: "Shift duration must be greater than 0",
        path: ["endTime"],
      });
    }

    data.breaks.forEach((b, idx) => {
      const bMins = minutesBetween(b.start, b.end);
      if (bMins <= 0) {
        ctx.addIssue({
          code: "custom",
          message: "Break end must be after start",
          path: ["breaks", idx, "end"],
        });
      }
    });

    if (data.shiftType === "FLEXI") {
      const windowMins = minutesBetween(data.flexiWindowStart, data.flexiWindowEnd);
      const reqMins = data.flexiRequiredHours * 60;
      if (windowMins < reqMins) {
        ctx.addIssue({
          code: "custom",
          message: "Flexi window must be >= required hours",
          path: ["flexiWindowEnd"],
        });
      }
    }
  });

type FormValues = z.output<typeof formSchema>;

// ---------------------------
// API payload mapping
// ---------------------------
const toApiPayload = (values: FormValues) => {
  const totalShiftMinutes = minutesBetween(values.startTime, values.endTime);

  const unpaidBreakMinutes = values.breaks
    .filter((b) => b.type === "UNPAID" && b.autoDeduct)
    .reduce((acc, b) => acc + minutesBetween(b.start, b.end), 0);

  const workMinutes = clamp(totalShiftMinutes - unpaidBreakMinutes, 0, 24 * 60);

  return {
    shift_code: values.code,
    display_name: values.name,
    description: values.description || "",
    category: values.shiftType,

    shift_start_time: values.startTime,
    shift_end_time: values.endTime,

    total_duration_minutes: totalShiftMinutes,
    work_hours_minutes: workMinutes,

    grace_in_minutes: values.graceIn,
    grace_out_minutes: values.graceOut,
    early_punch_buffer_minutes: values.earlyPunchBuffer,
    late_punch_buffer_minutes: values.latePunchBuffer,

    overtime_enabled: values.otAllowed,
    ot_min_trigger_minutes: values.otThreshold,
    ot_max_daily_hours: values.otMaxDailyHours,
    ot_multiplier_weekday: values.otMultiplierWeekday,
    ot_multiplier_weekend: values.otMultiplierWeekend,
    ot_multiplier_holiday: values.otMultiplierHoliday,

    active_weekdays: values.activeWeekdays,

    breaks: values.breaks.map((b, idx) => ({
      break_name: b.name,
      break_start_time: b.start,
      break_end_time: b.end,
      auto_deduct: b.autoDeduct,
      is_paid: b.type === "PAID",
      display_order: b.display_order ?? idx + 1,
    })),

    special_breaks: values.fridayOverride
      ? [
          {
            applies_on_day: "friday",
            description: "Extend break duration automatically for Jummah prayers.",
            extended_duration_minutes: Math.max(
              0,
              minutesBetween(values.friBreakStart, values.friBreakEnd) -
                (values.breaks[0] ? minutesBetween(values.breaks[0].start, values.breaks[0].end) : 0)
            ),
            enabled: true,
          },
        ]
      : [],
  };
};

// ---------------------------
// Component
// ---------------------------
export const ShiftTemplateForm = () => {
  const [activeTab, setActiveTab] = useState<TabId>("basic");

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      code: "MORN",
      name: "Morning General",
      description: "Standard morning shift for head office operations.",
      shiftType: "FIXED",

      startTime: "09:00",
      endTime: "18:00",

      flexiRequiredHours: 8,
      flexiWindowStart: "07:00",
      flexiWindowEnd: "20:00",

      graceIn: 15,
      graceOut: 15,
      earlyPunchBuffer: 30,
      latePunchBuffer: 15,

      otAllowed: true,
      otThreshold: 30,
      otMaxDailyHours: 4,
      otMultiplierWeekday: 1.5,
      otMultiplierWeekend: 2.0,
      otMultiplierHoliday: 2.5,

      activeWeekdays: ["monday", "tuesday", "wednesday", "thursday", "friday"],

      fridayOverride: true,
      friBreakStart: "12:30",
      friBreakEnd: "14:30",

      breaks: [
        {
          id: "1",
          name: "Lunch Break",
          start: "13:00",
          end: "14:00",
          type: "UNPAID",
          autoDeduct: true,
          display_order: 1,
        },
      ],
    },
    mode: "onChange",
  });

  const shiftType = watch("shiftType");
  const startTime = watch("startTime");
  const endTime = watch("endTime");
  const breaks = watch("breaks");
  const otThreshold = watch("otThreshold");

  const { fields, append, remove } = useFieldArray({
    control,
    name: "breaks",
  });

  const mutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await api.post("/v1/shifts/templates", payload);
      return res.data;
    },
  });

  const preview = useMemo(() => {
    const total = minutesBetween(startTime, endTime);
    const unpaidAuto = (breaks || [])
      .filter((b) => b.type === "UNPAID" && b.autoDeduct)
      .reduce((acc, b) => acc + minutesBetween(b.start, b.end), 0);

    const work = clamp(total - unpaidAuto, 0, 24 * 60);
    const otTrigger = work + (otThreshold ?? 0);

    const fmt = (m: number) => {
      const h = Math.floor(m / 60);
      const mm = m % 60;
      return `${h}h ${mm.toString().padStart(2, "0")}m`;
    };

    return {
      total,
      work,
      unpaidAuto,
      otTrigger,
      fmt,
    };
  }, [startTime, endTime, breaks, otThreshold]);

  const addBreak = () => {
    append({
      id: Date.now().toString(),
      name: "New Break",
      start: "12:00",
      end: "12:30",
      type: "UNPAID",
      autoDeduct: false,
      display_order: (fields?.length ?? 0) + 1,
    });
  };

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    // ✅ for now just log
    console.log("FORM VALUES:", values);

    // ✅ later: send API
    // const payload = toApiPayload(values);
    // console.log("PAYLOAD:", payload);
    // await mutation.mutateAsync(payload);
  };

  const ErrorText = ({ msg }: { msg?: string }) =>
    msg ? <p className="text-[10px] text-red-500 font-bold mt-1">{msg}</p> : null;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col h-full animate-in fade-in duration-500 overflow-hidden bg-[#F5F5F5]"
    >
      {/* HEADER */}
      <div className="bg-white px-8 py-6 border-b border-gray-200 flex justify-between items-center shadow-sm shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary-gradient rounded-2xl flex items-center justify-center text-white shadow-lg">
            <Settings2 size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Create Shift Template</h2>
              <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[10px] font-black uppercase tracking-widest border border-blue-100">
                v1.0 (Draft)
              </span>
            </div>
            <p className="text-sm text-gray-500 font-medium">Define timing, policies, and exception rules</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={isSubmitting || mutation.isPending}
            className="px-8 py-2.5 bg-[#3E3B6F] text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-[#3E3B6F]/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-60 disabled:hover:scale-100"
          >
            {mutation.isPending ? "Publishing..." : "Publish Policy"}
          </button>

          <button type="button" className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-all">
            <X size={24} />
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* LEFT */}
        <div className="flex-1 flex flex-col overflow-hidden bg-white">
          {/* TAB NAV */}
          <div className="flex border-b border-gray-100 px-8 bg-gray-50/50 shrink-0 overflow-x-auto no-scrollbar">
            {[
              { id: "basic", label: "Basic Info" },
              { id: "timing", label: "Timing" },
              { id: "breaks", label: "Breaks" },
              { id: "grace", label: "Grace & Buffer" },
              { id: "ot", label: "Overtime" },
              { id: "days", label: "Days & Exceptions" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as TabId)}
                className={`px-6 py-4 text-xs font-bold whitespace-nowrap transition-all border-b-2 -mb-px ${
                  activeTab === tab.id
                    ? "border-[#3E3B6F] text-[#3E3B6F]"
                    : "border-transparent text-gray-400 hover:text-gray-600"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB CONTENT */}
          <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
            <div className="max-w-3xl space-y-10 pb-20">
              {activeTab === "basic" && (
                <section className="space-y-6 animate-in slide-in-from-left-4 duration-300">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Shift Code *
                      </label>
                      <input
                        type="text"
                        {...register("code")}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-[#3E3B6F]/5 focus:border-[#3E3B6F] outline-none"
                        placeholder="MORN"
                      />
                      <ErrorText msg={errors.code?.message} />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Display Name *
                      </label>
                      <input
                        type="text"
                        {...register("name")}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-[#3E3B6F]/5 focus:border-[#3E3B6F] outline-none"
                        placeholder="Morning Shift"
                      />
                      <ErrorText msg={errors.name?.message} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Description
                    </label>
                    <textarea
                      {...register("description")}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-4 focus:ring-[#3E3B6F]/5 focus:border-[#3E3B6F] outline-none min-h-[100px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Shift Category
                    </label>

                    <div className="grid grid-cols-5 gap-3">
                      {(["FIXED", "FLEXI", "ROTATING", "SPLIT", "RAMZAN"] as ShiftType[]).map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setValue("shiftType", type, { shouldDirty: true, shouldValidate: true })}
                          className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                            shiftType === type
                              ? "border-[#3E3B6F] bg-[#3E3B6F]/5 shadow-inner"
                              : "border-gray-100 hover:border-gray-200 bg-white"
                          }`}
                        >
                          {type === "FIXED" && (
                            <Sun size={20} className={shiftType === type ? "text-[#3E3B6F]" : "text-gray-400"} />
                          )}
                          {type === "FLEXI" && (
                            <Zap size={20} className={shiftType === type ? "text-[#3E3B6F]" : "text-gray-400"} />
                          )}
                          {type === "ROTATING" && (
                            <LayoutGrid
                              size={20}
                              className={shiftType === type ? "text-[#3E3B6F]" : "text-gray-400"}
                            />
                          )}
                          {type === "SPLIT" && (
                            <Settings2
                              size={20}
                              className={shiftType === type ? "text-[#3E3B6F]" : "text-gray-400"}
                            />
                          )}
                          {type === "RAMZAN" && (
                            <Moon size={20} className={shiftType === type ? "text-[#3E3B6F]" : "text-gray-400"} />
                          )}
                          <span
                            className={`text-[9px] font-black uppercase tracking-widest ${
                              shiftType === type ? "text-[#3E3B6F]" : "text-gray-400"
                            }`}
                          >
                            {type}
                          </span>
                        </button>
                      ))}
                    </div>
                    <ErrorText msg={errors.shiftType?.message} />
                  </div>
                </section>
              )}

              {activeTab === "timing" && (
                <section className="space-y-10 animate-in slide-in-from-left-4 duration-300">
                  {shiftType === "FIXED" && (
                    <div className="space-y-8">
                      <div className="flex items-center gap-4 p-4 bg-blue-50 border border-blue-100 rounded-2xl">
                        <Info className="text-blue-500 shrink-0" size={20} />
                        <p className="text-xs font-medium text-blue-700 leading-relaxed">
                          Fixed shifts require exact punch times. If the shift spans across midnight (e.g., 10 PM - 6
                          AM), the system will automatically allocate the hours to the start date.
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            Shift Start Time
                          </label>
                          <input
                            type="time"
                            {...register("startTime")}
                            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-4 text-xl font-black text-[#3E3B6F] outline-none focus:ring-4 focus:ring-[#3E3B6F]/5"
                          />
                          <ErrorText msg={errors.startTime?.message} />
                        </div>

                        <div className="space-y-3">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            Shift End Time
                          </label>
                          <input
                            type="time"
                            {...register("endTime")}
                            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-4 text-xl font-black text-[#3E3B6F] outline-none focus:ring-4 focus:ring-[#3E3B6F]/5"
                          />
                          <ErrorText msg={errors.endTime?.message} />
                        </div>
                      </div>
                    </div>
                  )}

                  {shiftType === "FLEXI" && (
                    <div className="space-y-8">
                      <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            Earliest Punch-In (Window Start)
                          </label>
                          <input
                            type="time"
                            {...register("flexiWindowStart")}
                            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-4 text-xl font-black text-[#3E3B6F] outline-none"
                          />
                          <ErrorText msg={errors.flexiWindowStart?.message} />
                        </div>

                        <div className="space-y-3">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            Latest Punch-Out (Window End)
                          </label>
                          <input
                            type="time"
                            {...register("flexiWindowEnd")}
                            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-4 text-xl font-black text-[#3E3B6F] outline-none"
                          />
                          <ErrorText msg={errors.flexiWindowEnd?.message} />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                          Net Working Hours Required
                        </label>
                        <div className="flex items-center gap-4">
                          <input
                            type="number"
                            {...register("flexiRequiredHours", { valueAsNumber: true })}
                            className="w-32 bg-white border border-gray-200 rounded-xl px-4 py-4 text-xl font-black text-[#3E3B6F] outline-none"
                          />
                          <span className="text-lg font-bold text-gray-400">Hours per day</span>
                        </div>
                        <ErrorText msg={errors.flexiRequiredHours?.message} />
                      </div>
                    </div>
                  )}
                </section>
              )}

              {activeTab === "breaks" && (
                <section className="space-y-8 animate-in slide-in-from-left-4 duration-300">
                  <div className="flex justify-between items-center">
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Defined Breaks</h4>
                    <button
                      type="button"
                      onClick={addBreak}
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-100 transition-all"
                    >
                      <Plus size={14} /> Add Break
                    </button>
                  </div>

                  <div className="space-y-4">
                    {fields.map((b, idx) => (
                      <div
                        key={b.id}
                        className="bg-gray-50 border border-gray-200 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6 group hover:border-[#3E3B6F]/20 transition-all"
                      >
                        <div className="flex-1 space-y-2 w-full">
                          <input
                            type="text"
                            {...register(`breaks.${idx}.name` as const)}
                            className="bg-transparent text-sm font-black text-gray-800 outline-none border-b border-transparent focus:border-[#3E3B6F] w-full"
                          />
                          <ErrorText msg={errors.breaks?.[idx]?.name?.message} />

                          <div className="flex items-center gap-4">
                            <input
                              type="time"
                              {...register(`breaks.${idx}.start` as const)}
                              className="bg-white px-3 py-2 rounded-lg border border-gray-100 text-xs font-bold"
                            />
                            <ArrowRight size={14} className="text-gray-300" />
                            <input
                              type="time"
                              {...register(`breaks.${idx}.end` as const)}
                              className="bg-white px-3 py-2 rounded-lg border border-gray-100 text-xs font-bold"
                            />
                          </div>
                          <ErrorText msg={errors.breaks?.[idx]?.start?.message} />
                          <ErrorText msg={errors.breaks?.[idx]?.end?.message} />
                        </div>

                        <div className="flex items-center gap-6 shrink-0">
                          <div className="flex flex-col items-center gap-2">
                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                              Auto Deduct
                            </label>

                            <Controller
                              control={control}
                              name={`breaks.${idx}.autoDeduct` as const}
                              render={({ field }) => (
                                <button
                                  type="button"
                                  onClick={() => field.onChange(!field.value)}
                                  className={`w-10 h-5 rounded-full relative p-1 cursor-pointer transition-all ${
                                    field.value ? "bg-[#3E3B6F]" : "bg-gray-200"
                                  }`}
                                  aria-label="Toggle auto deduct"
                                >
                                  <div
                                    className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-all ${
                                      field.value ? "right-1" : "left-1"
                                    }`}
                                  />
                                </button>
                              )}
                            />
                          </div>

                          <button
                            type="button"
                            onClick={() => remove(idx)}
                            className="p-3 bg-white border border-gray-200 text-red-500 rounded-xl hover:bg-red-50 transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-8 border-t border-gray-100 space-y-4">
                    <div className="flex items-center justify-between p-4 bg-[#E8B4A0]/10 rounded-2xl border border-[#E8B4A0]/30">
                      <div className="flex items-center gap-3">
                        <Calendar size={18} className="text-[#3E3B6F]" />
                        <div>
                          <p className="text-xs font-bold text-[#3E3B6F]">Friday Special Break Logic</p>
                          <p className="text-[10px] text-gray-500 font-medium">
                            Extend break duration automatically for Jummah prayers.
                          </p>
                        </div>
                      </div>

                      <Controller
                        control={control}
                        name="fridayOverride"
                        render={({ field }) => (
                          <button
                            type="button"
                            onClick={() => field.onChange(!field.value)}
                            className={`w-12 h-6 rounded-full relative p-1 cursor-pointer transition-all ${
                              field.value ? "bg-[#3E3B6F]" : "bg-gray-200"
                            }`}
                            aria-label="Toggle friday override"
                          >
                            <div
                              className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${
                                field.value ? "right-1" : "left-1"
                              }`}
                            />
                          </button>
                        )}
                      />
                    </div>

                    {watch("fridayOverride") && (
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            Fri Break Start
                          </label>
                          <input
                            type="time"
                            {...register("friBreakStart")}
                            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 font-bold"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            Fri Break End
                          </label>
                          <input
                            type="time"
                            {...register("friBreakEnd")}
                            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 font-bold"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {activeTab === "grace" && (
                <section className="space-y-10 animate-in slide-in-from-left-4 duration-300">
                  <div className="grid grid-cols-2 gap-10">
                    <div className="space-y-6">
                      <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Arrival Policies</h4>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <p className="text-xs font-bold text-gray-700">Grace In (Minutes)</p>
                          <input
                            type="number"
                            {...register("graceIn", { valueAsNumber: true })}
                            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 font-bold"
                          />
                          <ErrorText msg={errors.graceIn?.message} />
                        </div>

                        <div className="space-y-2">
                          <p className="text-xs font-bold text-gray-700">Early Punch Buffer (Minutes)</p>
                          <input
                            type="number"
                            {...register("earlyPunchBuffer", { valueAsNumber: true })}
                            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 font-bold"
                          />
                          <p className="text-[9px] text-gray-400 italic font-medium">
                            Punching within this buffer won't count as OT.
                          </p>
                          <ErrorText msg={errors.earlyPunchBuffer?.message} />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Departure Policies
                      </h4>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <p className="text-xs font-bold text-gray-700">Grace Out (Minutes)</p>
                          <input
                            type="number"
                            {...register("graceOut", { valueAsNumber: true })}
                            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 font-bold"
                          />
                          <ErrorText msg={errors.graceOut?.message} />
                        </div>

                        <div className="space-y-2">
                          <p className="text-xs font-bold text-gray-700">Late Punch Buffer (Minutes)</p>
                          <input
                            type="number"
                            {...register("latePunchBuffer", { valueAsNumber: true })}
                            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 font-bold"
                          />
                          <ErrorText msg={errors.latePunchBuffer?.message} />
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {activeTab === "ot" && (
                <section className="space-y-8 animate-in slide-in-from-left-4 duration-300">
                  <div className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl border border-gray-200">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-green-100 text-green-600 rounded-xl">
                        <TrendingUp size={24} />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-gray-800">Overtime Eligibility</h4>
                        <p className="text-xs text-gray-500 font-medium italic">
                          Allow the system to track and calculate OT for this shift.
                        </p>
                      </div>
                    </div>

                    <Controller
                      control={control}
                      name="otAllowed"
                      render={({ field }) => (
                        <button
                          type="button"
                          onClick={() => field.onChange(!field.value)}
                          className={`w-14 h-7 rounded-full relative p-1 cursor-pointer shadow-inner transition-all ${
                            field.value ? "bg-green-500" : "bg-gray-200"
                          }`}
                          aria-label="Toggle OT"
                        >
                          <div
                            className={`w-5 h-5 bg-white rounded-full absolute top-1 shadow-md transition-all ${
                              field.value ? "right-1" : "left-1"
                            }`}
                          />
                        </button>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-8 pt-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Min. Duration to trigger OT
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="number"
                          {...register("otThreshold", { valueAsNumber: true })}
                          className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-3 font-bold"
                        />
                        <span className="text-xs font-bold text-gray-400 uppercase">Mins</span>
                      </div>
                      <ErrorText msg={errors.otThreshold?.message} />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Max Allowed Daily OT
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="number"
                          {...register("otMaxDailyHours", { valueAsNumber: true })}
                          className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-3 font-bold"
                        />
                        <span className="text-xs font-bold text-gray-400 uppercase">Hours</span>
                      </div>
                      <ErrorText msg={errors.otMaxDailyHours?.message} />
                    </div>
                  </div>

                  <div className="pt-8 border-t border-gray-100">
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">
                      Pay Multipliers
                    </h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="p-4 bg-white border border-gray-200 rounded-2xl text-center">
                        <p className="text-[10px] font-black text-gray-400 uppercase mb-2">Weekday</p>
                        <input
                          type="number"
                          step="0.1"
                          {...register("otMultiplierWeekday", { valueAsNumber: true })}
                          className="w-full text-center text-xl font-black text-[#3E3B6F] bg-transparent outline-none"
                        />
                        <ErrorText msg={errors.otMultiplierWeekday?.message} />
                      </div>
                      <div className="p-4 bg-white border border-gray-200 rounded-2xl text-center">
                        <p className="text-[10px] font-black text-gray-400 uppercase mb-2">Weekend</p>
                        <input
                          type="number"
                          step="0.1"
                          {...register("otMultiplierWeekend", { valueAsNumber: true })}
                          className="w-full text-center text-xl font-black text-[#3E3B6F] bg-transparent outline-none"
                        />
                        <ErrorText msg={errors.otMultiplierWeekend?.message} />
                      </div>
                      <div className="p-4 bg-white border border-gray-200 rounded-2xl text-center">
                        <p className="text-[10px] font-black text-gray-400 uppercase mb-2">Holiday</p>
                        <input
                          type="number"
                          step="0.1"
                          {...register("otMultiplierHoliday", { valueAsNumber: true })}
                          className="w-full text-center text-xl font-black text-[#3E3B6F] bg-transparent outline-none"
                        />
                        <ErrorText msg={errors.otMultiplierHoliday?.message} />
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {activeTab === "days" && (
                <section className="space-y-10 animate-in slide-in-from-left-4 duration-300">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Active Weekdays
                    </label>

                    <Controller
                      control={control}
                      name="activeWeekdays"
                      render={({ field }) => {
                        const selected = new Set(field.value || []);
                        const toggle = (day: FormValues["activeWeekdays"][number]) => {
                          const next = new Set(selected);
                          if (next.has(day)) next.delete(day);
                          else next.add(day);
                          field.onChange(Array.from(next));
                        };

                        const map: Array<{ label: string; value: FormValues["activeWeekdays"][number] }> = [
                          { label: "Mon", value: "monday" },
                          { label: "Tue", value: "tuesday" },
                          { label: "Wed", value: "wednesday" },
                          { label: "Thu", value: "thursday" },
                          { label: "Fri", value: "friday" },
                          { label: "Sat", value: "saturday" },
                          { label: "Sun", value: "sunday" },
                        ];

                        return (
                          <>
                            <div className="flex gap-2">
                              {map.map((d) => {
                                const on = selected.has(d.value);
                                return (
                                  <button
                                    key={d.value}
                                    type="button"
                                    onClick={() => toggle(d.value)}
                                    className={`flex-1 py-3 rounded-xl text-xs font-black transition-all border ${
                                      on
                                        ? "bg-[#3E3B6F] text-white border-transparent shadow-lg"
                                        : "bg-white text-gray-400 border-gray-200 hover:border-[#3E3B6F]/30"
                                    }`}
                                  >
                                    {d.label}
                                  </button>
                                );
                              })}
                            </div>
                            <ErrorText msg={errors.activeWeekdays?.message as any} />
                          </>
                        );
                      }}
                    />
                  </div>

                  <div className="p-6 bg-[#3E3B6F] rounded-3xl text-white relative overflow-hidden group">
                    <div className="relative z-10 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-[#E8D5A3]">
                          <Moon size={24} />
                        </div>
                        <div>
                          <h4 className="text-sm font-black uppercase tracking-widest">Ramzan Period Exceptions</h4>
                          <p className="text-[10px] text-white/60 font-medium">
                            Automatic timing adjustment during effective dates.
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="px-6 py-2 bg-white text-[#3E3B6F] rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl"
                      >
                        Configure Period
                      </button>
                    </div>
                    <BarChart2 size={120} className="absolute -right-6 -bottom-6 text-white/5" />
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT PREVIEW PANEL */}
        <div className="w-[380px] bg-gray-50 border-l border-gray-200 flex flex-col overflow-hidden shadow-2xl z-10 shrink-0">
          <div className="p-8 border-b border-gray-100 bg-white shrink-0">
            <h3 className="text-[10px] font-black text-[#3E3B6F] uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
              <LayoutGrid size={16} /> Visual Timeline Preview
            </h3>

            <div className="relative pt-6 pb-8">
              {/* ✅ FULLY DYNAMIC TIMELINE */}
              <div className="h-6 w-full bg-gray-100 rounded-full relative overflow-hidden">
                {/* Shift segments */}
                {getShiftSegments(startTime, endTime).map((seg, i) => (
                  <div
                    key={`shift-${i}`}
                    className="absolute inset-y-0 bg-[#3E3B6F]/80 rounded-full"
                    style={{
                      left: toPct(seg.leftMins),
                      width: toPct(seg.widthMins),
                    }}
                    title={`Shift: ${fmt12(startTime)} → ${fmt12(endTime)}`}
                  />
                ))}

                {/* Break segments */}
                {(breaks || []).flatMap((b, idx) =>
                  getSegments(b.start, b.end).map((seg, i) => (
                    <div
                      key={`break-${idx}-${i}`}
                      className="absolute inset-y-0 bg-[#E8D5A3] opacity-90 border-x border-white/20"
                      style={{
                        left: toPct(seg.leftMins),
                        width: toPct(seg.widthMins),
                      }}
                      title={`${b.name}: ${fmt12(b.start)} → ${fmt12(b.end)}${b.autoDeduct ? " (Auto)" : ""}`}
                    />
                  ))
                )}
              </div>

              <div className="flex justify-between mt-2 text-[10px] font-bold text-gray-400">
                <span>{fmt12(startTime)}</span>
                <span>{fmt12(endTime)}</span>
              </div>

              <div className="mt-10 grid grid-cols-2 gap-x-8 gap-y-6">
                <div>
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Duration</p>
                  <p className="text-xl font-black text-gray-800 tabular-nums">{preview.fmt(preview.total)}</p>
                </div>
                <div>
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Work Hours</p>
                  <p className="text-xl font-black text-[#3E3B6F] tabular-nums">{preview.fmt(preview.work)}</p>
                </div>
                <div>
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Unpaid Break</p>
                  <p className="text-xl font-black text-gray-800 tabular-nums">{preview.fmt(preview.unpaidAuto)}</p>
                </div>
                <div>
                  <p className="text-[9px] font-black text-orange-500 uppercase tracking-widest mb-1">OT Threshold</p>
                  <p className="text-xl font-black text-orange-600 tabular-nums">{preview.fmt(preview.otTrigger)}</p>
                </div>
              </div>

              {/* Optional: list breaks */}
              <div className="mt-8">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">Breaks</p>
                <div className="space-y-2">
                  {(breaks || []).length === 0 ? (
                    <p className="text-[11px] text-gray-400 font-bold">No breaks added.</p>
                  ) : (
                    (breaks || []).map((b, idx) => (
                      <div
                        key={`${b.name}-${idx}`}
                        className="flex items-center justify-between text-[11px] font-bold text-gray-600 bg-white border border-gray-200 rounded-xl px-3 py-2"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#E8D5A3]" />
                          <span className="text-gray-800">{b.name}</span>
                          <span className="text-gray-400">
                            {fmt12(b.start)} → {fmt12(b.end)}
                          </span>
                        </div>
                        <span className="text-gray-500">
                          {preview.fmt(minutesBetween(b.start, b.end))}{" "}
                          {b.type === "PAID" ? "(Paid)" : b.autoDeduct ? "(Unpaid Auto)" : "(Unpaid)"}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <ShieldCheck size={14} /> Rule Summary
              </h4>
              <div className="space-y-2">
                {[
                  { icon: <CheckCircle2 size={12} />, text: "Auto-Midnight detection: OFF" },
                  { icon: <CheckCircle2 size={12} />, text: "Late-entry penalty: ACTIVE" },
                  { icon: <CheckCircle2 size={12} />, text: "Early-punch rounding: 15m" },
                  {
                    icon: <AlertTriangle size={12} />,
                    text: `Friday break override: ${watch("fridayOverride") ? "ENABLED" : "DISABLED"}`,
                    alert: watch("fridayOverride"),
                  },
                ].map((rule, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-2 text-[11px] font-bold ${
                      rule.alert ? "text-orange-600" : "text-gray-600"
                    }`}
                  >
                    {rule.icon} {rule.text}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
                  <ShieldCheck size={18} />
                </div>
                <p className="text-xs font-black text-gray-800 uppercase tracking-widest">Compliance Audit</p>
              </div>
              <p className="text-[11px] text-gray-500 leading-relaxed font-medium">
                This shift template complies with{" "}
                <span className="text-green-600 font-bold underline decoration-green-200">Local Labor Law Section 42-A</span>{" "}
                regarding mandatory meal breaks and maximum weekly working hours (48h).
              </p>
            </div>

            <div className="p-6 bg-[#3E3B6F]/5 border border-[#3E3B6F]/10 rounded-3xl">
              <div className="flex gap-4">
                <HistoryIcon className="text-[#3E3B6F] shrink-0" size={18} />
                <div>
                  <p className="text-xs font-bold text-[#3E3B6F] mb-1">Version Control</p>
                  <p className="text-[10px] text-gray-600 font-medium">Created by Jane Doe (HR Admin)</p>
                  <p className="text-[10px] text-gray-400 mt-1 italic">Last Modified: Jan 10, 2025</p>
                </div>
              </div>
            </div>

            {/* Debug payload preview (optional) */}
            <details className="text-[10px] text-gray-500">
              <summary className="cursor-pointer font-black uppercase tracking-widest">Debug: Payload Preview</summary>
              <pre className="mt-3 bg-white border border-gray-200 rounded-2xl p-4 overflow-auto">
                {JSON.stringify(toApiPayload(watch()), null, 2)}
              </pre>
            </details>
          </div>
        </div>
      </div>
    </form>
  );
};

const BarChart2: React.FC<{ size: number; className: string }> = ({ size, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);
