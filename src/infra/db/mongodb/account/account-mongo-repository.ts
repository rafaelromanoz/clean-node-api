import { LoadAccountByTokenRepository } from './../../../../data/protocols/db/account/load-account-by-token-repository'
import { LoadAccountByEmailRepository } from '../../../../data/protocols/db/account/load-account-by-email-repository'
import { AddAccountRepository } from '../../../../data/protocols/db/account/add-account-repository'
import { AccountModel } from '../../../../domain/models/account'
import { AddAccountModel } from '../../../../domain/usecases/addaccount/add-account'
import { MongoHelper } from '../helpers/mongo-helper'
import { ObjectId } from 'mongodb'
import { UpdateAccessTokenRepository } from '../../../../data/protocols/db/account/update-access-token-repository'

export class AccountMongoRepository implements
  AddAccountRepository,
  LoadAccountByEmailRepository,
  UpdateAccessTokenRepository,
  LoadAccountByTokenRepository {
  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const result = await accountCollection.insertOne(accountData)
    const accountId = result.insertedId.toString()
    return MongoHelper.map(accountData, accountId)
  }

  async loadByEmail (email: string): Promise<AccountModel | null> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const account = await accountCollection.findOne({ email })
    if (account) {
      const id = new ObjectId(account?._id).toString()
      return MongoHelper.map(account, id)
    }
    return null
  }

  async updateAccessToken (id: string, token: string): Promise<void> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.updateOne({
      _id: new ObjectId(id)
    }, {
      $set: {
        accessToken: token
      }
    })
  }

  async loadByToken (token: string, role?: string): Promise<AccountModel | null> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const account = await accountCollection.findOne({
      accessToken: token,
      role
    })
    if (account) {
      const id = new ObjectId(account?._id).toString()
      return MongoHelper.map(account, id)
    }
    return null
  }
}
