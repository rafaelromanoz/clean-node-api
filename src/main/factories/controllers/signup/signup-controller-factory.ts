import { makeDbAddAccount } from './../../usecases/add-account/db-add-account-factory'
import { makeDbAuthentication } from './../../usecases/authentication/db-authentication-factory'
import { SignUpController } from '../../../../presentation/controllers/login2/signup/signup-controller'
import { Controller } from '../../../../presentation/protocols'
import { makeSignUpValidation } from './signup-validation-factory'
import { makeLogControllerDecorator } from '../../decorators/log-controller-decorator-factory'

export const makeSignUpController = (): Controller => {
  return makeLogControllerDecorator(new SignUpController(makeDbAddAccount(), makeSignUpValidation(), makeDbAuthentication()))
}
