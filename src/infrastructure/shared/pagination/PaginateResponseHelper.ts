import { PaginationResponseDto } from './dto/PaginationResponseDto'
import { PaginationRequestDto } from './dto/PaginationRequestDto'

export class Pagination {
  /**
   * Return pagination response
   * @param PaginationRequestDto {PaginationRequestDto}
   * @param totalRecords {number}
   * @param dtos {t[]}
   * @returns {PaginationResponseDto}
   */
  static of<T>({ perPage, page }: PaginationRequestDto, totalRecords: number, dtos: T[]): PaginationResponseDto<T> {
    const totalPages = Math.floor(totalRecords / perPage) + (totalRecords % perPage > 0 ? 1 : 0)
    const currentPage = +page > 0 ? +page : 1
    const hasNext = currentPage <= totalPages - 1

    return {
      page: currentPage,
      perPage: perPage,
      totalPages: totalPages,
      payloadSize: dtos.length,
      hasNext: hasNext,
      totalRecords: totalRecords,
      content: dtos
    }
  }
}
