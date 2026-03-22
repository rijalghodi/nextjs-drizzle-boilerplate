import React, { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/use-debounce";
import { Button } from "./button";
import { Input } from "./input";

type Props = {
  onSearch: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  debounceDelay?: number;
  className?: string;
  defaultValue?: string;
};

export function SearchInput({
  onSearch,
  placeholder = "Cari...",
  disabled,
  debounceDelay = 500,
  className,
  defaultValue = "",
}: Props) {
  const [inputValue, setInputValue] = useState(defaultValue);

  useEffect(() => {
    setInputValue(defaultValue);
  }, [defaultValue]);

  const debouncedValue = useDebounce(inputValue, debounceDelay);

  // keep latest callback without retriggering effect
  const onSearchRef = useRef(onSearch);
  useEffect(() => {
    onSearchRef.current = onSearch;
  }, [onSearch]);

  // avoid duplicate calls
  const lastValueRef = useRef<string>(defaultValue);

  useEffect(() => {
    if (lastValueRef.current === debouncedValue) return;
    lastValueRef.current = debouncedValue;
    onSearchRef.current(debouncedValue);
  }, [debouncedValue]);

  return (
    <div className="relative">
      <Search className="size-4 text-muted-foreground absolute start-3 top-1/2 -translate-y-1/2" />

      <Input
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") onSearchRef.current(inputValue);
        }}
        disabled={disabled}
        className={cn("ps-9 w-full", className)}
      />

      {inputValue.length > 0 && (
        <Button
          mode="icon"
          variant="dim"
          className="absolute end-1.5 top-1/2 -translate-y-1/2 h-6 w-6"
          onClick={() => {
            setInputValue("");
            lastValueRef.current = "";
            onSearchRef.current("");
          }}
        >
          <X />
        </Button>
      )}
    </div>
  );
}
