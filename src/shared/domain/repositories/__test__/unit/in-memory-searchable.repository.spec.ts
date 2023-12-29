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

  describe('apply filter method', () => {})
  describe('apply sort method', () => {})
  describe('apply paginate method', () => {})
  describe('search method', () => {})
})
