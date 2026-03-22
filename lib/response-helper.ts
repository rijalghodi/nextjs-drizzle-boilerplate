import { ZodIssue } from "zod";
import { BadRequestDetail, BaseResponse, ErrorResponse, PaginatedResponse } from "@/types/response";

export function toPaginatedResponse<T>({
  ok = true,
  message = "Success",
  data = [],
  empty = true,
  pagination = {
    total: 0,
    page: 1,
    from: 0,
    to: 0,
  },
}: Partial<PaginatedResponse<T>>): PaginatedResponse<T> {
  return {
    ok,
    message,
    data,
    empty,
    pagination,
  };
}

export function toErrorResponse<T>({
  ok = false,
  message = "Error happened",
  details,
}: Partial<ErrorResponse<T>>): ErrorResponse<T> {
  return {
    ok,
    message,
    details,
  };
}

export function zodIssueToErrorDetail<T>(
  issue: ZodIssue,
  source?: "body" | "query" | "path"
): BadRequestDetail<T> {
  return {
    field: issue.path.join(".") as keyof T,
    message: issue.message,
    source: source ?? "body",
  };
}

export function zodIssuesToErrorDetails<T>(
  issues: ZodIssue[],
  source?: "body" | "query" | "path"
): BadRequestDetail<T>[] {
  return issues.map((issue) => zodIssueToErrorDetail(issue, source));
}

export function toBaseResponse<T>({
  ok = true,
  message = "Success",
  data,
}: Partial<BaseResponse<T>>): BaseResponse<T> {
  return {
    ok,
    message,
    data,
  };
}

export const UNAUTHORIZED_MESSAGE = "Silakan login terlebih dahulu";
export const FORBIDDEN_MESSAGE = "Anda tidak memiliki akses";
export const BAD_REQUEST_MESSAGE = "Input tidak valid";
