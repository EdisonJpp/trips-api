import { Container } from 'inversify'
import { infrastuctureContainer } from './infrastructure/Container'
import { presentationContainer } from './presentation/Container'
import { applicationContainer } from './application/Container'

let counter = 0

function initializeContainer() {
  const container = new Container()

  if (counter === 0) {
    presentationContainer(container)
    infrastuctureContainer(container)
    applicationContainer(container)
  }

  counter++

  return container
}

export const container = initializeContainer()
