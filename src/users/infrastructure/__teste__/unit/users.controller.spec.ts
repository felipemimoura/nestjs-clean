import { UserOutput } from '@/users/application/dtos/user-output'
import { SingUpUseCase } from '@/users/application/usecases/signup.usecase'
import { SingUpDto } from '../../dtos/singUp.dto'
import { UsersController } from '../../users.controller'
import { SingInUseCase } from '@/users/application/usecases/signIn.usecase'
import { SingInDto } from '../../dtos/singIn.dto'
import { UpdateUserUseCase } from '@/users/application/usecases/updateUser.usecase'
import { UpdateUserDto } from '../../dtos/update-user.dto'
import { UpdateUserPasswordUseCase } from '@/users/application/usecases/updateUserPassword.usecase'
import { UpdatePasswordUserDto } from '../../dtos/update-user-password.dto'
import { GetUserUseCase } from '@/users/application/usecases/getUser.usecase'
import { ListUserUseCase } from '@/users/application/usecases/listUser.usecase'

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
  it('should be update a user', async () => {
    const output: UpdateUserUseCase.Output = props
    const mockUpdateUserUserCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    }

    sut['updateUserUseCase'] = mockUpdateUserUserCase as any

    const input: UpdateUserDto = {
      name: 'teste',
    }

    const result = await sut.update(id, input)
    expect(output).toMatchObject(result)
    expect(mockUpdateUserUserCase.execute).toHaveBeenCalledWith({
      id,
      ...input,
    })
  })

  it('should update a users password', async () => {
    const output: UpdateUserPasswordUseCase.Output = props
    const mockUpdatePasswordUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    }
    sut['updateUserPasswordUseCase'] = mockUpdatePasswordUseCase as any

    const input: UpdatePasswordUserDto = {
      password: 'new password',
      oldPassword: 'old password',
    }
    const result = await sut.updatePassword(id, input)
    expect(output).toMatchObject(result)
    expect(mockUpdatePasswordUseCase.execute).toHaveBeenCalledWith({
      id,
      ...input,
    })
  })
  it('should delete a users', async () => {
    const output = undefined
    const mockDeleteUserUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    }
    sut['deleteUserUseCase'] = mockDeleteUserUseCase as any

    const result = await sut.remove(id)
    expect(output).toStrictEqual(result)
    expect(mockDeleteUserUseCase.execute).toHaveBeenCalledWith({
      id,
    })
  })
  it('should return a user', async () => {
    const output: GetUserUseCase.Output = props
    const mockGetUserUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    }
    sut['getUserUseCase'] = mockGetUserUseCase as any

    const result = await sut.findOne(id)
    expect(output).toStrictEqual(result)
    expect(mockGetUserUseCase.execute).toHaveBeenCalledWith({
      id,
    })
  })
  it('should list user', async () => {
    const output: ListUserUseCase.Output = {
      items: [props],
      currentPage: 1,
      lastPage: 1,
      perPage: 1,
      total: 1,
    }
    const mockListUserUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    }
    sut['listUserUseCase'] = mockListUserUseCase as any

    const searchParams = {
      page: 1,
      perPage: 1,
    }

    const result = await sut.search(searchParams)
    expect(output).toStrictEqual(result)
    expect(mockListUserUseCase.execute).toHaveBeenCalledWith(searchParams)
  })
})
