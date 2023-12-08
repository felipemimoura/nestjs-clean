import { ClassValidatorFields } from '../../class-validator-fields'
import * as libClassValidator from 'class-validator'

class StubClassValidatorFields extends ClassValidatorFields<{
  field: string
}> {}

describe('ClassValidatorFields unit test', () => {
  it('Should initialize errors and validatedData Variables with null', () => {
    const sub = new StubClassValidatorFields()

    expect(sub.errors).toBeNull()
    expect(sub.validatedDate).toBeNull()
  })
  it('Should validate with Errors', () => {
    const spyValidadeSync = jest.spyOn(libClassValidator, 'validateSync')
    spyValidadeSync.mockReturnValue([
      { property: 'field', constraints: { isRequired: 'testError' } },
    ])
    const sut = new StubClassValidatorFields()

    expect(sut.validate(null)).toBeFalsy()
    expect(spyValidadeSync).toHaveBeenCalled()
    expect(sut.validatedDate).toBeNull()
    expect(sut.errors).toStrictEqual({ field: ['testError'] })
  })
})
