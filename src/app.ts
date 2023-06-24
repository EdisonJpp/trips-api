import 'reflect-metadata'
import express, { Router } from 'express'
import { container } from './inversify.config'
import { ErrorHandlerMiddleware } from './presentation/middleware/ErrorHandlerMiddleware'
import { databaseContainer } from '@/infrastructure/config/database/Container'
import bodyParser from 'body-parser'

async function application() {
  await databaseContainer(container)

  const errorHandler = container.get(ErrorHandlerMiddleware)
  const router = container.get('HTTP_ROUTER') as Router
  const app = express()
  const port = process.env.PORT ?? 5000

  app.use(bodyParser.json())
  app.use(router)
  app.use(errorHandler.handle)

  app.listen(port, () => {
    console.log(`listening server on port ${port}`)
  })
}

application()
  .then(() => {
    console.log('Application started')
  })
  .catch((error) => {
    console.log('Application failed to start')
    console.log(error)
  })
