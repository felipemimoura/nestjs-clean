import { SearchParams } from '../../searchable-repository-contracts'

describe('Searchable repository', () => {
  describe('SearchParams test', () => {
    it('page props', () => {
      const sut = new SearchParams()

      expect(sut.page).toBe(1)

      const params = [
        {
          page: null as any,
          expected: 1,
        },
        {
          page: undefined as any,
          expected: 1,
        },
        {
          page: '' as any,
          expected: 1,
        },
        {
          page: 'teste' as any,
          expected: 1,
        },
        {
          page: 0 as any,
          expected: 1,
        },
        {
          page: -1 as any,
          expected: 1,
        },
        {
          page: 5.5 as any,
          expected: 1,
        },
        {
          page: true as any,
          expected: 1,
        },
        {
          page: false,
          expected: 1,
        },
        {
          page: {},
          expected: 1,
        },
        {
          page: 1,
          expected: 1,
        },
        {
          page: 2,
          expected: 2,
        },
      ]

      params.forEach(param => {
        expect(new SearchParams({ page: param.page }).page).toBe(param.expected)
      })
    })
    it('perPage', () => {
      const sut = new SearchParams()

      expect(sut.perPage).toBe(15)

      const params = [
        {
          perPage: null as any,
          expected: 15,
        },
        {
          perPage: undefined as any,
          expected: 15,
        },
        {
          perPage: '' as any,
          expected: 15,
        },
        {
          perPage: 'teste' as any,
          expected: 15,
        },
        {
          perPage: 0 as any,
          expected: 15,
        },
        {
          perPage: -1 as any,
          expected: 15,
        },
        {
          perPage: 5.5 as any,
          expected: 15,
        },
        {
          perPage: true as any,
          expected: 15,
        },
        {
          perPage: false,
          expected: 15,
        },
        {
          perPage: {},
          expected: 15,
        },
        {
          perPage: 1,
          expected: 1,
        },
        {
          perPage: 2,
          expected: 2,
        },
        {
          perPage: 25,
          expected: 25,
        },
      ]

      params.forEach(param => {
        expect(new SearchParams({ perPage: param.perPage }).perPage).toBe(
          param.expected,
        )
      })
    })
  })
})
