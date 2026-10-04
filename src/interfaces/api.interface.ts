export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiFieldError {
  field: string;
  message: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  statusCode?: number;
  message: string;
  data: T;
  meta?: PaginationMeta;
  errors?: ApiFieldError[];
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface AdminStats {
  totalUsers: number;
  totalEvents: number;
  totalParticipations: number;
  totalPayments: number;
  revenue?: number;
}
