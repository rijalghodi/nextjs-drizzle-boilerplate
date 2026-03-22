import { useQuery } from "@tanstack/react-query";
import { BaseResponse } from "@/types/response";
import { User } from "@/types/user.type";
import { apiFetch } from "@/lib/api";

export function useCurrentUser() {
  return useQuery<BaseResponse<User>>({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const response = await apiFetch<BaseResponse<User>>("/api/users/current");
      return response;
    },
  });
}
