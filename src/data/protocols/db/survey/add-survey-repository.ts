import { AddSurveyModel } from '../../../../domain/usecases/addsurvey/add-survey'

export interface AddSurveyRepository {
  add: (surveyData: AddSurveyModel) => Promise<void>
}
