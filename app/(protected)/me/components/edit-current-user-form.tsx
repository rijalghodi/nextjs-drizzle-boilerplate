"use client";

import { useEffect } from "react";
import { DevTool } from "@hookform/devtools";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useCurrentUser } from "@/hooks/users/use-current-user";
import { useEditCurrentUser } from "@/hooks/users/use-edit-current-user";
import { AvatarInput } from "@/components/ui/avatar-input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Separator } from "@/components/ui/separator";
import { getUserRoleProps } from "@/app/constants/roles";
import {
  ediCurrenttUserSchema,
  EditCurrentUserSchemaType,
} from "@/app/forms/edit-current-user-schema";

export function EditCurrentUserForm({ className }: { className?: string }) {
  const { data, isLoading } = useCurrentUser();
  const user = data?.data;
  const roleProps = user ? getUserRoleProps(user.role) : null;
  const { mutate: editUser, isPending } = useEditCurrentUser();

  const form = useForm<EditCurrentUserSchemaType>({
    resolver: zodResolver(ediCurrenttUserSchema),
    defaultValues: {
      name: "",
      avatarFileId: "",
      password: "",
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name || "",
        avatarFileId: user.avatarFile?.id || "",
        password: "",
      });
    }
  }, [user, form]);

  function onSubmit(data: EditCurrentUserSchemaType) {
    editUser(data);
  }

  if (isLoading)
    return (
      <div className="p-4 text-muted-foreground flex items-center justify-center">
        Memuat data...
      </div>
    );

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Edit Akun Saya</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1">
              <p className="font-medium text-sm">Email</p>
              <p className="text-muted-foreground text-sm">{user?.email}</p>
            </div>
            <div className="space-y-1">
              <p className="font-medium text-sm">Peran</p>
              <Badge variant={roleProps?.variant}>{roleProps?.label || "Unknown"}</Badge>
            </div>
            <Separator className="opacity-0" />
            <FormField
              control={form.control}
              name="avatarFileId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Foto Profil</FormLabel>
                  <FormControl>
                    <AvatarInput
                      placeholder="Foto Profil"
                      size={80}
                      {...field}
                      value={field.value || ""}
                      shape="circle"
                    />
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
                  <FormLabel>Nama Lengkap</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nama Anda"
                      {...field}
                      value={field.value || ""}
                      shape="circle"
                    />
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
                  <FormLabel>Password Baru</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder="Kosongkan jika tidak ubah password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isPending || !form.formState.isDirty}
              shape="circle"
              className="w-full"
            >
              {isPending ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </form>
          <DevTool control={form.control} />
        </Form>
      </CardContent>
    </Card>
  );
}
