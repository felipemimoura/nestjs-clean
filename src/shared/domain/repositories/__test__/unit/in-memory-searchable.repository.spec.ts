import { Entity } from '@/shared/domain/entities/entity'
import { InMemorySearchableRepository } from '../../in-memory-searchable.repository'
import {
  SearchParams,
  SearchResult,
} from '../../searchable-repository-contracts'

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
  describe('apply paginate method', () => {
    it('should paginate items', async () => {
      const items = [
        new StubEntity({ name: 'b', price: 10 }),
        new StubEntity({ name: 'a', price: 10 }),
        new StubEntity({ name: 'c', price: 10 }),
        new StubEntity({ name: 'd', price: 10 }),
        new StubEntity({ name: 'e', price: 10 }),
      ]

      let itemsPaginated = await sut['applyPaginate'](items, 1, 2)

      expect(itemsPaginated).toStrictEqual([items[0], items[1]])

      itemsPaginated = await sut['applyPaginate'](items, 2, 2)

      expect(itemsPaginated).toStrictEqual([items[2], items[3]])

      itemsPaginated = await sut['applyPaginate'](items, 3, 2)

      expect(itemsPaginated).toStrictEqual([items[4]])

      itemsPaginated = await sut['applyPaginate'](items, 4, 2)

      expect(itemsPaginated).toStrictEqual([])
    })
  })
  describe('search method', () => {
    it('should apply only pagination when the order params are null', async () => {
      const entity = new StubEntity({ name: 'teste', price: 10 })
      const items = Array(16).fill(entity)

      sut.items = items

      const params = await sut.search(new SearchParams())

      expect(params).toStrictEqual(
        new SearchResult({
          items: Array(15).fill(entity),
          total: 16,
          currentPage: 1,
          perPage: 15,
          sort: null,
          sortDir: null,
          filter: null,
        }),
      )
    })

    it('should apply  pagination and filter', async () => {
      const items = [
        new StubEntity({ name: 'teste', price: 10 }),
        new StubEntity({ name: 'a', price: 10 }),
        new StubEntity({ name: 'TESTE', price: 10 }),
        new StubEntity({ name: 'TeStE', price: 10 }),
      ]

      sut.items = items

      let params = await sut.search(
        new SearchParams({
          page: 1,
          perPage: 2,
          filter: 'TESTE',
        }),
      )

      expect(params).toStrictEqual(
        new SearchResult({
          items: [items[0], items[2]],
          total: 3,
          currentPage: 1,
          perPage: 2,
          sort: null,
          sortDir: null,
          filter: 'TESTE',
        }),
      )
      params = await sut.search(
        new SearchParams({
          page: 2,
          perPage: 2,
          filter: 'TESTE',
        }),
      )

      expect(params).toStrictEqual(
        new SearchResult({
          items: [items[3]],
          total: 3,
          currentPage: 2,
          perPage: 2,
          sort: null,
          sortDir: null,
          filter: 'TESTE',
        }),
      )
    })
    it('should apply  pagination and sort', async () => {
      const items = [
        new StubEntity({ name: 'b', price: 10 }),
        new StubEntity({ name: 'a', price: 10 }),
        new StubEntity({ name: 'd', price: 10 }),
        new StubEntity({ name: 'e', price: 10 }),
        new StubEntity({ name: 'c', price: 10 }),
      ]

      sut.items = items

      let params = await sut.search(
        new SearchParams({
          page: 1,
          perPage: 2,
          sort: 'name',
        }),
      )

      expect(params).toStrictEqual(
        new SearchResult({
          items: [items[3], items[2]],
          total: 5,
          currentPage: 1,
          perPage: 2,
          sort: 'name',
          sortDir: 'desc',
          filter: null,
        }),
      )
      params = await sut.search(
        new SearchParams({
          page: 2,
          perPage: 2,
          sort: 'name',
        }),
      )

      expect(params).toStrictEqual(
        new SearchResult({
          items: [items[4], items[0]],
          total: 5,
          currentPage: 2,
          perPage: 2,
          sort: 'name',
          sortDir: 'desc',
          filter: null,
        }),
      )
      params = await sut.search(
        new SearchParams({
          page: 1,
          perPage: 2,
          sort: 'name',
          sortDir: 'asc',
        }),
      )

      expect(params).toStrictEqual(
        new SearchResult({
          items: [items[1], items[0]],
          total: 5,
          currentPage: 1,
          perPage: 2,
          sort: 'name',
          sortDir: 'asc',
          filter: null,
        }),
      )
      params = await sut.search(
        new SearchParams({
          page: 3,
          perPage: 2,
          sort: 'name',
          sortDir: 'asc',
        }),
      )

      expect(params).toStrictEqual(
        new SearchResult({
          items: [items[3]],
          total: 5,
          currentPage: 3,
          perPage: 2,
          sort: 'name',
          sortDir: 'asc',
          filter: null,
        }),
      )
    })

    it('should search using pagination, sort and filter', async () => {
      const items = [
        new StubEntity({ name: 'teste', price: 10 }),
        new StubEntity({ name: 'a', price: 10 }),
        new StubEntity({ name: 'TESTE', price: 10 }),
        new StubEntity({ name: 'e', price: 10 }),
        new StubEntity({ name: 'TeStE', price: 10 }),
      ]

      sut.items = items

      let params = await sut.search(
        new SearchParams({
          page: 1,
          perPage: 2,
          sort: 'name',
          filter: 'TESTE',
        }),
      )

      expect(params).toStrictEqual(
        new SearchResult({
          items: [items[0], items[4]],
          total: 3,
          currentPage: 1,
          perPage: 2,
          sort: 'name',
          sortDir: 'desc',
          filter: 'TESTE',
        }),
      )

      params = await sut.search(
        new SearchParams({
          page: 2,
          perPage: 2,
          sort: 'name',
          filter: 'TESTE',
        }),
      )

      expect(params).toStrictEqual(
        new SearchResult({
          items: [items[2]],
          total: 3,
          currentPage: 2,
          perPage: 2,
          sort: 'name',
          sortDir: 'desc',
          filter: 'TESTE',
        }),
      )
    })
  })
})
