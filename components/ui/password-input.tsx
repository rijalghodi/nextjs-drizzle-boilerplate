"use client";

import { forwardRef, useState } from "react";
import { VariantProps } from "class-variance-authority";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "./button";
import { Input, inputVariants } from "./input";

type InputProps = React.ComponentProps<"input"> & VariantProps<typeof inputVariants>;

export type PasswordInputProps = Omit<InputProps, "value" | "onChange" | "type"> & {
  hideEye?: boolean;
};

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ hideEye, ...props }, ref) => {
    const [passwordVisible, setPasswordVisible] = useState(false);

    return (
      <div className="relative">
        <Input
          placeholder="Masukkan password Anda"
          type={passwordVisible ? "text" : "password"}
          {...props}
        />
        {!hideEye && (
          <Button
            type="button"
            variant="ghost"
            mode="icon"
            size="sm"
            onClick={() => setPasswordVisible(!passwordVisible)}
            className="absolute end-0 top-1/2 -translate-y-1/2 h-7 w-7 me-1.5 bg-transparent! text-muted-foreground hover:text-foreground"
            aria-label={passwordVisible ? "Hide password" : "Show password"}
          >
            {passwordVisible ? <EyeOff /> : <Eye />}
          </Button>
        )}
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";
