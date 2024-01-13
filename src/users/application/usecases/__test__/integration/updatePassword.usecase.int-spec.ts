import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { DatabaseModule } from '@/shared/infrastructure/database/database.module'
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-teste'
import { UserPrismaRepository } from '@/users/infrastructure/database/prisma/repostitories/user-prisma.repository'
import { Test, TestingModule } from '@nestjs/testing'
import { PrismaClient } from '@prisma/client'
import { SingUpUseCase } from '../../signup.usecase'
import { HashProvider } from '@/shared/application/providers/hash-provider'
import { BcryptjsHashProvider } from '@/users/infrastructure/providers/hash-provider/bcryptjs-hash-provider'
import { UpdateUserPasswordUseCase } from '../../updateUserPassword.usecase'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { InvalidPasswordError } from '@/shared/application/errors/invalid-password-error'

describe('Update Password Integration test', () => {
  const prismaService = new PrismaClient()
  let sut: UpdateUserPasswordUseCase.UseCase
  let repository: UserPrismaRepository
  let hashProvider: HashProvider
  let module: TestingModule

  beforeAll(async () => {
    setupPrismaTests()

    module = await Test.createTestingModule({
      imports: [DatabaseModule.forTest(prismaService)],
    }).compile()

    repository = new UserPrismaRepository(prismaService as any)
    hashProvider = new BcryptjsHashProvider()
  })

  beforeEach(async () => {
    sut = new UpdateUserPasswordUseCase.UseCase(repository, hashProvider)
    await prismaService.user.deleteMany()
  })

  afterAll(async () => {
    await module.close()
  })

  it('Should throws error on when user entity found by ID', async () => {
    const entity = new UserEntity(UserDataBuilder({}))

    await expect(() =>
      sut.execute({
        id: entity._id,
        oldPassword: 'oldPassword',
        password: 'newPassword',
      }),
    ).rejects.toThrow(
      new NotFoundError(`UserModel not found using ID ${entity._id}`),
    )
  })
  it('Should throws error on old password not provide', async () => {
    const entity = new UserEntity(UserDataBuilder({}))
    await prismaService.user.create({
      data: entity.toJSON(),
    })

    await expect(() =>
      sut.execute({
        id: entity._id,
        oldPassword: '',
        password: 'newPassword',
      }),
    ).rejects.toThrow(
      new InvalidPasswordError(`Old password and new password is required`),
    )
  })
  it('Should throws error on new password not provide', async () => {
    const entity = new UserEntity(UserDataBuilder({}))
    await prismaService.user.create({
      data: entity.toJSON(),
    })

    await expect(() =>
      sut.execute({
        id: entity._id,
        oldPassword: 'old',
        password: '',
      }),
    ).rejects.toThrow(
      new InvalidPasswordError(`Old password and new password is required`),
    )
  })
  it('Should throws error old password not match', async () => {
    const entity = new UserEntity(UserDataBuilder({}))
    await prismaService.user.create({
      data: entity.toJSON(),
    })

    await expect(() =>
      sut.execute({
        id: entity._id,
        oldPassword: 'oldPassword',
        password: 'new Password',
      }),
    ).rejects.toThrow(new InvalidPasswordError(`Old password does not match`))
  })
  it('Should be update Passowrd', async () => {
    const oldPassword = await hashProvider.generateHash('1234')
    const entity = new UserEntity(UserDataBuilder({ password: oldPassword }))
    await prismaService.user.create({
      data: entity.toJSON(),
    })

    const output = await sut.execute({
      id: entity._id,
      oldPassword: '1234',
      password: 'newPassword',
    })

    const result = await hashProvider.compareHash(
      'newPassword',
      output.password,
    )

    expect(result).toBeTruthy()
  })
})
