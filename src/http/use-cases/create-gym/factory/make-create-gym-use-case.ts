import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository'

import { CreateGymUseCase } from '..'

export function makeCreateGymUseCase() {
  const prismaGymsRepository = new PrismaGymsRepository()

  const createGymUseCase = new CreateGymUseCase(prismaGymsRepository)

  return createGymUseCase
}
