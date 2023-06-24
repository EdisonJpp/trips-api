import { Request, Response } from 'express'
import { container } from '@/inversify.config'
import { GetTripsRequest, GetTripsUseCase } from '@/application/trips/useCases/GetTripsUseCase'
import { CreateTripUseCase } from '@/application/trips/useCases/CreateTripUseCase'
import { AddressNotFoundException } from '@/domain/address/exception/AddressNotFoundException'

async function getTrips(request: Request<unknown, unknown, GetTripsUseCase>, res: Response) {
  const { start_gte, start_lte, ...others } = request.query

  if (start_gte && start_lte && Number(start_gte) > Number(start_lte)) {
    res.status(400).json({ error: 'start_gte must be less than start_lte' })
    return
  }

  const getTripsUseCase = container.get(GetTripsUseCase)
  const item = await getTripsUseCase.execute(
    new GetTripsRequest(
      Number(start_gte),
      Number(start_lte),
      Number(others.distance_gte),
      Number(others.limit),
      Number(others.offset)
    )
  )

  res.status(200).json(item)
}

async function createTrip(request: Request, res: Response) {
  try {
    const createTripUseCase = container.get(CreateTripUseCase)
    const item = await createTripUseCase.execute(request.body)

    res.status(200).json(item)
  } catch (error) {
    if (error instanceof AddressNotFoundException) {
      res.status(404).json({ error: error.message })
      return
    }

    throw error
  }
}

export default { getTrips, createTrip }
