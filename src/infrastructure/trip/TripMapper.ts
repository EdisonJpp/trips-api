import { ITripMapper } from '@/domain/trip/mapper/ITripMapper'
import { Trip, TripBoundingBox, TripReading } from '@/domain/trip/model/Trip'
import { ReadingDocument, TripDocument } from '../config/database/trip/document/TripDocument'
import { WithId } from 'mongodb'
import { injectable } from 'inversify'

const limitCountOverSpeeds = 3

@injectable()
export class TripMapper implements ITripMapper {
  toModel(trip: WithId<TripDocument>): Trip {
    const values = trip.readings.reduce(
      (acc, reading) => {
        acc.duration += reading.time
        acc.distance += ((reading.speed * reading.time) / (1000 * 60)) % 60

        acc.boundingBox.push({
          lon: reading.location.lon,
          lat: reading.location.lat
        })

        return acc
      },
      {
        duration: 0,
        distance: 0,
        overspeedsCount: 0,
        boundingBox: [] as TripBoundingBox[]
      }
    )

    const overspeedsCount =
      trip.readings.filter((reading) => reading.speed > reading.speedLimit).length / limitCountOverSpeeds

    values.overspeedsCount = Math.floor(overspeedsCount)

    const start = trip.readings.at(0) as ReadingDocument
    const end = trip.readings.at(-1) as ReadingDocument

    return new Trip(
      trip._id.toString(),
      parseFloat(values.distance.toFixed(2)),
      values.duration,
      values.overspeedsCount,
      values.boundingBox,
      this.toReading(start),
      this.toReading(end)
    )
  }

  private toReading(reading: ReadingDocument): TripReading {
    return new TripReading(reading.time, reading.location.lat, reading.location.lon, reading.address)
  }
}
