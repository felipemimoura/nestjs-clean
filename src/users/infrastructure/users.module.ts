import { HashProvider } from '@/shared/application/providers/hash-provider'
import { PrismaService } from '@/shared/infrastructure/database/prisma/prisma.service'
import { Module } from '@nestjs/common'
import { DeleteUserUseCase } from '../application/usecases/deleteUser.usecase'
import { GetUserUseCase } from '../application/usecases/getUser.usecase'
import { ListUserUseCase } from '../application/usecases/listUser.usecase'
import { SingInUseCase } from '../application/usecases/signIn.usecase'
import { SingUpUseCase } from '../application/usecases/signup.usecase'
import { UpdateUserUseCase } from '../application/usecases/updateUser.usecase'
import { UpdateUserPasswordUseCase } from '../application/usecases/updateUserPassword.usecase'
import { UserRepository } from '../domain/repositories/user.repository'
import { UserPrismaRepository } from './database/prisma/repostitories/user-prisma.repository'
import { BcryptjsHashProvider } from './providers/hash-provider/bcryptjs-hash-provider'
import { UsersController } from './users.controller'

@Module({
  controllers: [UsersController],
  providers: [
    { provide: 'PrismaService', useClass: PrismaService },
    {
      provide: 'UserRepository',
      useFactory: (prismaService: PrismaService) => {
        return new UserPrismaRepository(prismaService)
      },
    },
    {
      provide: 'HashProvider',
      useClass: BcryptjsHashProvider,
    },
    {
      provide: SingUpUseCase.UseCase,
      useFactory: (
        userRepository: UserRepository.Repository,
        hashProvider: HashProvider,
      ) => {
        return new SingUpUseCase.UseCase(userRepository, hashProvider)
      },
      inject: ['UserRepository', 'HashProvider'],
    },
    {
      provide: SingInUseCase.UseCase,
      useFactory: (
        userRepository: UserRepository.Repository,
        hashProvider: HashProvider,
      ) => {
        return new SingInUseCase.UseCase(userRepository, hashProvider)
      },
      inject: ['UserRepository', 'HashProvider'],
    },
    {
      provide: GetUserUseCase.UseCase,
      useFactory: (userRepository: UserRepository.Repository) => {
        return new GetUserUseCase.UseCase(userRepository)
      },
      inject: ['UserRepository'],
    },
    {
      provide: ListUserUseCase.UseCase,
      useFactory: (userRepository: UserRepository.Repository) => {
        return new ListUserUseCase.UseCase(userRepository)
      },
      inject: ['UserRepository'],
    },
    {
      provide: UpdateUserUseCase.UseCase,
      useFactory: (userRepository: UserRepository.Repository) => {
        return new UpdateUserUseCase.UseCase(userRepository)
      },
      inject: ['UserRepository'],
    },
    {
      provide: UpdateUserPasswordUseCase.UseCase,
      useFactory: (
        userRepository: UserRepository.Repository,
        hashProvider: HashProvider,
      ) => {
        return new UpdateUserPasswordUseCase.UseCase(
          userRepository,
          hashProvider,
        )
      },
      inject: ['UserRepository', 'HashProvider'],
    },
    {
      provide: DeleteUserUseCase.UseCase,
      useFactory: (userRepository: UserRepository.Repository) => {
        return new DeleteUserUseCase.UseCase(userRepository)
      },
      inject: ['UserRepository'],
    },
  ],
})
export class UsersModule {}
