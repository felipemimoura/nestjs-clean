import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { DatabaseModule } from '@/shared/infrastructure/database/database.module'
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-teste'
import { UserPrismaRepository } from '@/users/infrastructure/database/prisma/repostitories/user-prisma.repository'
import { Test, TestingModule } from '@nestjs/testing'
import { PrismaClient } from '@prisma/client'
import { SingUpUseCase } from '../../signup.usecase'
import { HashProvider } from '@/shared/application/providers/hash-provider'
import { BcryptjsHashProvider } from '@/users/infrastructure/providers/hash-provider/bcryptjs-hash-provider'

describe('SignupUseCase Integration test', () => {
  const prismaService = new PrismaClient()
  let sut: SingUpUseCase.UseCase
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
    sut = new SingUpUseCase.UseCase(repository, hashProvider)
    await prismaService.user.deleteMany()
  })

  afterAll(async () => {
    await module.close()
  })

  it('Should create user', async () => {
    const props = {
      name: 'John Doe',
      email: 'john@doe.com',
      password: 'password123',
    }

    const output = await sut.execute(props)
    expect(output.id).toBeDefined()
    expect(output.createdAt).toBeInstanceOf(Date)
  })
})
