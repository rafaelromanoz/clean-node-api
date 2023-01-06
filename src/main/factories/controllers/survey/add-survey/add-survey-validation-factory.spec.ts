import { Validation } from '../../../../../presentation/protocols'
import {
  ValidationComposite,
  RequiredFieldValidation
} from '../../../../../validation/validators'
import { makeAddSurveyValidation } from './add-survey-validation-factory'

jest.mock('../../../../../validation/validators/validation-composite')

describe('AddSurveyValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeAddSurveyValidation()
    const validations: Validation[] = []
    const requiredFields = ['question', 'answers']
    requiredFields.forEach((field) => {
      validations.push(new RequiredFieldValidation(field))
    })
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
