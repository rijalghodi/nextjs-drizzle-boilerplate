import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BaseResponse } from "@/types/response";
import { apiFetch } from "@/lib/api";
import { buildQueryKeyPredicate } from "@/lib/react-query-helper";
import { USERS_KEY } from "./use-users";

export const useDeleteUser = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation<BaseResponse<void>, Error>({
    mutationFn: () =>
      apiFetch<BaseResponse<void>>(`/api/users/${userId}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: buildQueryKeyPredicate([{ key: USERS_KEY }]),
      });
    },
  });
};
