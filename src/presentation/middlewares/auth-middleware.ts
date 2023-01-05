import { forbidden, ok, serverError } from './../helpers/http/http-helper'
import { LoadAccountByToken } from './../../domain/usecases/load-account-by-token/load-account-by-token'
import { HttpRequest, HttpResponse, Middleware } from '../protocols'
import { AccessDeniedError } from '../errors'

export class AuthMiddleware implements Middleware {
  constructor (
    private readonly LoadAccountByToken: LoadAccountByToken
  ) { }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse | undefined> {
    try {
      const accessToken = httpRequest.headers?.['x-access-token']
      if (accessToken) {
        const account = await this.LoadAccountByToken.load(accessToken)
        if (account) return ok({ accountId: account.id })
      }
      return forbidden(new AccessDeniedError())
    } catch (error) {
      return serverError(error)
    }
  }
}
