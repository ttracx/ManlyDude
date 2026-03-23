/** Standard API success response */
export interface ApiResponse<T> {
  data: T;
  error: null;
}

/** Standard API error response */
export interface ApiErrorResponse {
  data: null;
  error: ApiError;
}

/** API error details */
export interface ApiError {
  message: string;
  code: string;
  status: number;
}

/** Paginated API response */
export interface PaginatedResponse<T> {
  data: T[];
  error: null;
  pagination: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}

/** Union type for API responses */
export type ApiResult<T> = ApiResponse<T> | ApiErrorResponse;
