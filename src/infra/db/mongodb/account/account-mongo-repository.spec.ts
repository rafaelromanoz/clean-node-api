import { Collection } from 'mongodb'
import env from '../../../../main/config/env'
import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account-mongo-repository'

let accountCollection: Collection

describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(env.mongoUrl)
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  const makeSut = (): AccountMongoRepository => {
    return new AccountMongoRepository()
  }
  test('Should return an account on add success', async () => {
    const sut = makeSut()
    const account = await sut.add({
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    })
    expect(account).toBeTruthy()
    expect(account?.id).toBeTruthy()
    expect(account?.name).toBe('valid_name')
    expect(account?.email).toBe('valid_email')
    expect(account?.password).toBe('valid_password')
  })

  test('Should return an account on load by email success', async () => {
    const sut = makeSut()
    await accountCollection.insertOne({
      name: 'valid_name',
      email: 'any_email@mail.com',
      password: 'valid_password'
    })
    const account = await sut.loadByEmail('any_email@mail.com')
    expect(account).toBeTruthy()
    expect(account?.id).toBeTruthy()
    expect(account?.name).toBe('valid_name')
    expect(account?.email).toBe('any_email@mail.com')
    expect(account?.password).toBe('valid_password')
  })

  test('Should return null if dont found user by email', async () => {
    const sut = makeSut()
    const account = await sut.loadByEmail('any_email@mail.com')
    expect(account).toBeFalsy()
  })

  test('Should update the account accessToken on updateAccessToken success', async () => {
    const sut = makeSut()
    const result = await accountCollection.insertOne({
      name: 'valid_name',
      email: 'any_email@mail.com',
      password: 'valid_password'
    })
    await sut.updateAccessToken(result.insertedId.toString(), 'any_token')
    const account = await accountCollection.findOne({ _id: result.insertedId })
    expect(account).toBeTruthy()
    expect(account?.accessToken).toBe('any_token')
  })

  describe('loadByToken()', () => {
    test('Should return an account on loadByToken without role', async () => {
      const sut = makeSut()
      await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        accessToken: 'any_token'
      })
      const account = await sut.loadByToken('any_token')
      expect(account).toBeTruthy()
      expect(account?.id).toBeTruthy()
      expect(account?.name).toBe('any_name')
      expect(account?.email).toBe('any_email@mail.com')
      expect(account?.password).toBe('any_password')
    })

    test('Should return an account on loadByToken with role', async () => {
      const sut = makeSut()
      await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        accessToken: 'any_token',
        role: 'any_role'
      })
      const account = await sut.loadByToken('any_token', 'any_role')
      expect(account).toBeTruthy()
      expect(account?.id).toBeTruthy()
      expect(account?.name).toBe('any_name')
      expect(account?.email).toBe('any_email@mail.com')
      expect(account?.password).toBe('any_password')
    })

    test('Should return null if dont found user by token', async () => {
      const sut = makeSut()
      const account = await sut.loadByToken('any_token')
      expect(account).toBeFalsy()
    })
  })
})
