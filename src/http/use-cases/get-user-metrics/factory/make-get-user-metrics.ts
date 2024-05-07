import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository'

import { GetUserMetricsUseCase } from '..'

export function makeGetUserMetricsUseCase() {
  const prismaCheckInsRepository = new PrismaCheckInsRepository()

  const getUserMetricsUseCase = new GetUserMetricsUseCase(
    prismaCheckInsRepository,
  )

  return getUserMetricsUseCase
}
