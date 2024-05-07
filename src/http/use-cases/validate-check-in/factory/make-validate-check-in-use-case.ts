import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository'

import { ValidateCheckInUseCase } from '..'

export function makeValidateCheckInUseCase() {
  const prismaCheckInsRepository = new PrismaCheckInsRepository()

  const validateCheckInUseCase = new ValidateCheckInUseCase(
    prismaCheckInsRepository,
  )

  return validateCheckInUseCase
}
