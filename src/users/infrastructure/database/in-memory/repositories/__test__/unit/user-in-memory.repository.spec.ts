import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserInMemoryRepository } from '../../user-in-memory.repository'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { ConflictError } from '@/shared/domain/errors/conflict-error'

describe('In Memory Repository unit test', () => {
  let sut: UserInMemoryRepository

  beforeEach(() => {
    sut = new UserInMemoryRepository()
  })

  it('Should throw error when not found - findByEmail', async () => {
    await expect(sut.findByEmail('teste@teste.com.br')).rejects.toThrow(
      new NotFoundError('Entity not found using e-mail teste@teste.com.br'),
    )
  })
  it('Should find a entity by Email - findByEmail', async () => {
    const entity = new UserEntity(UserDataBuilder({}))

    await sut.insert(entity)

    const result = await sut.findByEmail(entity.email)

    expect(entity.toJSON()).toStrictEqual(result.toJSON())
  })

  it('Should throw error when not found - emailExist', async () => {
    const entity = new UserEntity(UserDataBuilder({}))

    await sut.insert(entity)

    await expect(sut.emailExists(entity.email)).rejects.toThrow(
      new ConflictError(`Email address already used`),
    )
  })
  it('Should find a entity byEmail - emailExist', async () => {
    expect.assertions(0)
    await sut.emailExists('teste@teste.com')
  })
})
