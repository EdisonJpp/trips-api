import { Container } from 'inversify'
import { GetTripsUseCase } from './trips/useCases/GetTripsUseCase'
import { CreateTripUseCase } from './trips/useCases/CreateTripUseCase'

export function applicationContainer(container: Container) {
  useCases(container)
}

function useCases(container: Container) {
  container.bind<GetTripsUseCase>(GetTripsUseCase).toSelf()
  container.bind<CreateTripUseCase>(CreateTripUseCase).toSelf()
}
