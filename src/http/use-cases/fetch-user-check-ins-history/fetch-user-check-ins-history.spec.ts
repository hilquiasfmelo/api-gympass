import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'

import { FetchUserCheckInsHistoryUseCase } from '.'

let checkInsRepository: InMemoryCheckInsRepository

let sut: FetchUserCheckInsHistoryUseCase

describe('Fetch User Check-ins History Use Case', () => {
  // beforeEach => função que executada antes de cada um dos testes. Definindo um contexto limpo para cada um dos testes.
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()

    sut = new FetchUserCheckInsHistoryUseCase(checkInsRepository)
  })

  it('Deve ser possível buscar o histórico de check ins do usuário.', async () => {
    await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })

    await checkInsRepository.create({
      gym_id: 'gym-02',
      user_id: 'user-01',
    })

    const { checkIns } = await sut.execute({
      userId: 'user-01',
      page: 1,
    })

    // Espero que a lista de check-ins tenha um tamanho de 2.
    expect(checkIns).toHaveLength(2)
    // Espero que no checkIns contenha 2 objetos com os ids das academais.
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gym-01' }),
      expect.objectContaining({ gym_id: 'gym-02' }),
    ])
  })

  it('Deve ser possível obter uma lista paginada do histórico de check ins do usuário.', async () => {
    for (let i = 1; i <= 22; i++) {
      await checkInsRepository.create({
        gym_id: `gym-${i}`,
        user_id: 'user-01',
      })
    }

    const { checkIns } = await sut.execute({
      userId: 'user-01',
      page: 2,
    })

    // Espero que a lista de check-ins tenha um tamanho de 2.
    expect(checkIns).toHaveLength(2)
    // Espero que no checkIns contenha 2 objetos com os ids das academais.
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gym-21' }),
      expect.objectContaining({ gym_id: 'gym-22' }),
    ])
  })
})
