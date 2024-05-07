import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository'

import { FetchNearbyUseCase } from '..'

export function makeFetchNearbyUseCase() {
  const prismaGymsRepository = new PrismaGymsRepository()

  const fetchNearbyUseCase = new FetchNearbyUseCase(prismaGymsRepository)

  return fetchNearbyUseCase
}
