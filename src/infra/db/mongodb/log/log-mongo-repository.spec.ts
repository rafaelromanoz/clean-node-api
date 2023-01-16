import { Collection } from 'mongodb'
import env from '@/main/config/env'
import { MongoHelper } from '../helpers/mongo-helper'
import { LogMongoRepository } from './log-mongo-repository'

const makeSut = (): LogMongoRepository => new LogMongoRepository()

describe('Log Mongo Repository', () => {
  let errorCollection: Collection
  beforeAll(async () => {
    await MongoHelper.connect(env.mongoUrl)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    errorCollection = await MongoHelper.getCollection('errors')
    await errorCollection.deleteMany({})
  })

  test('Should create an error log on sucess', async () => {
    const sut = makeSut()
    await sut.log('any_error')
    const count = await errorCollection.countDocuments()
    expect(count).toBe(1)
  })
})
