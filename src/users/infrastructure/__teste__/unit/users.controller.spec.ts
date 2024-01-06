import { UserOutput } from '@/users/application/dtos/user-output'
import { SingUpUseCase } from '@/users/application/usecases/signup.usecase'
import { SingUpDto } from '../../dtos/singUp.dto'
import { UsersController } from '../../users.controller'
import { SingInUseCase } from '@/users/application/usecases/signIn.usecase'
import { SingInDto } from '../../dtos/singIn.dto'

describe('UsersController unit test', () => {
  let sut: UsersController
  let id: string
  let props: UserOutput

  beforeEach(async () => {
    sut = new UsersController()
    id = '82e84bcd-4ede-4793-845c-94c5e184a567'
    props = {
      id,
      name: 'Joh Doe',
      email: 'johdoe@example.com',
      password: 'password',
      createdAt: new Date(),
    }
  })

  it('should be defined', () => {
    expect(sut).toBeDefined()
  })
  it('should be create a user', async () => {
    const output: SingUpUseCase.Output = props
    const mockSingUpUserCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    }

    sut['singUpUseCase'] = mockSingUpUserCase as any

    const input: SingUpDto = {
      name: 'Joh Doe',
      email: 'johdoe@example.com',
      password: 'password',
    }

    const result = await sut.create(input)
    expect(output).toMatchObject(result)
    expect(mockSingUpUserCase.execute).toHaveBeenCalledWith(input)
  })
  it('should be authenticate a user', async () => {
    const output: SingInUseCase.Output = props
    const mockSingInUserCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    }

    sut['singInUseCase'] = mockSingInUserCase as any

    const input: SingInDto = {
      email: 'johdoe@example.com',
      password: 'password',
    }

    const result = await sut.login(input)
    expect(output).toMatchObject(result)
    expect(mockSingInUserCase.execute).toHaveBeenCalledWith(input)
  })
})
