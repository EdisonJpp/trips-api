import { Container } from 'inversify'
import { ErrorHandlerMiddleware } from './middleware/ErrorHandlerMiddleware'
import router from './http/Router'

export function presentationContainer(container: Container) {
  middlewares(container)
  routers(container)
}

function routers(container: Container) {
  container.bind('HTTP_ROUTER').toConstantValue(router)
}

function middlewares(container: Container) {
  container.bind<ErrorHandlerMiddleware>(ErrorHandlerMiddleware).toSelf()
}
