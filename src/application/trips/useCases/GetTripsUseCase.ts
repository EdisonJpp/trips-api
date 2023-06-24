import { TripMapper } from '@/infrastructure/trip/TripMapper'
import { TripRepository } from '@/infrastructure/trip/TripRepository'
import { inject, injectable } from 'inversify'

export class GetTripsRequest {
  constructor(
    public readonly start_gte: number,
    public readonly start_lte: number,
    public readonly distance_gte: number,
    public readonly limit: number,
    public readonly offset: number
  ) {}
}

@injectable()
export class GetTripsUseCase {
  constructor(
    @inject(TripRepository) private readonly tripRepository: TripRepository,
    @inject(TripMapper) private readonly tripMapper: TripMapper
  ) {}

  async execute(request?: GetTripsRequest) {
    const item = await this.tripRepository.getTrips(request)

    return {
      ...item,
      content: item.content.map((trip) => this.tripMapper.toModel(trip))
    }
  }
}
