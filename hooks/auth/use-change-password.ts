import { useMutation } from "@tanstack/react-query";
import { BaseResponse } from "@/types/response";
import { apiFetch } from "@/lib/api";

export const useChangePassword = () => {
  return useMutation<BaseResponse<void>, Error, { token: string; newPassword: string }>({
    mutationFn: (data) =>
      apiFetch<BaseResponse<void>>("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }),
  });
};
