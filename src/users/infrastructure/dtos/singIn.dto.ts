import { SingInUseCase } from '@/users/application/usecases/signIn.usecase'

export class SingInDto implements SingInUseCase.Input {
  email: string
  password: string
}
