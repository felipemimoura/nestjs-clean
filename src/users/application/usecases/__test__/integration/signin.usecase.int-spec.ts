import { InvalidCredentialsError } from '@/shared/application/errors/invalid-credentials-error'
import { HashProvider } from '@/shared/application/providers/hash-provider'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { DatabaseModule } from '@/shared/infrastructure/database/database.module'
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-teste'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { UserPrismaRepository } from '@/users/infrastructure/database/prisma/repostitories/user-prisma.repository'
import { BcryptjsHashProvider } from '@/users/infrastructure/providers/hash-provider/bcryptjs-hash-provider'
import { Test, TestingModule } from '@nestjs/testing'
import { PrismaClient } from '@prisma/client'
import { SingInUseCase } from '../../signIn.usecase'
import { BadRequestError } from '@/shared/application/errors/bad-request-error'

describe('SignIn Integration test', () => {
  const prismaService = new PrismaClient()
  let sut: SingInUseCase.UseCase
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
    sut = new SingInUseCase.UseCase(repository, hashProvider)
    await prismaService.user.deleteMany()
  })

  afterAll(async () => {
    await module.close()
  })

  it('Should not be able to authenticate with wrong email', async () => {
    const entity = new UserEntity(UserDataBuilder({}))

    await expect(() =>
      sut.execute({
        email: entity.email,
        password: 'password',
      }),
    ).rejects.toBeInstanceOf(NotFoundError)
  })
  it('Should not be able to authenticate with wrong password', async () => {
    const hashPassword = await hashProvider.generateHash('1234')
    const entity = new UserEntity(
      UserDataBuilder({ email: 'a@a.com', password: hashPassword }),
    )
    await prismaService.user.create({
      data: entity.toJSON(),
    })

    await expect(() =>
      sut.execute({
        email: 'a@a.com',
        password: 'password',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('Should throw error when email not provide', async () => {
    const entity = new UserEntity(UserDataBuilder({}))

    await expect(() =>
      sut.execute({
        email: '',
        password: 'password',
      }),
    ).rejects.toBeInstanceOf(BadRequestError)
  })
  it('Should throw error when password not provide', async () => {
    const entity = new UserEntity(UserDataBuilder({}))

    await expect(() =>
      sut.execute({
        email: 'a@a.com',
        password: '',
      }),
    ).rejects.toBeInstanceOf(BadRequestError)
  })

  it('Should authenticate', async () => {
    const hashPassword = await hashProvider.generateHash('1234')
    const entity = new UserEntity(
      UserDataBuilder({ email: 'a@a.com', password: hashPassword }),
    )
    await prismaService.user.create({
      data: entity.toJSON(),
    })

    const output = await sut.execute({
      email: 'a@a.com',
      password: '1234',
    })

    expect(output).toMatchObject(entity.toJSON())
  })
})
