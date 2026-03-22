"use client";

import * as React from "react";
import { id as idLocale } from "react-day-picker/locale/id";
import { formatDateShort } from "@/lib/helpers";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export function DateInput({
  value,
  onChange,
  readOnly,
  className,
}: {
  value?: Date;
  onChange?: (date?: Date) => void;
  readOnly?: boolean;
  className?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [localDate, setLocalDate] = React.useState<Date | undefined>();

  const date = value || localDate;
  const handleChange = (date?: Date) => {
    setLocalDate(date);
    onChange?.(date);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild disabled={readOnly}>
        <Button
          variant="outline"
          className={cn("justify-start font-normal", !date && "text-muted-foreground", className)}
        >
          {date ? formatDateShort(date) : "Select date"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto overflow-hidden p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          defaultMonth={date}
          captionLayout="dropdown"
          locale={idLocale}
          onSelect={(date) => {
            if (readOnly) return;
            handleChange(date);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
