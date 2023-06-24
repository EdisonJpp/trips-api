import { DatabaseClient } from '../DatabaseClient'
import { MongoError } from 'mongodb'
import { DatabaseErrorHandlers } from '../DatabaseException'

export const TRIPS_DATABASE = 'trips'
const databaseUrl = 'mongodb://mongodb:27017/trips'

export class TripsDatabase extends DatabaseClient {
  public async init() {
    try {
      const db = await this.connect(databaseUrl)
      console.log('Connected successfully to database', db.namespace)

      return db
    } catch (error) {
      if (error instanceof MongoError) {
        DatabaseErrorHandlers.handleError(error)
      }

      throw error
    }
  }
}
