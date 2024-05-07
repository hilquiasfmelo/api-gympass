import { PrismaUsersRepository } from '@/repositories/prisma/prisma-user-repository'

import { GetUserProfileUseCase } from '..'

export function makeGetUserProfileUseCase() {
  const prismaUsersRepository = new PrismaUsersRepository()

  const getUserProfileUseCase = new GetUserProfileUseCase(prismaUsersRepository)

  return getUserProfileUseCase
}
