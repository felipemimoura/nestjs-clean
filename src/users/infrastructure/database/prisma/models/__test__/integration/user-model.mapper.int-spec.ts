import { ValidationError } from '@/shared/domain/errors/validation-error'
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-teste'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { PrismaClient, User } from '@prisma/client'
import { UserModelMapper } from '../../user-model.mapper'

describe('UserModelMapper integration test', () => {
  let prismaService: PrismaClient
  let props: any

  beforeAll(async () => {
    setupPrismaTests()

    prismaService = new PrismaClient()
    await prismaService.$connect()
  })

  beforeEach(async () => {
    await prismaService.user.deleteMany()

    props = {
      id: 'd4255494-f981-4d26-a2a1-35d3f5b8d36a',
      name: 'Test name',
      email: 'a@a.com',
      password: 'TestPassword123',
      createdAt: new Date(),
    }
  })

  afterAll(async () => {
    await prismaService.$disconnect()
  })

  it('Should throws error when user model is invalid', () => {
    const model: User = Object.assign(props, { name: null })

    expect(() => UserModelMapper.toEntity(model)).toThrowError(ValidationError)
  })

  it('Should convert a user model to a userEntity', async () => {
    const model: User = await prismaService.user.create({
      data: props,
    })

    const sut = UserModelMapper.toEntity(model)

    expect(sut).toBeInstanceOf(UserEntity)
    expect(sut.toJSON()).toStrictEqual(props)
  })
})
