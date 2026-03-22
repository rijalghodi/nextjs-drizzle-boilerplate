import { useQuery } from "@tanstack/react-query";
import { FileResponse } from "@/types/file.type";
import { BaseResponse } from "@/types/response";

export function useFile(fileId: string | undefined) {
  return useQuery<FileResponse>({
    queryKey: ["file", fileId],
    enabled: !!fileId,
    queryFn: async () => {
      const response = await fetch(`/api/files/${fileId}`);

      if (!response.ok) {
        throw new Error("Failed to fetch file");
      }

      const data: BaseResponse<FileResponse> = await response.json();
      return data.data!;
    },
  });
}
