import 'reflect-metadata'

import { TripDocument } from '@/infrastructure/config/database/trip/document/TripDocument'
import { TripRepository } from '@/infrastructure/trip/TripRepository'
import { MockProxy, mock } from 'jest-mock-extended'
import { Collection, WithId } from 'mongodb'

describe('TripRepository', () => {
  let tripRepository: TripRepository
  let tripsCollection: Collection<TripDocument>

  let trips: WithId<TripDocument>[]
  let trip: MockProxy<WithId<TripDocument>>

  beforeEach(() => {
    trip = mock<WithId<TripDocument>>({
      _id: {
        toString: () => '64969d9b9f4ed09a88a9af09'
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

    trips = mock<WithId<TripDocument>[]>([trip])

    tripsCollection = {
      insertOne: jest.fn().mockResolvedValue({
        insertedId: trip._id.toString()
      }),
      countDocuments: jest.fn().mockResolvedValue(trips.length),
      find: jest.fn().mockReturnValue({
        skip: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            toArray: jest.fn().mockResolvedValue(trips)
          })
        })
      })
    } as unknown as Collection<TripDocument>

    tripRepository = new TripRepository(tripsCollection)
  })

  describe('getTrips', () => {
    it('should call tripsCollection.countDocuments', async () => {
      await tripRepository.getTrips()

      expect(tripsCollection.countDocuments).toHaveBeenCalled()
    })

    it('should call tripsCollection.find', async () => {
      await tripRepository.getTrips()

      expect(tripsCollection.find).toHaveBeenCalled()
    })

    it('should return a PaginationResponseDto', async () => {
      const result = await tripRepository.getTrips()

      expect(result).toHaveProperty('content')
      expect(result).toHaveProperty('perPage')
      expect(result).toHaveProperty('page')
      expect(result).toHaveProperty('content')
      expect(result).toHaveProperty('payloadSize')
      expect(result).toHaveProperty('totalRecords')
      expect(result).toHaveProperty('hasNext')
      expect(result).toHaveProperty('totalPages')
    })
  })

  describe('createTrip', () => {
    it('should call tripsCollection.insertOne', async () => {
      await tripRepository.create(trip.readings)

      expect(tripsCollection.insertOne).toHaveBeenCalled()
    })

    it('should return a TripDocument with the correct values', async () => {
      const result = await tripRepository.create(trip.readings)

      expect(result.readings).toEqual(trip.readings)
      expect(result._id.toString()).toEqual(trip._id.toString())
    })
  })
})
