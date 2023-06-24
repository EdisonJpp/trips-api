import { Collection, Db, MongoError } from 'mongodb'
import { DatabaseErrorHandlers } from '../../DatabaseException'
import { TripDocument } from '../document/TripDocument'

export const TRIPS_COLLECTION = 'c_trips'
export const REQUIRED_FIELDS = ['readings', 'distance']

export class TripsCollection {
  private _collection!: Collection<TripDocument>

  public async init(db: Db): Promise<void> {
    try {
      this._collection = db.collection(TRIPS_COLLECTION) as Collection<TripDocument>
    } catch (error) {
      if (error instanceof MongoError) {
        DatabaseErrorHandlers.handleError(error)
      }

      throw error
    }
  }

  get collection(): Collection<TripDocument> {
    return this._collection
  }
}
