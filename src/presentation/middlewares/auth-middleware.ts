import { forbidden } from './../helpers/http/http-helper'
import { LoadAccountByToken } from './../../domain/usecases/load-account-by-token/load-account-by-token'
import { HttpRequest, HttpResponse, Middleware } from '../protocols'
import { AccessDeniedError } from '../errors'

export class AuthMiddleware implements Middleware {
  constructor (
    private readonly LoadAccountByToken: LoadAccountByToken
  ) { }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse | undefined> {
    const accessToken = httpRequest.headers?.['x-access-token']
    if (accessToken) {
      await this.LoadAccountByToken.load(accessToken)
    }
    return forbidden(new AccessDeniedError())
  }
}
