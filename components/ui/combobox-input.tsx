"use client";

import { useMemo, useState } from "react";
import { Check, ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { selectTriggerVariants } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "./button";

export type ComboboxOption = {
  value: string;
  label: string;
};

export type ComboboxInputProps<T extends ComboboxOption = ComboboxOption> = {
  /** Currently selected value */
  value?: string | null;
  /** Called when the selected value changes (null = cleared) */
  onChange?: (value: string | null) => void;
  /** List of options */
  options?: T[];
  /** Custom render function for each option in the dropdown */
  renderOption?: (option: T, isSelected: boolean) => React.ReactNode;
  /** Custom render function for the trigger label when an option is selected */
  renderValue?: (option: T) => React.ReactNode;
  /** Placeholder shown when nothing is selected */
  placeholder?: string;
  /** Placeholder for the search input */
  searchPlaceholder?: string;
  /** Text shown when no options match the search */
  emptyText?: string;
  /** Loading state – shows a spinner instead of the list */
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
  /** Width of the popover panel (default: 300px) */
  popoverWidth?: number | string;
};

export function ComboboxInput<T extends ComboboxOption = ComboboxOption>({
  value,
  onChange,
  options = [],
  renderOption,
  renderValue,
  placeholder = "Pilih...",
  searchPlaceholder = "Cari...",
  emptyText = "Tidak ada data",
  isLoading = false,
  disabled,
  className,
  popoverWidth = 300,
}: ComboboxInputProps<T>) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const selected = useMemo(() => options.find((o) => o.value === value), [options, value]);

  const filtered = useMemo(() => {
    if (!search.trim()) return options;
    const lower = search.toLowerCase();
    return options.filter((o) => (o.label || "").toLowerCase().includes(lower));
  }, [options, search]);

  const handleSelect = (val: string) => {
    onChange?.(val || null);
    setOpen(false);
    setSearch("");
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.(null);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          role="combobox"
          variant={"outline"}
          aria-expanded={open}
          disabled={disabled}
          className={cn(selectTriggerVariants({ size: "md" }), "font-normal", className)}
        >
          {selected ? (
            <span className="min-w-0 flex-1 truncate text-left">
              {renderValue ? renderValue(selected) : selected.label}
            </span>
          ) : (
            <span className="flex-1 text-left text-muted-foreground">{placeholder}</span>
          )}

          {selected ? (
            <X
              className="ml-2 h-4 w-4 shrink-0 opacity-60 hover:opacity-100"
              onClick={handleClear}
            />
          ) : (
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-60" />
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="p-0" style={{ width: popoverWidth }} align="start">
        <Command shouldFilter={false}>
          <CommandInput placeholder={searchPlaceholder} value={search} onValueChange={setSearch} />
          <CommandList>
            {isLoading ? (
              <div className="flex items-center justify-center p-4">
                <Spinner />
              </div>
            ) : (
              <>
                <CommandEmpty>{emptyText}</CommandEmpty>
                {filtered.length > 0 && (
                  <CommandGroup>
                    {filtered.map((option) => {
                      const isSelected = value === option.value;
                      return (
                        <CommandItem
                          key={option.value}
                          value={option.value}
                          onSelect={() => handleSelect(option.value)}
                          className="flex items-center gap-2"
                        >
                          <span className="min-w-0 flex-1">
                            {renderOption ? renderOption(option, isSelected) : option.label}
                          </span>
                          <Check
                            className={cn(
                              "ml-auto size-4 shrink-0 text-primary",
                              isSelected ? "opacity-100" : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                )}
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
