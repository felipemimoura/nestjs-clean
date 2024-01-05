import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  HttpCode,
  Query,
  Put,
} from '@nestjs/common'
import { SingUpDto } from './dtos/singUp.dto'
import { UpdateUserDto } from './dtos/update-user.dto'
import { SingUpUseCase } from '../application/usecases/signup.usecase'
import { SingInUseCase } from '../application/usecases/signIn.usecase'
import { GetUserUseCase } from '../application/usecases/getUser.usecase'
import { ListUserUseCase } from '../application/usecases/listUser.usecase'
import { UpdateUserUseCase } from '../application/usecases/updateUser.usecase'
import { UpdateUserPasswordUseCase } from '../application/usecases/updateUserPassword.usecase'
import { SingInDto } from './dtos/singIn.dto'
import { ListUsersDto } from './dtos/listUsers.dto'
import { UpdatePasswordUserDto } from './dtos/update-user-password.dto'
import { DeleteUserUseCase } from '../application/usecases/deleteUser.usecase'

@Controller('users')
export class UsersController {
  @Inject(SingUpUseCase.UseCase)
  private singUpUseCase: SingUpUseCase.UseCase

  @Inject(SingInUseCase.UseCase)
  private singInUseCase: SingInUseCase.UseCase

  @Inject(GetUserUseCase.UseCase)
  private getUserUseCase: GetUserUseCase.UseCase

  @Inject(ListUserUseCase.UseCase)
  private listUserUseCase: ListUserUseCase.UseCase

  @Inject(UpdateUserUseCase.UseCase)
  private updateUserUseCase: UpdateUserUseCase.UseCase

  @Inject(UpdateUserPasswordUseCase.UseCase)
  private updateUserPasswordUseCase: UpdateUserPasswordUseCase.UseCase

  @Inject(DeleteUserUseCase.UseCase)
  private deleteUserUseCase: DeleteUserUseCase.UseCase

  @Post()
  async create(@Body() singUpDto: SingUpDto) {
    return await this.singUpUseCase.execute(singUpDto)
  }

  @HttpCode(200)
  @Post('login')
  async login(@Body() singInDto: SingInDto) {
    return await this.singInUseCase.execute(singInDto)
  }

  @Get()
  async search(@Query() searchParams: ListUsersDto) {
    return await this.listUserUseCase.execute(searchParams)
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.getUserUseCase.execute({ id })
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.updateUserUseCase.execute({
      id,
      ...updateUserDto,
    })
  }

  @Patch(':id')
  async updatePassword(
    @Param('id') id: string,
    @Body() updatePasswordDto: UpdatePasswordUserDto,
  ) {
    return await this.updateUserPasswordUseCase.execute({
      id,
      ...updatePasswordDto,
    })
  }

  @HttpCode(204)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.deleteUserUseCase.execute({
      id,
    })
  }
}
