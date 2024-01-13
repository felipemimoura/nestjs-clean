import { DatabaseModule } from '@/shared/infrastructure/database/database.module'
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-teste'
import { UserPrismaRepository } from '@/users/infrastructure/database/prisma/repostitories/user-prisma.repository'
import { Test, TestingModule } from '@nestjs/testing'
import { PrismaClient } from '@prisma/client'
import { DeleteUserUseCase } from '../../deleteUser.usecase'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { GetUserUseCase } from '../../getUser.usecase'

describe('Get user Integration test', () => {
  const prismaService = new PrismaClient()
  let sut: GetUserUseCase.UseCase
  let repository: UserPrismaRepository
  let module: TestingModule

  beforeAll(async () => {
    setupPrismaTests()

    module = await Test.createTestingModule({
      imports: [DatabaseModule.forTest(prismaService)],
    }).compile()

    repository = new UserPrismaRepository(prismaService as any)
  })

  beforeEach(async () => {
    sut = new GetUserUseCase.UseCase(repository)
    await prismaService.user.deleteMany()
  })

  afterAll(async () => {
    await module.close()
  })

  it('Should throw error when entity not found', async () => {
    await expect(() => sut.execute({ id: 'fake-id' })).rejects.toThrow(
      new NotFoundError('UserModel not found using ID fake-id'),
    )
  })
  it('Should return a User', async () => {
    const entity = new UserEntity(UserDataBuilder({}))
    const model = await prismaService.user.create({
      data: entity.toJSON(),
    })

    const output = await sut.execute({ id: entity._id })

    expect(output).toMatchObject(model)
  })
})
