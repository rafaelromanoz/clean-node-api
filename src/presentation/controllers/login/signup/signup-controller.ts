import { EmailInUseError } from '@/presentation/errors'
import { forbidden , badRequest, ok, serverError } from '@/presentation/helpers/http/http-helper'
import {
  HttpRequest,
  HttpResponse,
  Controller,
  AddAccount,
  Validation,
  Authentication
} from './signup-controller-protocols'
export class SignUpController implements Controller {
  constructor (
    private readonly addAccount: AddAccount,
    private readonly validation: Validation,
    private readonly authentication: Authentication
  ) { }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse | undefined> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }
      const { name, email, password } = httpRequest.body
      const account = await this.addAccount.add({
        name,
        email,
        password
      })
      if (!account) {
        return forbidden(new EmailInUseError())
      }
      const acessToken = await this.authentication.auth({
        email,
        password
      })
      return ok({ acessToken })
    } catch (error) {
      return serverError(error as Error)
    }
  }
}
