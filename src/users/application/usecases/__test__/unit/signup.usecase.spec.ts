import { UserInMemoryRepository } from '@/users/infrastructure/database/in-memory/repositories/user-in-memory.repository'
import { SingUpUseCase } from '../../signup.usecase'
import { HashProvider } from '@/shared/application/providers/hash-provider'
import { BcryptjsHashProvider } from '@/users/infrastructure/providers/hash-provider/bcryptjs-hash-provider'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { ConflictError } from '@/shared/domain/errors/conflict-error'
import { BadRequestError } from '@/shared/application/errors/bad-request-error'

describe('SingUpUseCase', () => {
  let sut: SingUpUseCase.UseCase
  let repository: UserInMemoryRepository
  let hashProvider: HashProvider

  beforeEach(() => {
    repository = new UserInMemoryRepository()
    hashProvider = new BcryptjsHashProvider()
    sut = new SingUpUseCase.UseCase(repository, hashProvider)
  })
  it('Should create a user', async () => {
    const spyInsert = jest.spyOn(repository, 'insert')

    const props = UserDataBuilder({})

    const result = await sut.execute({
      email: props.email,
      name: props.name,
      password: props.password,
    })

    expect(result.id).toBeDefined()
    expect(result.createdAt).toBeInstanceOf(Date)
    expect(spyInsert).toHaveBeenCalledTimes(1)
  })
  it('Should not able to register with same email twice', async () => {
    const props = UserDataBuilder({ email: 'teste@teste.com' })
    await sut.execute(props)

    await expect(() => sut.execute(props)).rejects.toBeInstanceOf(ConflictError)
  })
  it('Should throws errors when name is not provide', async () => {
    const props = Object.assign(UserDataBuilder({}), { name: null })

    await expect(() => sut.execute(props)).rejects.toBeInstanceOf(
      BadRequestError,
    )
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
})
