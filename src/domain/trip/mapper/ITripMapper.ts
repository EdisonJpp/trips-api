import { TripDocument } from '@/infrastructure/config/database/trip/document/TripDocument'
import { Trip } from '@/domain/trip/model/Trip'

export interface ITripMapper {
  toModel(trip: TripDocument): Trip
}
