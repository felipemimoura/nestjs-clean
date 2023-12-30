import { Entity } from '@/shared/domain/entities/entity'
import { InMemoryRepository } from '../../in-memory.repository'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'

type StubEntityProps = {
  name: string
  price: number
}
class StubEntity extends Entity<StubEntityProps> {}

class StubInMemoryRepository extends InMemoryRepository<StubEntity> {}

describe('In Memory Repository unit test', () => {
  let sut: StubInMemoryRepository

  beforeEach(() => {
    sut = new StubInMemoryRepository()
  })

  it('Should insert a new entity', async () => {
    const entity = new StubEntity({ name: 'test name', price: 50 })

    await sut.insert(entity)

    expect(entity.toJSON()).toStrictEqual(sut.items[0].toJSON())
  })

  it('Should throw error when entity not found', async () => {
    await expect(sut.findById('fake-id')).rejects.toThrow(
      new NotFoundError('Entity not found'),
    )
  })

  it('Should find a entity by Id', async () => {
    const entity = new StubEntity({ name: 'test name', price: 50 })

    await sut.insert(entity)

    const result = await sut.findById(entity._id)

    expect(entity.toJSON()).toStrictEqual(result.toJSON())
  })
  it('Should return all entities ', async () => {
    const entity = new StubEntity({ name: 'test name', price: 50 })

    await sut.insert(entity)

    const result = await sut.findAll()

    expect([entity]).toStrictEqual(result)
  })

  it('Should throw error when on update when entity not found', async () => {
    const entity = new StubEntity({ name: 'test name', price: 50 })
    await expect(sut.update(entity)).rejects.toThrow(
      new NotFoundError('Entity not found'),
    )
  })

  it('Should updated a entity', async () => {
    // Create a new entity
    const entity = new StubEntity({ name: 'test name', price: 50 })

    //Save entity on Entity
    await sut.insert(entity)

    // create a new entity to updated entity before
    const entityUpdated = new StubEntity(
      { name: 'other name', price: 10 },
      entity._id,
    )

    // update entity
    await sut.update(entityUpdated)

    //Verify entity was updated
    expect(entityUpdated.toJSON()).toStrictEqual(sut.items[0].toJSON())
  })

  it('Should throw error when entity not found', async () => {
    await expect(sut.delete('fake-id')).rejects.toThrow(
      new NotFoundError('Entity not found'),
    )
  })

  it('Should delete a entity', async () => {
    // Create a new entity
    const entity = new StubEntity({ name: 'test name', price: 50 })

    //Save entity on Entity
    await sut.insert(entity)

    // update entity
    await sut.delete(entity._id)

    //Verify if not have entity
    expect(sut.items).toHaveLength(0)
  })
})
