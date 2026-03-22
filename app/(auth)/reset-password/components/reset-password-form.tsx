"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, ArrowLeft, CheckCircle, LoaderCircleIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { ROUTES } from "@/config/routes.config";
import { useResetPassword } from "@/hooks/auth/use-reset-password";
import { Alert, AlertIcon, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  ResetPasswordSchema,
  ResetPasswordSchemaType,
} from "@/app/(auth)/forms/reset-password-schema";

export function ResetPasswordForm() {
  const form = useForm<ResetPasswordSchemaType>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: { email: "" },
  });

  const { mutate, isPending, isSuccess, error } = useResetPassword();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const valid = await form.trigger();
    if (!valid) return;
    const values = form.getValues();
    mutate(
      { ...values },
      {
        onSuccess: () => {
          form.reset();
        },
      }
    );
  };

  return (
    <Card className="w-full max-w-[400px]">
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={handleSubmit} className="block w-full space-y-5">
            <div className="text-center space-y-1 pb-3">
              <h1 className="text-2xl font-semibold tracking-tight">Reset Password</h1>
              <p className="text-sm text-muted-foreground">
                Masukkan email Anda untuk menerima tautan reset password.
              </p>
            </div>

            {error && (
              <Alert variant="destructive" onClose={() => {}}>
                <AlertIcon>
                  <AlertCircle />
                </AlertIcon>
                <AlertTitle>{error.message}</AlertTitle>
              </Alert>
            )}

            {isSuccess && (
              <Alert>
                <AlertIcon>
                  <CheckCircle />
                </AlertIcon>
                <AlertTitle>
                  Jika akun dengan email tersebut ditemukan, tautan reset password telah dikirim.
                </AlertTitle>
              </Alert>
            )}

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Masukkan alamat email Anda"
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isPending} className="w-full">
              {isPending && <LoaderCircleIcon className="animate-spin" />}
              Kirim Tautan Reset
            </Button>
            <Button type="button" variant="outline" className="w-full" asChild>
              <Link href={ROUTES.LOGIN}>
                <ArrowLeft className="size-3.5" />
                Kembali ke halaman Masuk
              </Link>
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
