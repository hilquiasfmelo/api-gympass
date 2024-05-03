import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'

import { SearchGymsUseCase } from '.'

let gymsRepository: InMemoryGymsRepository

let sut: SearchGymsUseCase

describe('Search Gyms Use Case', () => {
  // beforeEach => função que executada antes de cada um dos testes. Definindo um contexto limpo para cada um dos testes.
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()

    sut = new SearchGymsUseCase(gymsRepository)
  })

  it('Deve ser possível buscar pelas academias pelo nome delas.', async () => {
    await gymsRepository.create({
      title: 'Academia do Hilquias',
      description: null,
      phone: null,
      latitude: -2.557903,
      longitude: -44.1990842,
    })

    await gymsRepository.create({
      title: 'Academia do Benjamin',
      description: null,
      phone: null,
      latitude: -2.557903,
      longitude: -44.1990842,
    })

    const { gyms } = await sut.execute({
      query: 'Benjamin',
      page: 1,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Academia do Benjamin' }),
    ])
  })

  it('Deve ser capaz de buscar pesquisa paginada de academias.', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `Academia ${i}`,
        description: null,
        phone: null,
        latitude: -2.557903,
        longitude: -44.1990842,
      })
    }

    const { gyms } = await sut.execute({
      query: 'Academia',
      page: 2,
    })

    // Espero que a lista de academias tenha um tamanho de 2.
    expect(gyms).toHaveLength(2)
    // Espero que no academias contenha 2 objetos com os ids das academais.
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Academia 21' }),
      expect.objectContaining({ title: 'Academia 22' }),
    ])
  })
})
