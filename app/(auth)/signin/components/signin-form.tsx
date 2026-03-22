"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, LoaderCircleIcon } from "lucide-react";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { ROUTES } from "@/config/routes.config";
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
import { PasswordInput } from "@/components/ui/password-input";
import { SigninSchema, SigninSchemaType } from "@/app/(auth)/forms/signin-schema";

export function SigninForm() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<SigninSchemaType>({
    resolver: zodResolver(SigninSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  async function onSubmit(values: SigninSchemaType) {
    setIsProcessing(true);
    setError(null);

    try {
      const response = await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
        rememberMe: values.rememberMe,
      });

      if (response?.error) {
        try {
          const errorData = JSON.parse(response.error);
          setError(errorData.message);
        } catch {
          setError("Kredensial tidak valid.");
        }
      } else {
        router.push(ROUTES.DASHBOARD);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan yang tidak terduga.");
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <Card className="w-full max-w-[400px]">
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="block w-full space-y-5">
            <div className="space-y-1.5 pb-3">
              <h1 className="text-2xl font-semibold tracking-tight text-center">Masuk</h1>
              <p className="text-sm text-muted-foreground text-center">
                Masukkan kredensial Anda untuk masuk.
              </p>
            </div>

            {error && (
              <Alert variant="destructive" onClose={() => setError(null)}>
                <AlertIcon>
                  <AlertCircle />
                </AlertIcon>
                <AlertTitle>{error}</AlertTitle>
              </Alert>
            )}

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Masukkan email Anda" {...field} />
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
                  <div className="flex justify-between items-center gap-2.5">
                    <FormLabel>Password</FormLabel>
                    {/* <Link
                      href={ROUTES.RESET_PASSWORD}
                      className="text-sm font-medium text-muted-foreground hover:text-primary hover:underline underline-offset-4"
                    >
                      Lupa Password?
                    </Link> */}
                  </div>
                  <FormControl>
                    <PasswordInput placeholder="Masukkan password Anda" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* <FormField
          control={form.control}
          name="rememberMe"
          render={({ field }) => (
            <div className="flex items-center gap-2">
              <Checkbox
                id="remember-me"
                checked={field.value}
                onCheckedChange={(checked) => field.onChange(!!checked)}
              />
              <label htmlFor="remember-me" className="text-sm text-muted-foreground cursor-pointer">
                Remember me
              </label>
            </div>
          )}
        /> */}

            <Button type="submit" disabled={isProcessing} className="w-full" shape="circle">
              {isProcessing && <LoaderCircleIcon className="size-4 animate-spin" />}
              Masuk
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
