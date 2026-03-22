import { useQuery } from "@tanstack/react-query";
import { BaseResponse } from "@/types/response";
import { User } from "@/types/user.type";
import { apiFetch } from "@/lib/api";
import { buildQueryKey } from "@/lib/react-query-helper";

export const USER_KEY = "user";
export const useUser = (userId: string) => {
  return useQuery<BaseResponse<User>>({
    queryKey: buildQueryKey(USER_KEY, { userId }),
    queryFn: async () => {
      const response = await apiFetch<BaseResponse<User>>(`/api/users/${userId}`);
      return response;
    },
  });
};
