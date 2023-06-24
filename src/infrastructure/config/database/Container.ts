import { Container } from 'inversify'
import { TRIPS_DATABASE, TripsDatabase } from './trip/TripsDatabase'
import { TRIPS_COLLECTION, TripsCollection } from './trip/collection/TripCollection'

export async function databaseContainer(container: Container) {
  await tripsDatabase(container)
}

async function tripsDatabase(container: Container) {
  const tripsDatabase = new TripsDatabase()
  const db = await tripsDatabase.init()

  container.bind(TRIPS_DATABASE).toConstantValue(db)

  const tripsCollection = new TripsCollection()
  await tripsCollection.init(db)

  container.bind(TRIPS_COLLECTION).toConstantValue(tripsCollection.collection)
}
