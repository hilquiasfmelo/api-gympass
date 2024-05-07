import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository'

import { FetchUserCheckInsHistoryUseCase } from '..'

export function makeFetchUserCheckInsHistoryUseCase() {
  const prismaCheckInsRepository = new PrismaCheckInsRepository()

  const fetchUserCheckInsHistoryUseCase = new FetchUserCheckInsHistoryUseCase(
    prismaCheckInsRepository,
  )

  return fetchUserCheckInsHistoryUseCase
}
