"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { Check, ChevronsUpDown, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

export type Option = {
  value: string;
  label: string;
};

// ────────────────────────────────────────────
// Props: support single OR multi via `multiple`
// ────────────────────────────────────────────

type CommonProps = {
  options: Option[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  groupLabel?: string;
  allowAll?: boolean;
  allLabel?: string;
  allValue?: string;
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
  widthClass?: string;
  disabled?: boolean;
};

type SingleProps = CommonProps & {
  multiple?: false;
  value: string; // '' = nothing selected
  onChange: (v: string) => void;
};

type MultiProps = CommonProps & {
  multiple: true;
  value: string[]; // [] = nothing selected
  onChange: (v: string[]) => void;
};

export type SearchableSelectProps = SingleProps | MultiProps;

const DEFAULT_ALL_VALUE = "__ALL__";

const SearchableSelect: React.FC<SearchableSelectProps> = (props) => {
  const {
    options,
    placeholder = "Select…",
    searchPlaceholder = "Search…",
    emptyText = "No results.",
    groupLabel = "Options",
    allowAll = true,
    allLabel = "All",
    allValue = DEFAULT_ALL_VALUE,
    icon: Icon = Globe,
    className,
    widthClass = "w-56",
    disabled = false,
  } = props;

  const [open, setOpen] = React.useState(false);

  // ─────────────────────────────
  // Display label (button text)
  // ─────────────────────────────
  const displayLabel = React.useMemo(() => {
    if ("multiple" in props && props.multiple) {
      if (!props.value || props.value.length === 0) {
        return placeholder;
      }
      if (props.value.length === 1) {
        const only = options.find((o) => o.value === props.value[0]);
        return only?.label ?? placeholder;
      }
      return `${props.value.length} selected`;
    } else {
      // single
      const val = props.value;
      if (!val) {
        return allowAll ? allLabel : placeholder;
      }
      const found = options.find((o) => o.value === val);
      return found?.label ?? placeholder;
    }
  }, [props, options, placeholder, allowAll, allLabel]);

  // ─────────────────────────────
  // Handle selection
  // ─────────────────────────────
  const handleSelectSingle = (val: string) => {
    const { onChange } = props as SingleProps;
    if (allowAll && val === allValue) {
      onChange("");
    } else {
      onChange(val);
    }
    setOpen(false);
  };

  const handleSelectMulti = (val: string) => {
    const { value: current, onChange } = props as MultiProps;

    if (allowAll && val === allValue) {
      onChange([]); // clear all
      return;
    }

    const set = new Set(current);
    if (set.has(val)) set.delete(val);
    else set.add(val);

    onChange(Array.from(set));
    // keep popover open for multi-select
  };

  const isSelected = (value: string): boolean => {
    if ("multiple" in props && props.multiple) {
      return props.value.includes(value);
    } else {
      return props.value === value;
    }
  };

  const handleItemSelect = (val: string) => {
    if ("multiple" in props && props.multiple) {
      handleSelectMulti(val);
    } else {
      handleSelectSingle(val);
    }
  };

  // ─────────────────────────────
  // Render
  // ─────────────────────────────
  return (
    <Popover open={open} onOpenChange={setOpen} >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(widthClass, "justify-between", className)}
        >
          <span className="inline-flex items-center gap-2">
            <Icon className="size-4 opacity-70" />
            {displayLabel}
          </span>
          <ChevronsUpDown className="ml-2 size-4 opacity-70" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className={cn(widthClass, "p-0 bg-white")} align="start" style={{ zIndex: 200000 }}>
        <Command shouldFilter>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>

            {allowAll && (
              <CommandGroup heading="Quick">
                <CommandItem
                  value={allValue}
                  onSelect={handleItemSelect}
                  className="cursor-pointer"
                >
                  <Check
                    className={cn(
                      "mr-2 size-4",
                      ("multiple" in props && props.multiple
                        ? (props.value as string[]).length === 0
                        : !props.value)
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {allLabel}
                </CommandItem>
              </CommandGroup>
            )}

            <CommandGroup heading={groupLabel}>
              {options.map((opt) => (
                <CommandItem
                  key={opt.value}
                  value={opt.label} // search by label
                  onSelect={() => handleItemSelect(opt.value)}
                  className="cursor-pointer"
                >
                  <Check
                    className={cn(
                      "mr-2 size-4",
                      isSelected(opt.value) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {opt.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default SearchableSelect;
