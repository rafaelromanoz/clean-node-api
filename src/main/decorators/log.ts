import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'

export class LogControllerDecorator implements Controller {
  constructor (private readonly controller: Controller) { }
  async handle (httpRequest: HttpRequest): Promise<HttpResponse | undefined> {
    await this.controller.handle(httpRequest)
    return undefined
  }
}
