import { SaveSurveyResultModel, SaveSurveyResultRepository, SurveyResultModel } from '@/data/usecases/save-survey-result/db-save-survey-protocols'
import { ObjectId } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'

export class SurveyResultMongoRepository implements SaveSurveyResultRepository {
  async save (data: SaveSurveyResultModel): Promise<SurveyResultModel> {
    const surveyCollection = await MongoHelper.getCollection('surveyResults')
    const surveyResult = await surveyCollection.findOneAndUpdate({
      surveyId: new ObjectId(data.surveyId),
      accountId: new ObjectId(data.accountId)
    }, {
      $set: {
        answer: data.answer,
        date: data.date
      }
    }, {
      upsert: true
    })
    return surveyResult.value && MongoHelper.map(surveyResult.value)
  }
}
