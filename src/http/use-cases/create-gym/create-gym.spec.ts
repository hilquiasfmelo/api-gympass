import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'

import { CreateGymUseCase } from '.'

let gymsRepository: InMemoryGymsRepository
let sut: CreateGymUseCase

describe('Create Gym Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new CreateGymUseCase(gymsRepository)
  })

  it('Deve ser possível criar uma academia.', async () => {
    const { gym } = await sut.execute({
      title: 'Academia do Hilquias',
      description: null,
      phone: null,
      latitude: -2.557903,
      longitude: -44.1990842,
    })

    // Espero que Id do usuário criado seja igual a qualquer string
    expect(gym.id).toEqual(expect.any(String))
  })
})
