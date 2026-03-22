import { useQuery } from "@tanstack/react-query";
import { PaginatedParams, PaginatedResponse } from "@/types/response";
import { User } from "@/types/user.type";
import { apiFetch } from "@/lib/api";
import { buildQueryKey } from "@/lib/react-query-helper";

export const USERS_KEY = "users";
export const useUsers = (
  params: PaginatedParams & {
    role?: string | null;
  }
) => {
  return useQuery<PaginatedResponse<User>>({
    queryKey: buildQueryKey(USERS_KEY, params),
    queryFn: async () => {
      const response = await apiFetch<PaginatedResponse<User>>(`/api/users`, {
        queryParams: params,
      });
      return response;
    },
  });
};
