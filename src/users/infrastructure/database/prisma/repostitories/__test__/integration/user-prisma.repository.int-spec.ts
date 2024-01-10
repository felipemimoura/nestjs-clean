import { PrismaClient } from '@prisma/client'
import { UserPrismaRepository } from '../../user-prisma.repository'
import { Test, TestingModule } from '@nestjs/testing'
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-teste'
import { DatabaseModule } from '@/shared/infrastructure/database/database.module'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { Entity } from '@/shared/domain/entities/entity'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserRepository } from '@/users/domain/repositories/user.repository'

describe('UserPrismaRepository integration test', () => {
  const prismaService = new PrismaClient()
  let sut: UserPrismaRepository
  let module: TestingModule

  beforeAll(async () => {
    setupPrismaTests()

    module = await Test.createTestingModule({
      imports: [DatabaseModule.forTest(prismaService)],
    }).compile()
  })

  beforeEach(async () => {
    sut = new UserPrismaRepository(prismaService as any)
    await prismaService.user.deleteMany()
  })

  it('Should throws error when user entity not found', () => {
    expect(() => sut.findById('fakeId')).rejects.toThrow(
      new NotFoundError('UserModel not found using ID fakeId'),
    )
  })
  it('Should find a entity by id', async () => {
    const entity = new UserEntity(UserDataBuilder({}))
    const newUser = await prismaService.user.create({
      data: entity.toJSON(),
    })
    const output = await sut.findById(newUser.id)
    expect(output.toJSON()).toStrictEqual(entity.toJSON())
  })

  it('Should insert a new entity', async () => {
    const entity = new UserEntity(UserDataBuilder({}))
    await sut.insert(entity)

    const result = await prismaService.user.findUnique({
      where: {
        id: entity._id,
      },
    })
    expect(result).toStrictEqual(entity.toJSON())
  })

  it('Should return all users', async () => {
    const entity = new UserEntity(UserDataBuilder({}))
    await prismaService.user.create({
      data: entity.toJSON(),
    })
    const entities = await sut.findAll()

    expect(entities).toHaveLength(1)

    expect(JSON.stringify(entities)).toBe(JSON.stringify([entity]))

    entities.map(item => expect(item.toJSON()).toStrictEqual(entity.toJSON()))
  })

  describe('SearchMethod test', () => {
    it('Should apply only pagination when the order params are null', async () => {
      const createdAt = new Date()
      const entities: UserEntity[] = []
      const arrange = Array(16).fill(UserDataBuilder({}))

      arrange.forEach((element, index) => {
        entities.push(
          new UserEntity({
            ...element,
            name: `User ${index}`,
            email: `teste${index}@mail.com`,
            createdAt: new Date(createdAt.getTime() + index),
          }),
        )
      })

      await prismaService.user.createMany({
        data: entities.map(item => item.toJSON()),
      })

      const searchOutput = await sut.search(new UserRepository.SearchParams())

      expect(searchOutput).toBeInstanceOf(UserRepository.SearchResult)
      expect(searchOutput.total).toBe(16)
      expect(searchOutput.items.length).toBe(15)
      searchOutput.items.forEach(item => {
        expect(item).toBeInstanceOf(UserEntity)
      })
    })
  })
})
