import { validate as uuidValidade } from 'uuid'
import { Entity } from '../../entity'

type StubProps = {
  props1: string
  prop2: number
}
class StubEntity extends Entity<StubProps> {}
describe('Entity test', () => {
  it('Should set props and id', () => {
    const props = { props1: 'value', prop2: 3 }

    const entity = new StubEntity(props)

    expect(entity.props).toStrictEqual(props)
    expect(entity._id).not.toBeNull()
    expect(uuidValidade(entity._id)).toBeTruthy()
  })
  it('Should accept a valid uuid', () => {
    const props = { props1: 'value', prop2: 3 }
    const id = '7845c380-131a-429c-a1d0-2fa2301fb903'

    const entity = new StubEntity(props, id)

    expect(uuidValidade(entity._id)).toBeTruthy()
    expect(entity._id).toBe(id)
  })
  it('Should convert a entity to a Javascript Object', () => {
    const props = { props1: 'value', prop2: 3 }
    const id = '7845c380-131a-429c-a1d0-2fa2301fb903'

    const entity = new StubEntity(props, id)

    expect(entity.toJSON()).toStrictEqual({
      id,
      ...props,
    })
  })
})
