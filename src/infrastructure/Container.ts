import { Container } from 'inversify'
import { TripRepository } from './trip/TripRepository'
import { AddressRepository } from './address/AddressRepository'
import { AddressApiClient } from './address/AddressApiClient'
import { AddressMapper } from './address/AddressMapper'
import { TripMapper } from './trip/TripMapper'

export function infrastuctureContainer(container: Container) {
  apiClients(container)
  mappers(container)
  repositories(container)
}

function apiClients(container: Container) {
  container.bind<AddressApiClient>(AddressApiClient).toSelf()
}

function mappers(container: Container) {
  container.bind<AddressMapper>(AddressMapper).toSelf()
  container.bind<TripMapper>(TripMapper).toSelf()
}

function repositories(container: Container) {
  container.bind<TripRepository>(TripRepository).toSelf()
  container.bind<AddressRepository>(AddressRepository).toSelf()
}
