"use client";

import * as React from "react";
import { isSameDay, subDays, subMonths, subYears } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { Calendar as CalendarIcon, Check, X } from "lucide-react";
import { DateRange } from "react-day-picker";
import { formatDateShort } from "@/lib/helpers";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "./radio-group";

type DateRangePickerProps = Omit<React.HTMLAttributes<HTMLDivElement>, "defaultValue"> & {
  date: DateRange | undefined;
  onDateChange: (date: DateRange | undefined) => void;
  placeholder?: string;
  defaultValue?: DateRange;
};

export function DateRangePicker({
  className,
  date,
  onDateChange,
  placeholder = "Pilih rentang tanggal",
  defaultValue,
}: DateRangePickerProps) {
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full justify-between text-left font-normal", // Changed justify-start to justify-between
              !date && "text-muted-foreground"
            )}
          >
            <div className="flex-1 flex items-center">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date?.from
                ? date.to
                  ? `${formatDateShort(date.from)} - ${formatDateShort(date.to)}`
                  : formatDateShort(date.from)
                : placeholder}
            </div>
            {!isDateRangeEqual(date, defaultValue) && (
              <div
                role="button"
                className="hover:bg-accent hover:text-accent-foreground p-1 rounded-sm ml-2 z-10"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onDateChange(defaultValue);
                }}
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </div>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            captionLayout="dropdown"
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={onDateChange}
            numberOfMonths={2}
            locale={idLocale}
          />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-3 border-t">
            {[
              { label: "7 Hari Terakhir", from: () => subDays(new Date(), 7) },
              { label: "1 Bulan Terakhir", from: () => subMonths(new Date(), 1) },
              { label: "3 Bulan Terakhir", from: () => subMonths(new Date(), 3) },
              { label: "6 Bulan Terakhir", from: () => subMonths(new Date(), 6) },
              { label: "1 Tahun Terakhir", from: () => subYears(new Date(), 1) },
            ].map((preset) => {
              const presetFrom = preset.from();
              const presetTo = new Date();
              const isActive =
                date?.from &&
                date?.to &&
                isSameDay(date.from, presetFrom) &&
                isSameDay(date.to, presetTo);

              return (
                <Button
                  key={preset.label}
                  variant={"outline"}
                  shape="default"
                  size="sm"
                  className={
                    isActive
                      ? "bg-primary/10 border-primary/30 hover:bg-primary/10 text-primary"
                      : ""
                  }
                  onClick={() => {
                    onDateChange({ from: presetFrom, to: presetTo });
                  }}
                >
                  {preset.label}
                </Button>
              );
            })}
            <Button
              variant="outline"
              shape="default"
              size="sm"
              onClick={() => {
                onDateChange(defaultValue);
              }}
            >
              Reset
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

const isDateEqual = (date1: Date | undefined, date2: Date | undefined) => {
  if (!date1 || !date2) return false;
  return date1.toISOString() === date2.toISOString();
};

const isDateRangeEqual = (date1: DateRange | undefined, date2: DateRange | undefined) => {
  if (!date1 || !date2) return false;
  return isDateEqual(date1.from, date2.from) && isDateEqual(date1.to, date2.to);
};
