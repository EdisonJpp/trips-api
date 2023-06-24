import { inject, injectable } from 'inversify'
import { Pagination, PaginationResponseDto, paginate } from '../shared/pagination'
import { DatabaseErrorHandlers } from '../config/database/DatabaseException'
import { Collection, MongoError, ObjectId, WithId } from 'mongodb'
import { IGetTripsRequest } from '@/domain/trip/repository/IRequest'
import { TRIPS_COLLECTION } from '../config/database/trip/collection/TripCollection'
import { ReadingDocument, TripDocument } from '../config/database/trip/document/TripDocument'
import { ITripRepository } from '@/domain/trip/repository/ITripRepository'

@injectable()
export class TripRepository implements ITripRepository {
  constructor(@inject(TRIPS_COLLECTION) private readonly tripsCollection: Collection<TripDocument>) {}

  public async getTrips(param?: IGetTripsRequest): Promise<PaginationResponseDto<WithId<TripDocument>>> {
    try {
      const filters = param ? this.applyFilters(param) : {}

      const trips = this.tripsCollection.find(filters)
      const total = await this.tripsCollection.countDocuments()

      const [docs, paginationOptions] = await paginate(trips, {
        perPage: Number(param?.offset),
        page: Number(param?.limit)
      })

      return Pagination.of<WithId<TripDocument>>(paginationOptions, total, docs)
    } catch (error) {
      if (error instanceof MongoError) {
        DatabaseErrorHandlers.handleError(error)
      }

      throw error
    }
  }

  async create(rawReadings: ReadingDocument[]): Promise<WithId<TripDocument>> {
    try {
      const readings = rawReadings.sort((a, b) => a.time - b.time)
      const distance = parseFloat(
        readings.reduce((acc, curr) => acc + (((curr.speed * curr.time) / (1000 * 60)) % 60), 0).toFixed(2)
      )

      const tripDocument = await this.tripsCollection.insertOne({ readings, distance })

      return { distance, readings, _id: new ObjectId(tripDocument.insertedId.toString()) }
    } catch (error) {
      if (error instanceof MongoError) {
        DatabaseErrorHandlers.handleError(error)
      }

      throw error
    }
  }

  private applyFilters(param: IGetTripsRequest) {
    const { start_gte, start_lte, distance_gte } = param

    const filters = {} as Record<string, number | string | Record<string, number>>

    if (start_gte && !start_lte) {
      filters['readings.time'] = {
        $gte: start_gte
      }
    } else if (!start_gte && start_lte) {
      filters['readings.time'] = {
        $lte: start_lte
      }
    } else if (start_gte && start_lte) {
      filters['readings.time'] = {
        $gte: start_gte,
        $lte: start_lte
      }
    }

    if (distance_gte) {
      filters['distance'] = { $gte: distance_gte }
    }

    return filters
  }
}
