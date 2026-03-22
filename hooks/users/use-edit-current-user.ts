import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { EditCurrentUserSchemaType } from "@/app/forms/edit-current-user-schema";

export function useEditCurrentUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: EditCurrentUserSchemaType) => {
      const response = await fetch("/api/users/current", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData?.meta?.message || "Failed to update profile");
      }

      return responseData;
    },
    onSuccess: async () => {
      toast.success("Profil berhasil diperbarui");
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Gagal memperbarui profil");
    },
  });
}
