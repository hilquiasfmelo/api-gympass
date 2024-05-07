import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'

import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { ValidateCheckInUseCase } from '.'
import { LateCheckInValidationError } from './errors/late-check-in-validation-error'

let checkInsRepository: InMemoryCheckInsRepository
let sut: ValidateCheckInUseCase

describe('Validate Check-in Use Case', () => {
  // beforeEach => função que executada antes de cada um dos testes. Definindo um contexto limpo para cada um dos testes.
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new ValidateCheckInUseCase(checkInsRepository)

    // Define uma data fake para os campos de data.
    vi.useFakeTimers()
  })

  // Depois dos testes, reseta essas datas fakes inserindo datas reais.
  afterEach(() => {
    vi.useRealTimers()
  })

  it('Deve ser possível validar o check in.', async () => {
    const createdCheckIn = await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })

    const { checkIn } = await sut.execute({
      checkInId: createdCheckIn.id,
    })

    // Espero que campo validated_at do usuário criado seja igual a qualquer valor do tipo Date.
    expect(checkIn.validated_at).toEqual(expect.any(Date))

    // Busca dentro da base de dados em memória o primeiro item do array de check ins validando se existe no campo validated_at qualquer valor do tipo Date.
    expect(checkInsRepository.items[0].validated_at).toEqual(expect.any(Date))
  })

  it('Não deve ser possível validar um check in que não existe.', async () => {
    expect(async () => {
      await sut.execute({
        checkInId: 'check-in-id-no-existent',
      })
    }).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('Não deve ser possível validar um check in após 20 minutos da sua criação.', async () => {
    // Cria um mocking de data fake para os testes e depois de executar, volta as datas reais.
    // new Date(2022, 0, 20, 8, 0, 0) => ano | mês | dia | minuto | segundo.
    vi.setSystemTime(new Date(2023, 0, 1, 13, 40))

    const createdCheckIn = await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })

    // 21 minutos em miléssimos de segundos.
    const twentyOneMinutesInMs = 1000 * 60 * 21

    // Essa função faz com que avançamos no tempo 21 minutos pra frente.
    vi.advanceTimersByTime(twentyOneMinutesInMs)

    expect(async () => {
      await sut.execute({
        checkInId: createdCheckIn.id,
      })
    }).rejects.toBeInstanceOf(LateCheckInValidationError)
  })
})
