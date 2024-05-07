import type { CheckIn } from '@prisma/client'
import dayjs from 'dayjs'

import type { CheckInsRepository } from '@/repositories/interfaces/check-ins-repository'

import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { LateCheckInValidationError } from './errors/late-check-in-validation-error'

interface ValidateCheckInUseCaseRequest {
  checkInId: string
}

interface ValidateCheckInUseCaseResponse {
  checkIn: CheckIn
}

export class ValidateCheckInUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    checkInId,
  }: ValidateCheckInUseCaseRequest): Promise<ValidateCheckInUseCaseResponse> {
    const checkIn = await this.checkInsRepository.findById(checkInId)

    if (!checkIn) {
      throw new ResourceNotFoundError()
    }

    // diff => retorna a diferença entre duas datas, definindo no segundo parâmetro da função qual tipo de distância desejamos calcular.
    const distanceInMinutesFromCheckInInCreation = dayjs(new Date()).diff(
      checkIn.created_at,
      'minutes',
    )

    // Se a data da crição do check in for 20 minutos maior que a data atual o check in não será mais válido.
    if (distanceInMinutesFromCheckInInCreation > 20) {
      throw new LateCheckInValidationError()
    }

    // Defini a data atual para a validar o check in
    checkIn.validated_at = new Date()

    // Atualiza o valor o check in com essa data de validação.
    await this.checkInsRepository.save(checkIn)

    return {
      checkIn,
    }
  }
}
