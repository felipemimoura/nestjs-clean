import { BadRequestError } from '@/shared/application/errors/bad-request-error'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { UserInMemoryRepository } from '@/users/infrastructure/database/in-memory/repositories/user-in-memory.repository'
import { UpdateUserUseCase } from '../../updateUser.usecase'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'

describe('UpdateUserUseCase', () => {
  let sut: UpdateUserUseCase.UseCase
  let repository: UserInMemoryRepository

  beforeEach(() => {
    repository = new UserInMemoryRepository()
    sut = new UpdateUserUseCase.UseCase(repository)
  })
  it('Should throw error when entity not found', async () => {
    await expect(
      sut.execute({ id: 'fake-id', name: 'test name' }),
    ).rejects.toThrow(new NotFoundError('Entity not found'))
  })
  it('Should throw error when name not provided', async () => {
    await expect(sut.execute({ id: 'fake-id', name: '' })).rejects.toThrow(
      new BadRequestError('Name not provided'),
    )
  })
  it('Should be update user', async () => {
    const spyOn = jest.spyOn(repository, 'update')

    const items = [new UserEntity(UserDataBuilder({}))]

    repository.items = items

    const result = await sut.execute({ id: items[0].id, name: 'teste name' })

    expect(spyOn).toHaveBeenCalledTimes(1)
    expect(result).toMatchObject({
      id: items[0].id,
      name: 'teste name',
      email: items[0].email,
      password: items[0].password,
      createdAt: items[0].createdAt,
    })
  })
})
