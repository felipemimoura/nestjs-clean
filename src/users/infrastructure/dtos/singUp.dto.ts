import { SingUpUseCase } from '@/users/application/usecases/signup.usecase'

export class SingUpDto implements SingUpUseCase.Input {
  name: string
  email: string
  password: string
}
