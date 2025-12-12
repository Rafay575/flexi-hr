'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import {
  Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem,
} from '@/components/ui/command';
import { Check, ChevronsUpDown, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

export type Option = { value: string; label: string };

type Props = {
  options: Option[];
  value: string;                     // '' means “All” (cleared)
  onChange: (v: string) => void;     // gets '' for All
  placeholder?: string;              // button text when nothing selected
  searchPlaceholder?: string;        // input placeholder
  emptyText?: string;                // shown when no matches
  groupLabel?: string;               // heading above options
  allowAll?: boolean;                // show “All …” row
  allLabel?: string;                 // text for “All …”
  allValue?: string;                 // sentinel used inside menu (non-empty)
  icon?: React.ComponentType<{ className?: string }>; // prefix icon in button
  className?: string;
  widthClass?: string;
     disabled?: boolean;               // width utility for button/popover
};

const DEFAULT_ALL_VALUE = '__ALL__';

const SearchableSelect: React.FC<Props> = ({
  options,
  value,
  onChange,
  placeholder = 'Select…',
  searchPlaceholder = 'Search…',
  emptyText = 'No results.',
  groupLabel = 'Options',
  allowAll = true,
  allLabel = 'All',
  allValue = DEFAULT_ALL_VALUE,
  icon: Icon = Globe,
  className,
  widthClass = 'w-56',
  disabled = false,
}) => {
  const [open, setOpen] = React.useState(false);

  const displayLabel =
    value === ''
      ? (allowAll ? allLabel : placeholder)
      : options.find(o => o.value === value)?.label ?? placeholder;

  const handleSelect = (val: string) => {
    if (allowAll && val === allValue) onChange('');
    else onChange(val);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled} 
          className={cn(widthClass, 'justify-between', className)}
        >
          <span className="inline-flex items-center gap-2">
            <Icon className="size-4 opacity-70" />
            {displayLabel}
          </span>
          <ChevronsUpDown className="ml-2 size-4 opacity-70" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className={cn(widthClass, 'p-0')} align="start">
        <Command shouldFilter>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>

            {allowAll && (
              <CommandGroup heading="Quick">
                <CommandItem
                  value={allValue}
                  onSelect={handleSelect}
                  className="cursor-pointer"
                >
                  <Check
                    className={cn(
                      'mr-2 size-4',
                      value === '' ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {allLabel}
                </CommandItem>
              </CommandGroup>
            )}

            <CommandGroup heading={groupLabel}>
              {options.map(opt => (
                <CommandItem
                  key={opt.value}
                  value={opt.label} // searchable by label text
                  onSelect={() => handleSelect(opt.value)}
                  className="cursor-pointer"
                >
                  <Check
                    className={cn(
                      'mr-2 size-4',
                      value === opt.value ? 'opacity-100' : 'opacity-0'
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
