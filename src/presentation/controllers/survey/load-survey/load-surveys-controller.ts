import { Controller, HttpRequest, HttpResponse, LoadSurveys } from './load-surveys-controller-protocols'

export class LoadSurveysController implements Controller {
  constructor (private readonly loadSurveys: LoadSurveys) { }

  async handle (httpResquest: HttpRequest): Promise<HttpResponse> {
    await this.loadSurveys.load()
    return {
      body: '',
      statusCode: 200
    }
  }
}
