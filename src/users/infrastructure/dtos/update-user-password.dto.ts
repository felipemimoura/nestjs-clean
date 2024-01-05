import { UpdateUserUseCase } from '@/users/application/usecases/updateUser.usecase'
import { UpdateUserPasswordUseCase } from '@/users/application/usecases/updateUserPassword.usecase'

export class UpdatePasswordUserDto
  implements Omit<UpdateUserPasswordUseCase.Input, 'id'>
{
  name: string
  password: string
  oldPassword: string
}
