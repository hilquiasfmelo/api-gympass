import { Decimal } from '@prisma/client/runtime/library'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'

import { CheckInUseCase } from '.'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

describe('Check-in Use Case', () => {
  // beforeEach => função que executada antes de cada um dos testes. Definindo um contexto limpo para cada um dos testes.
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInUseCase(checkInsRepository, gymsRepository)

    gymsRepository.items.push({
      id: 'gym-id',
      title: 'JavaScript Gym',
      description: '',
      phone: '',
      latitude: new Decimal(0),
      longitude: new Decimal(0),
    })

    // Define uma data fake para os campos de data.
    vi.useFakeTimers()
  })

  // Depois dos testes, reseta essas datas fakes inserindo datas reais.
  afterEach(() => {
    vi.useRealTimers()
  })

  it('Deve ser possível criar um check in.', async () => {
    const { checkIn } = await sut.execute({
      userId: 'user-id',
      gymId: 'gym-id',
      userLatitude: 0,
      userLongitude: 0,
    })

    // Espero que Id do usuário criado seja igual a qualquer string.
    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('Não deve ser possível fazer o check in duas vezes no mesmo dia.', async () => {
    // Cria um mocking de data fake para os testes e depois de executar, volta as datas reais.
    // new Date(2022, 0, 20, 8, 0, 0) => ano | mês | dia | minuto | segundo.
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      userId: 'user-id',
      gymId: 'gym-id',
      userLatitude: 0,
      userLongitude: 0,
    })

    expect(async () => {
      await sut.execute({
        userId: 'user-id',
        gymId: 'gym-id',
        userLatitude: 0,
        userLongitude: 0,
      })
    }).rejects.toBeInstanceOf(Error)
  })

  it('Deve ser possível fazer check in em dias diferentes.', async () => {
    // Cria um mocking de data fake para os testes e depois de executar, volta as datas reais.
    // new Date(2022, 0, 20, 8, 0, 0) => ano | mês | dia | minuto | segundo.
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      userId: 'user-id',
      gymId: 'gym-id',
      userLatitude: 0,
      userLongitude: 0,
    })

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))

    const { checkIn } = await sut.execute({
      userId: 'user-id',
      gymId: 'gym-id',
      userLatitude: 0,
      userLongitude: 0,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })
})
