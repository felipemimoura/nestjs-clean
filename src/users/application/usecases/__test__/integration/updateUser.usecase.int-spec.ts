import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { DatabaseModule } from '@/shared/infrastructure/database/database.module'
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-teste'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { UserPrismaRepository } from '@/users/infrastructure/database/prisma/repostitories/user-prisma.repository'
import { Test, TestingModule } from '@nestjs/testing'
import { PrismaClient } from '@prisma/client'
import { UpdateUserUseCase } from '../../updateUser.usecase'

describe('Update user Integration test', () => {
  const prismaService = new PrismaClient()
  let sut: UpdateUserUseCase.UseCase
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
    sut = new UpdateUserUseCase.UseCase(repository)
    await prismaService.user.deleteMany()
  })

  afterAll(async () => {
    await module.close()
  })

  it('Should throw error when entity not found', async () => {
    await expect(() =>
      sut.execute({ id: 'fake-id', name: 'other name' }),
    ).rejects.toThrow(new NotFoundError('UserModel not found using ID fake-id'))
  })

  it('Should update a User', async () => {
    const entity = new UserEntity(UserDataBuilder({}))
    const model = await prismaService.user.create({
      data: entity.toJSON(),
    })

    const output = await sut.execute({ id: entity._id, name: 'other name' })

    expect(output.name).toBe('other name')
  })
})
