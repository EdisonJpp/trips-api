import { Router } from 'express'
import TripsController from '@/presentation/http/trip/TripsController'
import { validationMiddleware } from '@/presentation/middleware/ValidationMiddleware'
import { CreateTripDto } from './dto/CreateTripDto'

const tripRouter = Router()

tripRouter.get('/trips', TripsController.getTrips)
tripRouter.post('/trips', validationMiddleware<CreateTripDto>(CreateTripDto), TripsController.createTrip)

export default tripRouter
