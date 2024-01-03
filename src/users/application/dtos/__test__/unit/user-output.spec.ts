import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { UserOutputMapper } from '../../user-output'

describe('user output Mapper unit test', () => {
  it('Should be convert user in output', () => {
    const entity = new UserEntity(UserDataBuilder({}))
    const spyOnJson = jest.spyOn(entity, 'toJSON')
    const sut = UserOutputMapper.toOutput(entity)

    expect(spyOnJson).toHaveBeenCalledTimes(1)
    expect(sut).toStrictEqual(entity.toJSON())
  })
})
