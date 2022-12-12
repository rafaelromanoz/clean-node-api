import { Collection, MongoClient } from 'mongodb'
import { AccountModel } from '../../../../domain/models/account'

export const MongoHelper = {
  client: null as unknown as MongoClient,
  uri: null as unknown as string,
  async connect (uri: string): Promise<void> {
    this.uri = uri
    this.client = await MongoClient.connect(uri)
  },
  async disconnect () {
    await this.client.close()
  },
  async getCollection (name: string): Promise<Collection> {
    await this.connect(this.uri)
    return this.client.db().collection(name)
  },
  map (accountData: any, accountId: string): AccountModel {
    return {
      email: accountData.email,
      id: accountId,
      name: accountData.name,
      password: accountData.password
    }
  }
}
