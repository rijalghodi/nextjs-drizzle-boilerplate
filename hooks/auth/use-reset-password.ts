import { useMutation } from "@tanstack/react-query";
import { BaseResponse } from "@/types/response";
import { apiFetch } from "@/lib/api";
import { ResetPasswordSchemaType } from "@/app/(auth)/forms/reset-password-schema";

export const useResetPassword = () => {
  return useMutation<BaseResponse<void>, Error, ResetPasswordSchemaType>({
    mutationFn: (data) =>
      apiFetch<BaseResponse<void>>("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }),
  });
};
