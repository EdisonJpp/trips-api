import { injectable } from 'inversify'
import { MongoClient, Db, MongoOptions } from 'mongodb'

@injectable()
export class DatabaseClient {
  private client: MongoClient | undefined

  public async connect(url: string, options?: MongoOptions): Promise<Db> {
    const mongoClient = await MongoClient.connect(url, options)
    this.client = mongoClient
    return mongoClient.db()
  }

  public close(): void {
    if (this.client) {
      this.client.close()
    }
  }
}
