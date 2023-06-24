export interface PaginationResponseDto<T> {
  page: number
  perPage: number
  totalPages: number
  hasNext: boolean
  content: T[]
  payloadSize: number
  totalRecords: number
}
