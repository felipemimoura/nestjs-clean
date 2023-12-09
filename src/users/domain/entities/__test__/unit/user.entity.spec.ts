import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { UserEntity, UserProps } from '../../user.entity'
describe('User Entity test', () => {
  let props: UserProps
  let sut: UserEntity
  beforeEach(() => {
    UserEntity.validate = jest.fn()
    props = UserDataBuilder({})
    sut = new UserEntity(props)
  })

  it('Constructor Method', () => {
    expect(UserEntity.validate).toHaveBeenCalled()
    expect(sut.props.name).toEqual(props.name)
    expect(sut.props.password).toEqual(props.password)
    expect(sut.props.email).toEqual(props.email)
    expect(sut.props.createdAt).toBeInstanceOf(Date)
  })

  it('GET name field', () => {
    expect(sut.props.name).toBeDefined()
    expect(sut.props.name).toEqual(props.name)
    expect(typeof sut.props.name).toBe('string')
  })
  it('SET name field', () => {
    sut['name'] = 'other name'
    expect(sut.props.name).toEqual('other name')
    expect(typeof sut.props.name).toBe('string')
  })
  it('GET password field', () => {
    expect(sut.props.password).toBeDefined()
    expect(sut.props.password).toEqual(props.password)
    expect(typeof sut.props.password).toBe('string')
  })
  it('SET password field', () => {
    sut['password'] = 'other password'
    expect(sut.props.password).toEqual('other password')
    expect(typeof sut.props.password).toBe('string')
  })
  it('GET email field', () => {
    expect(sut.props.email).toBeDefined()
    expect(sut.props.email).toEqual(props.email)
    expect(typeof sut.props.email).toBe('string')
  })
  it('GET createdAt field', () => {
    expect(sut.props.createdAt).toBeDefined()
    expect(sut.props.createdAt).toBeInstanceOf(Date)
  })

  it('Should updated a user name', () => {
    sut.update('other name')
    expect(UserEntity.validate).toHaveBeenCalled()
    expect(sut.props.name).toEqual('other name')
  })
  it('Should updated a user password', () => {
    sut.updatePassword('other password')
    expect(UserEntity.validate).toHaveBeenCalled()
    expect(sut.props.password).toEqual('other password')
  })
})
