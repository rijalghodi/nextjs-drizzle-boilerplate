import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BaseResponse, ErrorResponse } from "@/types/response";
import { User } from "@/types/user.type";
import { apiFetch } from "@/lib/api";
import { buildQueryKeyPredicate } from "@/lib/react-query-helper";
import { UserAddSchemaType } from "@/app/forms/user-add-schema";
import { USERS_KEY } from "./use-users";

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation<BaseResponse<User>, ErrorResponse<User>, UserAddSchemaType>({
    mutationFn: (data) =>
      apiFetch<BaseResponse<User>>("/api/users", {
        method: "POST",
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
