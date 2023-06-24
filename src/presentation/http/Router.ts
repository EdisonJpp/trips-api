import { Router } from 'express'
import tripRouter from '@/presentation/http/trip/TripRouter'

const router = Router()

router.use(tripRouter)

export default router
