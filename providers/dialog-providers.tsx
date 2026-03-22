"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogConfirm } from "@/components/ui/dialog-confirm";

// Types
type ContextDialogProps<T = any> = {
  context: DialogManagerContextType;
  id: string;
  innerProps: T;
};

type DialogConfig<T = any> = {
  modal: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  closeOnEscape?: boolean;
  closeOnClickOutside?: boolean;
  showCloseButton?: boolean;
  innerProps?: T;
  size?: "sm" | "md" | "lg" | "xl" | "full";
};

type DialogState<T = any> = DialogConfig<T> & {
  isOpen: boolean;
};

type DialogManagerContextType = {
  openContextDialog: <T = any>(config: DialogConfig<T>) => string;
  updateContextDialog: <T = any>(params: { dialogId: string } & Partial<DialogConfig<T>>) => void;
  closeDialog: (id: string) => void;
  closeAllDialogs: () => void;
};

// Context
const DialogManagerContext = React.createContext<DialogManagerContextType | undefined>(undefined);

// Hook
export function useDialogManager() {
  const context = React.useContext(DialogManagerContext);
  if (!context) {
    throw new Error("useDialogManager must be used within DialogManagerProvider");
  }
  return context;
}

export const dialogs = {
  openContextDialog: <T = any,>(config: DialogConfig<T>): string => {
    const event = new CustomEvent("open-dialog", { detail: config });
    window.dispatchEvent(event);
    return config.modal || String(Date.now());
  },
  updateContextDialog: <T = any,>(
    params: { dialogId: string } & Partial<DialogConfig<T>>
  ): void => {
    const event = new CustomEvent("update-dialog", { detail: params });
    window.dispatchEvent(event);
  },
  closeDialog: (id: string): void => {
    const event = new CustomEvent("close-dialog", { detail: { id } });
    window.dispatchEvent(event);
  },
  closeAllDialogs: (): void => {
    const event = new CustomEvent("close-all-dialogs");
    window.dispatchEvent(event);
  },
};

// Provider Props
type DialogManagerProviderProps = {
  children: React.ReactNode;
  dialogs: Record<string, React.ComponentType<ContextDialogProps<any>>>;
};

// Provider Component
export function DialogManagerProvider({ children, dialogs }: DialogManagerProviderProps) {
  // Pass the confirm dialog to the dialog components
  const dialogComponents: Record<string, React.ComponentType<ContextDialogProps<any>>> = {
    confirm: DialogConfirm,
    ...dialogs,
  };

  const [dialogStates, setDialogStates] = React.useState<Map<string, DialogState>>(new Map());
  const dialogIdCounter = React.useRef(0);

  const openContextDialog = React.useCallback(<T,>(config: DialogConfig<T>): string => {
    // Use 'confirm' as default modal if not specified
    const modal = config.modal || "confirm";
    const id = modal || `dialog-${dialogIdCounter.current++}`;
    setDialogStates((prev) => {
      const newStates = new Map(prev);
      newStates.set(id, {
        ...config,
        modal,
        isOpen: true,
        closeOnEscape: config.closeOnEscape ?? true,
        closeOnClickOutside: config.closeOnClickOutside ?? true,
        showCloseButton: config.showCloseButton ?? true,
        size: config.size ?? "md",
      });
      return newStates;
    });
    return id;
  }, []);

  const updateContextDialog = React.useCallback(
    <T,>({ dialogId, ...updates }: { dialogId: string } & Partial<DialogConfig<T>>) => {
      setDialogStates((prev) => {
        const newStates = new Map(prev);
        const currentState = newStates.get(dialogId);
        if (currentState) {
          newStates.set(dialogId, { ...currentState, ...updates });
        }
        return newStates;
      });
    },
    []
  );

  const closeDialog = React.useCallback((id: string) => {
    setDialogStates((prev) => {
      const newStates = new Map(prev);
      const currentState = newStates.get(id);
      if (currentState) {
        newStates.set(id, { ...currentState, isOpen: false });
        // Remove the dialog after animation
        setTimeout(() => {
          setDialogStates((prev) => {
            const newStates = new Map(prev);
            newStates.delete(id);
            return newStates;
          });
        }, 150);
      }
      return newStates;
    });
  }, []);

  const closeAllDialogs = React.useCallback(() => {
    setDialogStates(new Map());
  }, []);

  // Listen to imperative API events
  React.useEffect(() => {
    const handleOpenDialog = (e: CustomEvent) => {
      openContextDialog(e.detail);
    };
    const handleUpdateDialog = (e: CustomEvent) => {
      updateContextDialog(e.detail);
    };
    const handleCloseDialog = (e: CustomEvent) => {
      closeDialog(e.detail.id);
    };
    const handleCloseAllDialogs = () => {
      closeAllDialogs();
    };

    window.addEventListener("open-dialog" as any, handleOpenDialog);
    window.addEventListener("update-dialog" as any, handleUpdateDialog);
    window.addEventListener("close-dialog" as any, handleCloseDialog);
    window.addEventListener("close-all-dialogs" as any, handleCloseAllDialogs);

    return () => {
      window.removeEventListener("open-dialog" as any, handleOpenDialog);
      window.removeEventListener("update-dialog" as any, handleUpdateDialog);
      window.removeEventListener("close-dialog" as any, handleCloseDialog);
      window.removeEventListener("close-all-dialogs" as any, handleCloseAllDialogs);
    };
  }, [openContextDialog, updateContextDialog, closeDialog, closeAllDialogs]);

  const value = React.useMemo(
    () => ({
      openContextDialog,
      updateContextDialog,
      closeDialog,
      closeAllDialogs,
    }),
    [openContextDialog, updateContextDialog, closeDialog, closeAllDialogs]
  );

  return (
    <DialogManagerContext.Provider value={value}>
      {children}
      {/* Render all registered dialogs */}
      {Array.from(dialogStates.entries()).map(([id, state]) => {
        const DialogComponent = dialogComponents[state.modal];

        if (!DialogComponent) {
          console.warn(`Dialog "${state.modal}" not found in registered dialogs`);
          return null;
        }

        const handleOpenChange = (open: boolean) => {
          if (!open) {
            if (state.closeOnClickOutside || state.closeOnEscape) {
              closeDialog(id);
            }
          }
        };

        return (
          <Dialog key={id} open={state.isOpen} onOpenChange={handleOpenChange}>
            <DialogContent
              showCloseButton={state.showCloseButton}
              closeOnEscape={state.closeOnEscape}
              closeOnClickOutside={state.closeOnClickOutside}
              size={state.size}
            >
              {(state.title || state.description) && (
                <DialogHeader>
                  {state.title && <DialogTitle>{state.title}</DialogTitle>}
                  {state.description && <DialogDescription>{state.description}</DialogDescription>}
                </DialogHeader>
              )}
              <DialogComponent context={value} id={id} innerProps={state.innerProps || {}} />
            </DialogContent>
          </Dialog>
        );
      })}
    </DialogManagerContext.Provider>
  );
}

export type { ContextDialogProps, DialogConfig };
