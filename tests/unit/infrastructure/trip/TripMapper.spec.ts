import 'reflect-metadata'

import { WithId } from 'mongodb'
import { mock } from 'jest-mock-extended'
import { TripMapper } from '@/infrastructure/trip/TripMapper'
import { TripDocument } from '@/infrastructure/config/database/trip/document/TripDocument'
import { Trip } from '@/domain/trip/model/Trip'

describe('TripMapper', () => {
  let tripMapper: TripMapper
  let trip: WithId<TripDocument>

  beforeEach(() => {
    tripMapper = new TripMapper()

    trip = mock<WithId<TripDocument>>({
      _id: {
        toString: () => '123'
      },
      readings: [
        {
          time: 1000,
          speed: 100,
          speedLimit: 80,
          address: 'address',
          location: {
            lat: 1,
            lon: 1
          }
        }
      ]
    })
  })

  describe('toModel', () => {
    it('should return a Trip', () => {
      expect(tripMapper.toModel(trip)).toBeInstanceOf(Trip)
    })

    it('should map correct values', () => {
      const model = tripMapper.toModel(trip)

      expect(model.id).toBe(trip._id.toString())
    })
  })
})
