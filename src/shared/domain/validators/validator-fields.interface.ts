export type FieldsErrors = {
  [field: string]: string[]
}

export interface ValidatorFieldsInterface<PropsValidated> {
  errors: FieldsErrors
  validatedDate: PropsValidated
  validate(data: any): boolean
}
