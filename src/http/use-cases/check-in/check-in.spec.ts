import { Decimal } from '@prisma/client/runtime/library'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'

import { CheckInUseCase } from '.'
import { MaxDistanceError } from './errors/max-distance-error'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

describe('Check-in Use Case', () => {
  // beforeEach => função que executada antes de cada um dos testes. Definindo um contexto limpo para cada um dos testes.
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInUseCase(checkInsRepository, gymsRepository)

    await gymsRepository.create({
      id: 'gym-id',
      title: 'JavaScript Gym',
      description: '',
      phone: '',
      latitude: -2.557903,
      longitude: -44.1990842,
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
      userLatitude: -2.557903,
      userLongitude: -44.1990842,
    })

    // Espero que Id do usuário criado seja igual a qualquer string.
    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('Não deve ser possível criar o check in distante da academia.', async () => {
    gymsRepository.items.push({
      id: 'gym-02',
      title: 'JavaScript Gym',
      description: '',
      phone: '',
      // distância a mais de 100 metros.
      latitude: new Decimal(-2.5295026),
      longitude: new Decimal(-44.2454609),
    })

    expect(async () => {
      await sut.execute({
        userId: 'user-id',
        gymId: 'gym-02',
        userLatitude: -2.557903,
        userLongitude: -44.1990842,
      })
    }).rejects.toBeInstanceOf(MaxDistanceError)
  })

  it('Não deve ser possível fazer o check in duas vezes no mesmo dia.', async () => {
    // Cria um mocking de data fake para os testes e depois de executar, volta as datas reais.
    // new Date(2022, 0, 20, 8, 0, 0) => ano | mês | dia | minuto | segundo.
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      userId: 'user-id',
      gymId: 'gym-id',
      userLatitude: -2.557903,
      userLongitude: -44.1990842,
    })

    expect(async () => {
      await sut.execute({
        userId: 'user-id',
        gymId: 'gym-id',
        userLatitude: -2.557903,
        userLongitude: -44.1990842,
      })
    }).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })

  it('Deve ser possível fazer check in em dias diferentes.', async () => {
    // Cria um mocking de data fake para os testes e depois de executar, volta as datas reais.
    // new Date(2022, 0, 20, 8, 0, 0) => ano | mês | dia | minuto | segundo.
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      userId: 'user-id',
      gymId: 'gym-id',
      userLatitude: -2.557903,
      userLongitude: -44.1990842,
    })

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))

    const { checkIn } = await sut.execute({
      userId: 'user-id',
      gymId: 'gym-id',
      userLatitude: -2.557903,
      userLongitude: -44.1990842,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })
})
