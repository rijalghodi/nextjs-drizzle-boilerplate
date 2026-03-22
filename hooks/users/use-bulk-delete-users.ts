import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BaseResponse } from "@/types/response";
import { apiFetch } from "@/lib/api";
import { buildQueryKeyPredicate } from "@/lib/react-query-helper";
import { USERS_KEY } from "./use-users";

export const useBulkDeleteUsers = () => {
  const queryClient = useQueryClient();

  return useMutation<BaseResponse<void>, Error, { ids: string[] }>({
    mutationFn: (data) =>
      apiFetch<BaseResponse<void>>(`/api/users/bulk`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: buildQueryKeyPredicate([{ key: USERS_KEY }]),
      });
    },
  });
};
