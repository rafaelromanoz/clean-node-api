import { Collection } from 'mongodb'
import request from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import app from '../config/app'
import env from '../config/env'
import { hash } from 'bcrypt'

let accountCollection: Collection

describe('Login Routes', () => {
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
  describe('POST /signup', () => {
    test('Should return 200 on signup success', async () => {
      await request(app)
        .post('/api/signup')
        .send({
          name: 'Rafael',
          email: 'rafael@gmail.com',
          password: '123',
          passwordConfirmation: '123'
        })
        .expect(200)
    })
  })

  describe('POST /login', () => {
    test('Should return 200 on signup success', async () => {
      const password = await hash('123', 12)
      await accountCollection.insertOne({
        name: 'Rafael',
        email: 'rafael@gmail.com',
        password
      })
      await request(app)
        .post('/api/login')
        .send({
          email: 'rafael@gmail.com',
          password: '123'
        })
        .expect(200)
    })

    test('Should return 401 on login fail', async () => {
      await request(app)
        .post('/api/login')
        .send({
          email: 'rafaelzepp@gmail.com',
          password: '123'
        })
        .expect(401)
    })
  })
})
