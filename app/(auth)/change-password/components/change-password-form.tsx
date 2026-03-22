"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CheckCircle, Eye, EyeOff, LoaderCircleIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { ROUTES } from "@/config/routes.config";
import { useChangePassword } from "@/hooks/auth/use-change-password";
import { useVerifyResetToken } from "@/hooks/auth/use-verify-reset-token";
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
  ChangePasswordSchema,
  ChangePasswordSchemaType,
} from "@/app/(auth)/forms/change-password-schema";

export function ChangePasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams?.get("token") ?? null;

  const [tokenError, setTokenError] = useState<string | null>(null);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);

  const form = useForm<ChangePasswordSchemaType>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  const { mutate: verifyToken, isPending: isVerifying } = useVerifyResetToken();
  const { mutate: changePassword, isPending: isChanging, isSuccess } = useChangePassword();

  useEffect(() => {
    if (!token) {
      setTokenError("Token reset tidak ditemukan.");
      return;
    }
    verifyToken(
      { token },
      {
        onSuccess: () => setIsTokenValid(true),
        onError: (err) => setTokenError(err.message || "Token tidak valid atau telah kedaluwarsa."),
      }
    );
  }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  function onSubmit(values: ChangePasswordSchemaType) {
    if (!token) return;
    changePassword(
      { token, newPassword: values.newPassword },
      {
        onSuccess: () => {
          setTimeout(() => router.push(ROUTES.LOGIN), 3000);
        },
      }
    );
  }

  return (
    <Card className="w-full max-w-[400px]">
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="block w-full space-y-5">
            <div className="text-center space-y-1 pb-3">
              <h1 className="text-2xl font-semibold tracking-tight">Atur Password Baru</h1>
              <p className="text-sm text-muted-foreground">
                Masukkan password baru Anda di bawah ini.
              </p>
            </div>

            {/* Token verification loading */}
            {isVerifying && (
              <Alert>
                <AlertIcon>
                  <LoaderCircleIcon className="animate-spin" />
                </AlertIcon>
                <AlertTitle>Memverifikasi token…</AlertTitle>
              </Alert>
            )}

            {/* Token error */}
            {tokenError && !isVerifying && (
              <div className="space-y-4">
                <Alert variant="destructive">
                  <AlertIcon>
                    <AlertCircle />
                  </AlertIcon>
                  <AlertTitle>{tokenError}</AlertTitle>
                </Alert>
                <Button asChild className="w-full">
                  <Link href={ROUTES.RESET_PASSWORD}>Minta tautan baru</Link>
                </Button>
              </div>
            )}

            {/* Success */}
            {isSuccess && (
              <Alert>
                <AlertIcon>
                  <CheckCircle />
                </AlertIcon>
                <AlertTitle>Password berhasil diubah! Mengarahkan ke halaman masuk…</AlertTitle>
              </Alert>
            )}

            {/* Form fields — only when token is valid and not done */}
            {isTokenValid && !isSuccess && !isVerifying && (
              <>
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password Baru</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            type={passwordVisible ? "text" : "password"}
                            placeholder="Masukkan password baru"
                            {...field}
                          />
                        </FormControl>
                        <Button
                          type="button"
                          variant="ghost"
                          mode="icon"
                          size="sm"
                          onClick={() => setPasswordVisible(!passwordVisible)}
                          className="absolute end-0 top-1/2 -translate-y-1/2 h-7 w-7 me-1.5 bg-transparent!"
                          aria-label={passwordVisible ? "Hide password" : "Show password"}
                        >
                          {passwordVisible ? (
                            <EyeOff className="text-muted-foreground" />
                          ) : (
                            <Eye className="text-muted-foreground" />
                          )}
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Konfirmasi Password Baru</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            type={confirmVisible ? "text" : "password"}
                            placeholder="Konfirmasi password baru"
                            {...field}
                          />
                        </FormControl>
                        <Button
                          type="button"
                          variant="ghost"
                          mode="icon"
                          size="sm"
                          onClick={() => setConfirmVisible(!confirmVisible)}
                          className="absolute end-0 top-1/2 -translate-y-1/2 h-7 w-7 me-1.5 bg-transparent!"
                          aria-label={confirmVisible ? "Hide confirmation" : "Show confirmation"}
                        >
                          {confirmVisible ? (
                            <EyeOff className="text-muted-foreground" />
                          ) : (
                            <Eye className="text-muted-foreground" />
                          )}
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={isChanging} className="w-full">
                  {isChanging && <LoaderCircleIcon className="animate-spin" />}
                  Reset Password
                </Button>
              </>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
