"use client";

import { forwardRef, useEffect, useState } from "react";
import { VariantProps } from "class-variance-authority";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input, inputVariants } from "./input";

type InputProps = React.ComponentProps<"input"> & VariantProps<typeof inputVariants>;

export type NumberInputProps = Omit<InputProps, "value" | "onChange" | "type"> & {
  value?: number;
  onChange?: (value?: number) => void;
  withDelimiter?: boolean;
  step?: number;
  min?: number;
  max?: number;
  hideControls?: boolean;
};

function formatNumberWithDelimiter(value: number): string {
  return value.toLocaleString("id-ID");
}

function parseNumberFromDelimiter(value: string): number | undefined {
  const clean = value.replace(/\./g, "").replace(/,/g, "");
  if (clean === "") return 0;
  const n = Number(clean);
  return Number.isNaN(n) ? 0 : n;
}

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  (
    { name, value, onChange, withDelimiter = true, step = 1, min, max, hideControls, ...props },
    ref
  ) => {
    const [display, setDisplay] = useState("");

    useEffect(() => {
      if (typeof value === "number") {
        setDisplay(withDelimiter ? formatNumberWithDelimiter(value) : String(value));
      } else {
        setDisplay("");
      }
    }, [value, withDelimiter]);

    const handleChange = (value: string) => {
      let parsed: number | undefined;
      if (withDelimiter) {
        parsed = parseNumberFromDelimiter(value);
      } else {
        parsed = value === "" ? 0 : Number(value);
      }

      if (parsed !== undefined && min !== undefined && parsed < min) {
        return;
      }

      if (parsed !== undefined && max !== undefined && parsed > max) {
        return;
      }

      onChange?.(parsed);
    };

    const handleIncrement = () => {
      if (value === undefined) {
        handleChange?.(String(step));
      } else {
        handleChange?.(String(value + step));
      }
    };

    const handleDecrement = () => {
      if (value === undefined) {
        handleChange?.(String(-step));
      } else {
        handleChange?.(String(value - step));
      }
    };

    return (
      <div className="relative w-full">
        <Input
          ref={ref}
          id={name}
          type="text"
          name={name}
          value={display}
          onChange={(e) => {
            const str = e.target.value;
            handleChange(str);
          }}
          inputMode="numeric"
          {...props}
          className={cn("font-medium font-mono tracking-tight", props.className)}
        />
        <div className="flex flex-col max-w-5 absolute end-0.5 top-1/2 -translate-y-1/2 h-7 w-7 me-1.5 bg-transparent!">
          <button
            className="flex-1 hover:bg-accent cursor-pointer flex justify-center items-center text-muted-foreground hover:text-foreground size-4 w-full"
            type="button"
            title="Increment"
            onClick={handleIncrement}
            tabIndex={-1}
          >
            <ChevronUp className="size-3!" />
          </button>
          <button
            className="flex-1 hover:bg-accent cursor-pointer flex justify-center items-center text-muted-foreground hover:text-foreground size-4 w-full"
            type="button"
            title="Decrement"
            onClick={handleDecrement}
            tabIndex={-1}
          >
            <ChevronDown className="size-3!" />
          </button>
        </div>
      </div>
    );
  }
);

NumberInput.displayName = "NumberInput";
