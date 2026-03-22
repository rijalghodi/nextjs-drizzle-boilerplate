import { useMutation } from "@tanstack/react-query";
import { BaseResponse } from "@/types/response";
import { apiFetch } from "@/lib/api";

export const useVerifyResetToken = () => {
  return useMutation<BaseResponse<void>, Error, { token: string }>({
    mutationFn: (data) =>
      apiFetch<BaseResponse<void>>("/api/auth/reset-password-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }),
  });
};
