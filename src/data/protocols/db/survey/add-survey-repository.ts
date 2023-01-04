import { AddSurveyModel } from './../../../../domain/usecases/addsurvey/add-account'

export interface AddSurveyRepository {
  add: (surveyData: AddSurveyModel) => Promise<void>
}
