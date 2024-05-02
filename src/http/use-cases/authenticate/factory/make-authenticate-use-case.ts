import { PrismaUsersRepository } from '@/repositories/prisma/prisma-user-repository'

import { AuthenticateUseCase } from '..'

export function makeAuthenticateUseCase() {
  const prismaUsersRepository = new PrismaUsersRepository()

  const authenticateUseCase = new AuthenticateUseCase(prismaUsersRepository)

  return authenticateUseCase
}
