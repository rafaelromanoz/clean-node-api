import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, serverError } from '../../helpers/http-helper'
import { Controller, HttpRequest } from '../../protocols'
import { EmailValidator } from '../signup/signup-protocols'

export class LoginController implements Controller {
  constructor (private readonly emailValidator: EmailValidator) {}
  async handle (httpRequest: HttpRequest): Promise<any> {
    try {
      const { email, password } = httpRequest.body
      if (!email) {
        return badRequest(new MissingParamError('email'))
      } if (!password) {
        return badRequest(new MissingParamError('password'))
      }
      const isvalid = this.emailValidator.isValid(httpRequest.body.email)
      if (!isvalid) {
        return badRequest(new InvalidParamError('email'))
      }
    } catch (error) {
      return serverError(error as Error)
    }
  }
}
