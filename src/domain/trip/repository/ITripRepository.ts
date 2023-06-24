import { PaginationResponseDto } from '@/infrastructure/shared/pagination'
import { IGetTripsRequest } from '@/domain/trip/repository/IRequest'
import { ReadingDocument, TripDocument } from '@/infrastructure/config/database/trip/document/TripDocument'

export interface ITripRepository {
  create(readings: ReadingDocument[]): Promise<TripDocument>
  getTrips(params: IGetTripsRequest): Promise<PaginationResponseDto<TripDocument>>
}
