export type PaginatedParams = {
  page?: number;
  limit?: number;
  sort?: string;
  dir?: string;
  status?: string;
  search?: string;
};

export type PaginatedResponse<T> = {
  ok: boolean;
  message: string;
  data: T[];
  empty: boolean;
  pagination: {
    total: number;
    page: number;
    from: number;
    to: number;
    [key: string]: any;
  };
};

export type BaseResponse<T> = {
  ok: boolean;
  message: string;
  data?: T;
};

export type BadRequestDetail<T> = {
  field: keyof T;
  message: string;
  source?: "body" | "query" | "path";
};

export type ErrorResponse<T> = {
  ok: boolean;
  message: string;
  details?: BadRequestDetail<T>[];
};

export class AppError<T> extends Error {
  ok = false;
  code?: number;
  details?: BadRequestDetail<T>[];
  constructor(p: {
    message: string;
    code?: number;
    name?: string;
    details?: BadRequestDetail<T>[];
  }) {
    super(p.message);
    this.name = p.name ?? "AppError";
    this.code = p.code;
    this.details = p.details;
  }
}

export type GlobalResponse<T> = BaseResponse<T> | ErrorResponse<T> | PaginatedResponse<T>;
