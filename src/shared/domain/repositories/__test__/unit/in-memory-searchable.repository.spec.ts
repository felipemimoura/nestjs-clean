import { Entity } from '@/shared/domain/entities/entity'
import { InMemorySearchableRepository } from '../../in-memory-searchable.repository'

type StubEntityProps = {
  name: string
  price: number
}
class StubEntity extends Entity<StubEntityProps> {}

class StubInMemorySearchableRepository extends InMemorySearchableRepository<StubEntity> {
  sortableFields: string[] = ['name']

  protected async applyFilter(
    items: StubEntity[],
    filter: string | null,
  ): Promise<StubEntity[]> {
    if (!filter) {
      return items
    }

    return items.filter(items => {
      return items.props.name.toLowerCase().includes(filter.toLowerCase())
    })
  }
}

describe('InMemorySearchableRepository unit test', () => {
  let sut = new StubInMemorySearchableRepository()

  beforeEach(() => {
    sut = new StubInMemorySearchableRepository()
  })

  describe('apply filter method', () => {
    it('should no filter when filter params is null', async () => {
      const items = [new StubEntity({ name: 'name value', price: 10 })]
      const spyFilterMethod = jest.spyOn(items, 'filter')

      const itemsFiltered = await sut['applyFilter'](items, null)

      expect(itemsFiltered).toStrictEqual(items)
      expect(spyFilterMethod).not.toHaveBeenCalled()
    })

    it('should filter using a filter params', async () => {
      const items = [
        new StubEntity({ name: 'test', price: 10 }),
        new StubEntity({ name: 'TEST', price: 10 }),
        new StubEntity({ name: 'fake', price: 10 }),
      ]
      const spyFilterMethod = jest.spyOn(items, 'filter')

      let itemsFiltered = await sut['applyFilter'](items, 'TEST')

      expect(itemsFiltered).toStrictEqual([items[0], items[1]])
      expect(spyFilterMethod).toHaveBeenCalledTimes(1)

      itemsFiltered = await sut['applyFilter'](items, 'test')

      expect(itemsFiltered).toStrictEqual([items[0], items[1]])
      expect(spyFilterMethod).toHaveBeenCalledTimes(2)

      itemsFiltered = await sut['applyFilter'](items, 'no-filter')

      expect(itemsFiltered).toHaveLength(0)
      expect(spyFilterMethod).toHaveBeenCalledTimes(3)
    })
  })
  describe('apply sort method', () => {
    it('should no sort itens', async () => {
      const items = [
        new StubEntity({ name: 'b', price: 10 }),
        new StubEntity({ name: 'a', price: 10 }),
      ]

      const itemsSorted = await sut['applySort'](items, null, null)

      expect(itemsSorted).toStrictEqual(items)
    })
    it('should no sort itens by invalid sortable fields', async () => {
      const items = [
        new StubEntity({ name: 'b', price: 10 }),
        new StubEntity({ name: 'a', price: 10 }),
      ]

      const itemsSorted = await sut['applySort'](items, 'price', 'asc')

      expect(itemsSorted).toStrictEqual(items)
    })

    it('should be sort itens asc', async () => {
      const items = [
        new StubEntity({ name: 'b', price: 10 }),
        new StubEntity({ name: 'a', price: 10 }),
        new StubEntity({ name: 'c', price: 10 }),
      ]

      const itemsSorted = await sut['applySort'](items, 'name', 'asc')

      expect(itemsSorted).toStrictEqual([items[1], items[0], items[2]])
    })
    it('should be sort itens desc', async () => {
      const items = [
        new StubEntity({ name: 'b', price: 10 }),
        new StubEntity({ name: 'a', price: 10 }),
        new StubEntity({ name: 'c', price: 10 }),
      ]

      const itemsSorted = await sut['applySort'](items, 'name', 'desc')

      expect(itemsSorted).toStrictEqual([items[2], items[0], items[1]])
    })
  })
  describe('apply paginate method', () => {})
  describe('search method', () => {})
})
