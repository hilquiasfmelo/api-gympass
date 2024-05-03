import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'

import { GetUserMetricsUseCase } from '.'

let checkInsRepository: InMemoryCheckInsRepository

let sut: GetUserMetricsUseCase

describe('Get User Metrics Use Case', () => {
  // beforeEach => função que executada antes de cada um dos testes. Definindo um contexto limpo para cada um dos testes.
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()

    sut = new GetUserMetricsUseCase(checkInsRepository)
  })

  it('Deve ser possível buscar a quantidade de check ins realizado pelo usuário.', async () => {
    await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })

    await checkInsRepository.create({
      gym_id: 'gym-02',
      user_id: 'user-01',
    })

    const { checkInsCount } = await sut.execute({
      userId: 'user-01',
    })

    // Espero que a lista de check-ins tenha um tamanho de 2.
    expect(checkInsCount).toEqual(2)
  })
})
