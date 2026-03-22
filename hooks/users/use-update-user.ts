import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BaseResponse, ErrorResponse } from "@/types/response";
import { User } from "@/types/user.type";
import { apiFetch } from "@/lib/api";
import { buildQueryKeyPredicate } from "@/lib/react-query-helper";
import { UserEditSchemaType } from "@/app/forms/user-edit-schema";
import { USERS_KEY } from "./use-users";

export const useUpdateUser = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation<BaseResponse<User>, ErrorResponse<User>, UserEditSchemaType>({
    mutationFn: (data) =>
      apiFetch<BaseResponse<User>>(`/api/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: buildQueryKeyPredicate([{ key: USERS_KEY }]),
      });
      queryClient.invalidateQueries({ queryKey: [userId] });
    },
  });
};
