"use client";

import { useRef, useState } from "react";
import { FileText, Loader2, Paperclip, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUploadFile } from "@/hooks/files/use-upload-file";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export type AttachmentItem = {
  id?: string;
  fileId: string;
  name?: string;
  url?: string;
  size?: number;
};

interface AttachmentInputProps {
  value?: AttachmentItem[];
  onChange?: (val: AttachmentItem[]) => void;
  onRemove?: (item: AttachmentItem) => void;
}

export function AttachmentInput({ value = [], onChange, onRemove }: AttachmentInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mutateAsync: uploadFile } = useUploadFile();
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      const newItems: AttachmentItem[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const res = await uploadFile({ file, directory: "transactions" });
        if (res.data?.id) {
          newItems.push({
            fileId: res.data.id,
            name: res.data.name || file.name,
            size: res.data.size || file.size,
            url: res.data.url,
          });
        }
      }
      onChange?.([...value, ...newItems]);
    } catch (err) {
      console.error("Failed to upload attachments", err);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemove = (index: number) => {
    const itemToRemove = value[index];
    const newValues = [...value];
    newValues.splice(index, 1);
    onChange?.(newValues);
    if (onRemove) onRemove(itemToRemove);
  };

  return (
    <div className="space-y-4">
      <div
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={cn(
          "border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-muted-foreground transition-colors",
          isUploading
            ? "opacity-50 cursor-not-allowed bg-muted/30"
            : "cursor-pointer hover:bg-muted/50 hover:text-foreground hover:border-primary/50"
        )}
      >
        <input
          type="file"
          multiple
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
          accept="image/*,application/pdf,.doc,.docx,.xls,.xlsx"
        />
        {isUploading ? (
          <Loader2 className="size-6 mb-2 animate-spin text-primary" />
        ) : (
          <Paperclip className="size-6 mb-2 opacity-50" />
        )}
        <p className="text-sm font-medium text-foreground">
          {isUploading ? "Mengunggah..." : "Klik untuk mengunggah atau seret file ke sini"}
        </p>
        <p className="text-xs opacity-70 mt-1">Mendukung PDF, Word, Excel, dan Gambar</p>
      </div>

      {value.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {value.map((item, idx) => {
            const imageExtensions = ["png", "jpg", "jpeg", "gif", "webp"];
            const ext = (item.name || item.url || "").split(".").pop();
            const isImage = imageExtensions.includes(ext?.toLowerCase() || "");

            return (
              <div
                key={item.fileId + idx}
                className="relative flex items-center gap-3 p-3 border rounded-lg bg-background hover:bg-muted/50 transition-colors h-20 overflow-hidden group"
              >
                {isImage && item.url ? (
                  <div className="h-full aspect-square rounded-md overflow-hidden shrink-0 border bg-muted/20">
                    <img
                      src={item.url}
                      alt={item.name || "Gambar Lampiran"}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                ) : (
                  <div className="p-2 bg-primary/10 text-primary rounded-md shrink-0">
                    <FileText className="size-5" />
                  </div>
                )}

                <div className="overflow-hidden flex-1">
                  {item.url ? (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="block text-sm font-medium truncate hover:underline text-foreground"
                    >
                      {item.name || (isImage ? "Gambar Lampiran" : "File Lampiran")}
                    </a>
                  ) : (
                    <p className="text-sm font-medium truncate text-foreground">
                      {item.name || (isImage ? "Gambar Lampiran" : "File Lampiran")}
                    </p>
                  )}
                  {!!item.size && (
                    <p className="text-xs text-muted-foreground">
                      {(item.size / 1024).toFixed(2)} KB
                    </p>
                  )}
                </div>

                <div className="shrink-0 bg-background/80 backdrop-blur-sm rounded-md">
                  <TooltipProvider delayDuration={0}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
                          onClick={() => handleRemove(idx)}
                          disabled={isUploading}
                          type="button"
                        >
                          <X className="size-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Hapus lampiran</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
