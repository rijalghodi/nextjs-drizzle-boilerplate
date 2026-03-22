import { useMutation } from "@tanstack/react-query";
import { FileResponse } from "@/types/file.type";
import { BaseResponse, ErrorResponse } from "@/types/response";
import { apiFetch } from "@/lib/api";

export type UploadFilePayload = {
  file: File;
  directory?: string;
};

export const useUploadFile = () => {
  return useMutation<BaseResponse<FileResponse>, ErrorResponse<FileResponse>, UploadFilePayload>({
    mutationFn: async ({ file, directory }: UploadFilePayload) => {
      const formData = new FormData();
      formData.append("file", file);
      if (directory) {
        formData.append("directory", directory);
      }

      // We do NOT set Content-Type header here because when using FormData,
      // the browser automatically sets it to multipart/form-data along with the needed boundary.
      return apiFetch<BaseResponse<FileResponse>>("/api/files", {
        method: "POST",
        body: formData,
      });
    },
  });
};
