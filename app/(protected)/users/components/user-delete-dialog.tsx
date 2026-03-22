"use client";

import { LoaderCircleIcon } from "lucide-react";
import { toast } from "sonner";
import { User } from "@/types/user.type";
import { useBulkDeleteUsers } from "@/hooks/users/use-bulk-delete-users";
import { useDeleteUser } from "@/hooks/users/use-delete-user";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface UserDeleteDialogProps {
  open: boolean;
  closeDialog: () => void;
  users: User[];
}

export function UserDeleteDialog({ open, closeDialog, users }: UserDeleteDialogProps) {
  const isBulk = users.length > 1;
  const singleUser = users[0];

  const { mutate: deleteSingle, isPending: isSinglePending } = useDeleteUser(singleUser?.id || "");
  const { mutate: deleteBulk, isPending: isBulkPending } = useBulkDeleteUsers();

  const isPending = isSinglePending || isBulkPending;

  const handleConfirm = () => {
    const onSuccess = () => {
      toast.success(
        isBulk ? `${users.length} pengguna berhasil dihapus` : "Pengguna berhasil dihapus"
      );
      closeDialog();
    };

    const onError = (error: Error) => {
      toast.error(error.message);
    };

    if (isBulk) {
      deleteBulk({ ids: users.map((u) => u.id) }, { onSuccess, onError });
    } else {
      deleteSingle(undefined, { onSuccess, onError });
    }
  };

  if (!users.length) return null;

  return (
    <Dialog open={open} onOpenChange={closeDialog}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Konfirmasi Hapus</DialogTitle>
        </DialogHeader>
        <div>
          <p className="text-sm text-muted-foreground">
            {isBulk ? (
              <>
                Anda akan menghapus{" "}
                <strong className="text-foreground">{users.length} pengguna</strong>. Tindakan ini
                tidak dapat dibatalkan.
              </>
            ) : (
              <>
                Anda akan menghapus pengguna{" "}
                <strong className="text-foreground">{singleUser.name || singleUser.email}</strong>.
                Tindakan ini tidak dapat dibatalkan.
              </>
            )}
          </p>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={closeDialog} shape="circle">
            Batal
          </Button>
          <Button variant="destructive" onClick={handleConfirm} disabled={isPending} shape="circle">
            {isPending && <LoaderCircleIcon className="animate-spin" />}
            {isBulk
              ? `Hapus ${users.length} pengguna`
              : `Hapus pengguna ${singleUser.name || singleUser.email}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default UserDeleteDialog;
