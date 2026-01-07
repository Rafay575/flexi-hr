// src/components/FilterBar.tsx
import React, { useMemo, useState } from "react";
import type { FilterState, SavedView } from "./types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Check, ChevronDown, Filter, Save, Trash2, X } from "lucide-react";

// ✅ Replace these with API-driven options later if you want
const OPTIONS = {
  department: ["Engineering", "HR", "Sales", "Accounts", "Support"],
  location: ["Lahore", "Karachi", "Islamabad", "Remote"],
  grade: ["A", "B", "C", "D"],
  designation: [
    "Senior Product Manager",
    "Software Engineer",
    "QA Engineer",
    "Project Manager",
    "HR Manager",
  ],
  // Your API returns "ACTIVE" etc — keep these like this
  status: ["ACTIVE", "INACTIVE"],
  tags: ["Flight Risk", "Top Performer", "Remote", "New Joiner"],
};

type Props = {
  filters: FilterState;
  onFilterChange: (next: FilterState) => void;

  searchQuery: string;
  onSearchChange: (value: string) => void;

  savedViews: SavedView[];
  onSaveView: (name: string) => void;
  onUpdateView: (view: SavedView) => void;
  onDeleteView: (id: string) => void;
  onApplyView: (view: SavedView) => void;
};

function toggleInArray(arr: string[], value: string) {
  return arr.includes(value) ? arr.filter((x) => x !== value) : [...arr, value];
}

export default function FilterBar({
  filters,
  onFilterChange,
  searchQuery,
  onSearchChange,
  savedViews,
  onSaveView,
  onUpdateView,
  onDeleteView,
  onApplyView,
}: Props) {
  const [open, setOpen] = useState(false);
  const [activeViewId, setActiveViewId] = useState<string>("");

  const activeChips = useMemo(() => {
    const chips: { key: keyof FilterState; value: string }[] = [];
    (Object.keys(filters) as (keyof FilterState)[]).forEach((k) => {
      filters[k].forEach((v) => chips.push({ key: k, value: v }));
    });
    return chips;
  }, [filters]);

  const clearAll = () => {
    onFilterChange({
      department: [],
      location: [],
      grade: [],
      status: [],
      tags: [],
      designation: [],
    });
    onSearchChange("");
    setActiveViewId("");
  };

  const removeChip = (key: keyof FilterState, value: string) => {
    onFilterChange({
      ...filters,
      [key]: filters[key].filter((x) => x !== value),
    });
  };

  const applyViewById = (id: string) => {
    setActiveViewId(id);
    const view = savedViews.find((v) => v.id === id);
    if (view) onApplyView(view);
  };

  const handleSave = () => {
    const name = window.prompt("View name?");
    if (!name?.trim()) return;
    onSaveView(name.trim());
  };

  const handleUpdate = () => {
    const view = savedViews.find((v) => v.id === activeViewId);
    if (!view) return;

    const newName = window.prompt("Rename view (optional):", view.name) ?? view.name;
    onUpdateView({
      ...view,
      name: newName,
      filters: { ...filters },
    });
  };

  const handleDelete = () => {
    const view = savedViews.find((v) => v.id === activeViewId);
    if (!view) return;
    const ok = window.confirm(`Delete view "${view.name}"?`);
    if (!ok) return;
    onDeleteView(view.id);
    setActiveViewId("");
  };

  const Section = ({
    title,
    k,
    options,
  }: {
    title: string;
    k: keyof FilterState;
    options: string[];
  }) => (
    <div className="space-y-2">
      <div className="text-xs font-bold uppercase tracking-wider text-neutral-secondary">
        {title}
      </div>

      <div className="grid grid-cols-2 gap-2">
        {options.map((opt) => {
          const checked = filters[k].includes(opt);
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onFilterChange({ ...filters, [k]: toggleInArray(filters[k], opt) })}
              className={[
                "flex items-center justify-between gap-2 rounded-lg border px-3 py-2 text-xs font-semibold transition",
                checked
                  ? "bg-primary text-white border-primary"
                  : "bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50",
              ].join(" ")}
            >
              <span className="truncate">{opt}</span>
              {checked ? <Check className="w-4 h-4" /> : <span className="w-4 h-4" />}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="space-y-3 bg-white">
      {/* Top row */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-3">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <Input
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by name, code, email, department..."
              className="h-10 pl-3 pr-10 rounded-xl"
            />
            {!!searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-neutral-100"
                title="Clear search"
              >
                <X className="w-4 h-4 text-neutral-500" />
              </button>
            )}
          </div>
        </div>

        {/* Saved views */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              value={activeViewId}
              onChange={(e) => applyViewById(e.target.value)}
              className="h-10 rounded-xl border border-neutral-200 bg-white px-3 pr-10 text-sm font-medium text-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="">Saved Views</option>
              {savedViews.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-neutral-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <Button variant="outline" className="h-10 rounded-xl" onClick={handleSave}>
            <Save className="w-4 h-4" />
            Save
          </Button>

          <Button
            variant="outline"
            className="h-10 rounded-xl"
            onClick={handleUpdate}
            disabled={!activeViewId}
          >
            Update
          </Button>

          <Button
            variant="outline"
            className="h-10 rounded-xl"
            onClick={handleDelete}
            disabled={!activeViewId}
          >
            <Trash2 className="w-4 h-4" />
          </Button>

          {/* Filters popover */}
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button variant="default" className="h-10 rounded-xl">
                <Filter className="w-4 h-4" />
                Filters
                {activeChips.length > 0 && (
                  <span className="ml-2 inline-flex items-center justify-center min-w-6 h-6 px-2 rounded-full bg-white/15 text-xs font-bold">
                    {activeChips.length}
                  </span>
                )}
              </Button>
            </PopoverTrigger>

            <PopoverContent
              align="end"
              className="w-[520px] rounded-2xl border bg-white border-neutral-200 shadow-xl p-4"
            >
              <div className="flex items-center justify-between">
                <div className="text-sm font-bold text-neutral-900">Filters</div>
                <Button variant="ghost" className="h-8 px-2" onClick={clearAll}>
                  Clear all
                </Button>
              </div>

              <Separator className="my-3" />

              <div className="space-y-4 max-h-[420px] overflow-auto pr-1">
                <Section title="Status" k="status" options={OPTIONS.status} />
                <Section title="Department" k="department" options={OPTIONS.department} />
                <Section title="Designation" k="designation" options={OPTIONS.designation} />
                <Section title="Location" k="location" options={OPTIONS.location} />
                <Section title="Grade" k="grade" options={OPTIONS.grade} />
                <Section title="Tags" k="tags" options={OPTIONS.tags} />
              </div>

              <Separator className="my-3" />

              <div className="flex items-center justify-end gap-2">
                <Button variant="outline" className="rounded-xl" onClick={() => setOpen(false)}>
                  Close
                </Button>
                <Button className="rounded-xl" onClick={() => setOpen(false)}>
                  Apply
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Active chips */}
      {activeChips.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {activeChips.map((chip, idx) => (
            <Badge
              key={`${chip.key}-${chip.value}-${idx}`}
              variant="secondary"
              className="rounded-full px-3 py-1 text-xs font-bold flex items-center gap-2"
            >
              <span className="opacity-70">{String(chip.key)}:</span>
              <span>{chip.value}</span>
              <button
                type="button"
                onClick={() => removeChip(chip.key, chip.value)}
                className="ml-1 rounded-full hover:bg-black/10 p-0.5"
                title="Remove"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </Badge>
          ))}
          <Button variant="ghost" className="h-7 px-2 rounded-xl" onClick={clearAll}>
            Clear
          </Button>
        </div>
      )}
    </div>
  );
}
