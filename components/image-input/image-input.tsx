"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ChangeEvent, DragEvent, FC, useCallback, useRef, useState } from "react";
import { getAcceptTypeString, getBase64 } from "./utils";

interface ImageInputFile {
  dataURL?: string;
  file?: File;
  [key: string]: any;
}

type ImageInputFiles = ImageInputFile[];

interface ImageInputProps {
  /**
   * UUID of an existing file in the database (or undefined if no file selected).
   */
  value?: string;

  /**
   * Called with the new UUID after a successful upload.
   * Pass "" or call with nothing to clear.
   */
  onChange?: (id: string) => void;

  /**
   * Required. Performs the actual file upload and returns the UUID of the created file.
   */
  onUpload: (file: File) => Promise<string>;

  children?: (props: ImageInputExport) => React.ReactNode;
  multiple?: boolean;
  acceptType?: string[];
  inputProps?: React.HTMLProps<HTMLInputElement>;
}

interface ImageInputExport {
  /** Base64 data URL for optimistic preview while uploading. Undefined when not uploading. */
  previewUrl: string | undefined;
  isUploading: boolean;
  onImageUpload: () => void;
  onImageRemove: () => void;
  isDragging: boolean;
  dragProps: {
    onDrop: (e: any) => void;
    onDragEnter: (e: any) => void;
    onDragLeave: (e: any) => void;
    onDragOver: (e: any) => void;
    onDragStart: (e: any) => void;
  };
}

const ImageInput: FC<ImageInputProps> = ({
  value,
  acceptType,
  inputProps,
  children,
  onChange,
  onUpload,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const handleClickInput = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const onImageUpload = useCallback(() => {
    handleClickInput();
  }, [handleClickInput]);

  const onImageRemove = useCallback(() => {
    setPreviewUrl(undefined);
    onChange?.("");
  }, [onChange]);

  const handleFile = async (file: File) => {
    try {
      // 1. Generate optimistic base64 preview immediately
      const base64 = await getBase64(file);
      setPreviewUrl(base64);
      setIsUploading(true);

      // 2. Perform actual upload, receive UUID
      const uuid = await onUpload(file);

      // 3. Notify parent about new UUID
      onChange?.(uuid);
    } catch (err) {
      console.error("ImageInput upload failed:", err);
    } finally {
      setIsUploading(false);
      setPreviewUrl(undefined);
    }
  };

  const onInputChange = async (e: ChangeEvent<HTMLInputElement>): Promise<void> => {
    const files = e.target.files;
    if (files && files[0]) {
      await handleFile(files[0]);
    }
    // Reset input so the same file can be selected again
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragIn = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  };

  const handleDragOut = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleDragStart = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.clearData();
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={getAcceptTypeString(acceptType)}
        onChange={onInputChange}
        style={{ display: "none" }}
        {...inputProps}
      />
      {children?.({
        previewUrl,
        isUploading,
        onImageUpload,
        onImageRemove,
        dragProps: {
          onDrop: handleDrop,
          onDragEnter: handleDragIn,
          onDragLeave: handleDragOut,
          onDragOver: handleDrag,
          onDragStart: handleDragStart,
        },
        isDragging,
      })}
    </>
  );
};

export { ImageInput, type ImageInputFile, type ImageInputFiles, type ImageInputProps };
