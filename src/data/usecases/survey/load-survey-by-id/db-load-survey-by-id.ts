import {
  LoadSurveyByIdRepository,
  SurveyModel,
  LoadSurveyById
} from './db-load-survey-by-id-protocols'

export class DbLoadSurveyById implements LoadSurveyById {
  constructor (private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository) { }

  async loadById (id: string): Promise<SurveyModel> {
    return this.loadSurveyByIdRepository.loadById(id)
  }
}
