import { PaginationRequestDto } from './dto/PaginationRequestDto'
import type { FindCursor } from 'mongodb'

export const initialPaginate = {
  perPage: 10,
  page: 0
}

const maxAllowedSize = 20

export const defaultPagination = {
  defaultPerPage: maxAllowedSize,
  defaultPage: 0,
  defaultSkip: 0
}

export async function paginate<T>(
  query: FindCursor<T>,
  paginateOption: PaginationRequestDto = initialPaginate
): Promise<
  [
    T[],
    {
      perPage: number
      page: number
      skip: number
    }
  ]
> {
  const values = Object.keys(paginateOption || {}).length === 0 ? { perPage: maxAllowedSize, page: 1 } : paginateOption

  const { defaultPage, defaultPerPage, defaultSkip } = defaultPagination

  let { perPage, page } = values

  if (perPage > defaultPerPage) perPage = defaultPerPage
  if (perPage === 0) perPage = defaultPerPage

  if (!!page) page = defaultPage

  let skip = 0

  perPage = +(perPage && perPage > 0 ? +perPage : defaultPerPage)

  if (page) {
    skip = (+page - 1) * perPage
    skip = skip >= defaultSkip ? skip : defaultSkip
  } else {
    page = defaultPage
    skip = defaultSkip
  }

  perPage = perPage < +maxAllowedSize ? perPage : maxAllowedSize

  const docs = await query.skip(skip).limit(perPage).toArray()

  return [docs, { perPage, page, skip }]
}
