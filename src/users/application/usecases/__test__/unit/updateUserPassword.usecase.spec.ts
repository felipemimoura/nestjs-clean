import { InvalidPasswordError } from '@/shared/application/errors/invalid-password-error'
import { HashProvider } from '@/shared/application/providers/hash-provider'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { UserInMemoryRepository } from '@/users/infrastructure/database/in-memory/repositories/user-in-memory.repository'
import { BcryptjsHashProvider } from '@/users/infrastructure/providers/hash-provider/bcryptjs-hash-provider'
import { UpdateUserPasswordUseCase } from '../../updateUserPassword.usecase'

describe('UpdateUserPasswordUseCase', () => {
  let sut: UpdateUserPasswordUseCase.UseCase
  let repository: UserInMemoryRepository
  let hash: HashProvider

  beforeEach(() => {
    repository = new UserInMemoryRepository()
    hash = new BcryptjsHashProvider()
    sut = new UpdateUserPasswordUseCase.UseCase(repository, hash)
  })
  it('Should throw error when entity not found', async () => {
    await expect(
      sut.execute({ id: 'fake-id', password: '1234', oldPassword: '4212' }),
    ).rejects.toThrow(new NotFoundError('Entity not found'))
  })

  it('Should throw error when oldPassword not provided', async () => {
    const items = [new UserEntity(UserDataBuilder({}))]
    repository.items = items

    await expect(
      sut.execute({ id: items[0].id, password: '1234', oldPassword: '' }),
    ).rejects.toThrow(
      new InvalidPasswordError('Old password and new password is required'),
    )
  })
  it('Should throw error when password not provided', async () => {
    const items = [new UserEntity(UserDataBuilder({ password: '1234' }))]
    repository.items = items

    await expect(
      sut.execute({ id: items[0].id, password: '', oldPassword: '1234' }),
    ).rejects.toThrow(
      new InvalidPasswordError('Old password and new password is required'),
    )
  })
  it('Should throw error when password not match', async () => {
    const hashPassword = await hash.generateHash('1234')
    const items = new UserEntity(UserDataBuilder({ password: hashPassword }))
    repository.items = [items]

    await expect(
      sut.execute({ id: items._id, password: '1234', oldPassword: '12345' }),
    ).rejects.toThrow(new InvalidPasswordError('Old password does not match'))
  })
  it('Should be update user Password', async () => {
    const spyOn = jest.spyOn(repository, 'update')
    const hashPassword = await hash.generateHash('1234')

    const items = [new UserEntity(UserDataBuilder({ password: hashPassword }))]

    repository.items = items

    const result = await sut.execute({
      id: items[0].id,
      password: '4567',
      oldPassword: '1234',
    })

    const checkNewPassword = await hash.compareHash('4567', result.password)

    expect(spyOn).toHaveBeenCalledTimes(1)
    expect(checkNewPassword).toBeTruthy()
  })
})
