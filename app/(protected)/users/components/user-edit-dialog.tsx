"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircleIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { User } from "@/types/user.type";
import { useUpdateUser } from "@/hooks/users/use-update-user";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AvatarInput } from "@/components/ui/avatar-input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogForm,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { roleList } from "@/app/constants/roles";
import { UserEditSchema, UserEditSchemaType } from "@/app/forms/user-edit-schema";

export const UserEditDialog = ({
  open,
  closeDialog,
  user,
}: {
  open: boolean;
  closeDialog: () => void;
  user: User;
}) => {
  const form = useForm<UserEditSchemaType>({
    resolver: zodResolver(UserEditSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      role: user?.role as UserEditSchemaType["role"],
      password: "",
      avatarFileId: user?.avatarFile?.id,
    },
    mode: "onSubmit",
  });

  useEffect(() => {
    if (open) {
      form.reset({
        name: user?.name || "",
        email: user?.email || "",
        role: user?.role as UserEditSchemaType["role"],
        password: "",
        avatarFileId: user?.avatarFile?.id,
      });
    }
  }, [open, user, form]);

  const mutation = useUpdateUser(user?.id);
  const isProcessing = mutation.status === "pending";

  const handleSubmit = (values: UserEditSchemaType) => {
    mutation.mutate(values, {
      onSuccess: () => {
        toast.success("Pengguna berhasil diperbarui");
        closeDialog();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={closeDialog}>
      <DialogContent>
        <DialogForm onSubmit={form.handleSubmit(handleSubmit)}>
          <DialogHeader>
            <DialogTitle>Edit Pengguna</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <Form {...form}>
              <div className="space-y-4">
                {mutation.status === "error" && (
                  <Alert variant="destructive">
                    <AlertDescription>{mutation.error.message}</AlertDescription>
                  </Alert>
                )}
                <FormField
                  control={form.control}
                  name="avatarFileId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Avatar</FormLabel>
                      <FormControl>
                        <AvatarInput placeholder="Enter avatar" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel withAsterisk>Nama</FormLabel>
                      <FormControl>
                        <Input placeholder="Masukkan nama pengguna" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel withAsterisk>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Masukkan email pengguna"
                          readOnly
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel withAsterisk>Peran</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih peran" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {roleList?.map((role) => (
                                <SelectItem key={role.value} value={role.value}>
                                  {role.label}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel withAsterisk>Password</FormLabel>
                      <FormDescription>
                        Kosongkan jika tidak ingin mengubah password
                      </FormDescription>
                      <FormControl>
                        <PasswordInput placeholder="Enter password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </Form>
          </DialogBody>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={closeDialog} shape="circle">
              Batal
            </Button>
            <Button type="submit" disabled={!form.formState.isDirty || isProcessing} shape="circle">
              {isProcessing && <LoaderCircleIcon className="animate-spin" />}
              Simpan Perubahan
            </Button>
          </DialogFooter>
        </DialogForm>
      </DialogContent>
    </Dialog>
  );
};

export default UserEditDialog;
