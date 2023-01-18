import { Collection } from 'mongodb'
import env from '@/main/config/env'
import { MongoHelper } from '../helpers/mongo-helper'
import { SurveyMongoRepository } from './survey-mongo-repository'

let surveyCollection: Collection

describe('Survey Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(env.mongoUrl)
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
  })

  const makeSut = (): SurveyMongoRepository => {
    return new SurveyMongoRepository()
  }

  describe('add()', () => {
    test('Should add a survey on sucess', async () => {
      const sut = makeSut()
      await sut.add({
        question: 'any_question',
        date: new Date(),
        answers: [{
          image: 'any_image',
          answer: 'any_answer'
        },
        {
          answer: 'other_answer'
        }]
      })
      const survey = await surveyCollection.findOne({ question: 'any_question' })
      expect(survey).toBeTruthy()
    })
  })

  describe('loadAll()', () => {
    test('Should load all surveys on sucess', async () => {
      const sut = makeSut()
      await surveyCollection.insertMany([{
        question: 'any_question',
        date: new Date(),
        answers: [{
          image: 'any_image',
          answer: 'any_answer'
        },
        {
          answer: 'other_answer'
        }]
      }, {
        question: 'other_question',
        date: new Date(),
        answers: [{
          image: 'other_image',
          answer: 'other_answer'
        },
        {
          answer: 'other_answer'
        }]
      }
      ])
      const surveys = await sut.loadAll()
      expect(surveys.length).toBe(2)
      expect(surveys[0].question).toBe('any_question')
      expect(surveys[1].question).toBe('other_question')
    })

    test('Should load empty list', async () => {
      const sut = makeSut()
      const surveys = await sut.loadAll()
      expect(surveys.length).toBe(0)
    })
  })

  describe('loadById()', () => {
    test('Should load survey by id on success', async () => {
      const sut = makeSut()
      const res = await surveyCollection.insertOne({
        question: 'any_question',
        date: new Date(),
        answers: [{
          image: 'any_image',
          answer: 'any_answer'
        },
        {
          answer: 'other_answer'
        }]
      })
      const id = res.insertedId.toHexString()
      const survey = await sut.loadById(id)
      expect(survey).toBeTruthy()
    })

    test('Should load empty list', async () => {
      const sut = makeSut()
      const surveys = await sut.loadAll()
      expect(surveys.length).toBe(0)
    })
  })
})
