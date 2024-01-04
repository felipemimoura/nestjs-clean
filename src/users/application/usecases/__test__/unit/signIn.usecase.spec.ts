import { BadRequestError } from '@/shared/application/errors/bad-request-error'
import { HashProvider } from '@/shared/application/providers/hash-provider'
import { ConflictError } from '@/shared/domain/errors/conflict-error'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { UserInMemoryRepository } from '@/users/infrastructure/database/in-memory/repositories/user-in-memory.repository'
import { BcryptjsHashProvider } from '@/users/infrastructure/providers/hash-provider/bcryptjs-hash-provider'
import { SingInUseCase } from '../../signIn.usecase'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { InvalidCredentialsError } from '@/shared/application/errors/invalid-credentials-error'

describe('SingInUseCase', () => {
  let sut: SingInUseCase.UseCase
  let repository: UserInMemoryRepository
  let hashProvider: HashProvider

  beforeEach(() => {
    repository = new UserInMemoryRepository()
    hashProvider = new BcryptjsHashProvider()
    sut = new SingInUseCase.UseCase(repository, hashProvider)
  })
  it('Should authenticate a user', async () => {
    const spyFindByEmail = jest.spyOn(repository, 'findByEmail')
    const hashPassword = await hashProvider.generateHash('1234')

    const entity = new UserEntity(
      UserDataBuilder({ email: 'teste@teste.com', password: hashPassword }),
    )

    repository.items = [entity]

    const result = await sut.execute({
      email: entity.email,
      password: '1234',
    })

    expect(spyFindByEmail).toHaveBeenCalledTimes(1)
    expect(result).toStrictEqual(entity.toJSON())
  })
  it('Should throws errors when email is not provide', async () => {
    const props = Object.assign(UserDataBuilder({}), { email: null })

    await expect(() => sut.execute(props)).rejects.toBeInstanceOf(
      BadRequestError,
    )
  })
  it('Should throws errors when password is not provide', async () => {
    const props = Object.assign(UserDataBuilder({}), { password: null })

    await expect(() => sut.execute(props)).rejects.toBeInstanceOf(
      BadRequestError,
    )
  })
  it('Should not be able to authenticate with wrong email', async () => {
    const props = { email: 'foo@example.com', password: '1234' }

    await expect(() => sut.execute(props)).rejects.toBeInstanceOf(NotFoundError)
  })
  it('Should not be able to authenticate with wrong password', async () => {
    const hashPassword = await hashProvider.generateHash('1234')

    const entity = new UserEntity(
      UserDataBuilder({ email: 'teste@teste.com', password: hashPassword }),
    )

    repository.items = [entity]

    const props = { email: 'teste@teste.com', password: 'abc' }

    await expect(() => sut.execute(props)).rejects.toBeInstanceOf(
      InvalidCredentialsError,
    )
  })
})
