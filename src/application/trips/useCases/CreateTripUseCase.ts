import { Reading } from '@/domain/trip/model/Reading'
import { Trip } from '@/domain/trip/model/Trip'
import { AddressRepository } from '@/infrastructure/address/AddressRepository'
import { TripMapper } from '@/infrastructure/trip/TripMapper'
import { TripRepository } from '@/infrastructure/trip/TripRepository'
import { inject, injectable } from 'inversify'

@injectable()
export class CreateTripUseCase {
  constructor(
    @inject(TripRepository) private readonly tripRepository: TripRepository,
    @inject(AddressRepository) private readonly addressRepository: AddressRepository,
    @inject(TripMapper) private readonly tripMapper: TripMapper
  ) {}

  async execute(request: { readings: Reading[] }): Promise<Trip> {
    const coordinates = request.readings.map((reading) => ({
      lon: reading.location.lon,
      lat: reading.location.lat
    }))

    const addresses = await this.addressRepository.getAllByCoordinates(coordinates)

    const readings = request.readings.map((reading, index) => ({
      ...reading,
      address: addresses[index].formattedAddress
    }))

    const created = await this.tripRepository.create(readings)

    return this.tripMapper.toModel(created)
  }
}
