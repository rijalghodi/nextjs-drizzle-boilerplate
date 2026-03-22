"use client";

import React, { useState } from "react";
import type { ContextDialogProps } from "@/providers/dialog-providers";
import { Button } from "./button";
import { DialogFooter } from "./dialog";

type DialogConfirmInnerProps = {
  onConfirm?: () => Promise<boolean> | void;
  onCancel?: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "destructive" | "default";
};

export function DialogConfirm({
  context,
  id,
  innerProps,
}: ContextDialogProps<DialogConfirmInnerProps>) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!innerProps.onConfirm) {
      context.closeDialog(id);
      return;
    }

    setLoading(true);
    try {
      await innerProps.onConfirm();
      context.closeDialog(id);
    } catch (error) {
      console.error("Confirmation action failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (!loading) {
      innerProps.onCancel?.();
      context.closeDialog(id);
    }
  };

  return (
    <DialogFooter className="flex w-full gap-">
      <Button
        type="button"
        variant="outline"
        className="flex-1 rounded-full"
        onClick={handleCancel}
        disabled={loading}
      >
        {innerProps.cancelLabel || "Cancel"}
      </Button>
      <Button
        type="button"
        className="flex-1 rounded-full"
        variant={innerProps.variant === "destructive" ? "destructive" : "primary"}
        onClick={handleConfirm}
        disabled={loading}
      >
        {loading ? "Loading..." : innerProps.confirmLabel || "Confirm"}
      </Button>
    </DialogFooter>
  );
}
