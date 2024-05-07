import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'

import { FetchNearbyUseCase } from '.'

let gymsRepository: InMemoryGymsRepository

let sut: FetchNearbyUseCase

describe('Fetch Nearby Gyms Use Case', () => {
  // beforeEach => função que executada antes de cada um dos testes. Definindo um contexto limpo para cada um dos testes.
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()

    sut = new FetchNearbyUseCase(gymsRepository)
  })

  it('Deve ser possível buscar pelas academias próximas dos usuário (até 10km).', async () => {
    await gymsRepository.create({
      title: 'Academia Próxima',
      description: null,
      phone: null,
      latitude: -27.2092052,
      longitude: -49.6401091,
    })

    await gymsRepository.create({
      title: 'Academia Longe',
      description: null,
      phone: null,
      latitude: -27.0610928,
      longitude: -49.5229501,
    })

    const { gyms } = await sut.execute({
      userLatitude: -27.2092052,
      userLongitude: -49.6401091,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Academia Próxima' }),
    ])
  })
})
