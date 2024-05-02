import type { User } from '@prisma/client'

import type { UsersRepository } from '@/repositories/interfaces/users-repository'

import { ResourceNotFoundError } from '../errors/resource-not-found-error'

interface GetUserProfileUseCaseRequest {
  userId: string
}

interface GetUserProfileUseCaseResponse {
  user: User
}

export class GetUserProfileUseCase {
  constructor(private userRepository: UsersRepository) {}

  async execute({
    userId,
  }: GetUserProfileUseCaseRequest): Promise<GetUserProfileUseCaseResponse> {
    // Valida se o usuário existe na base de dados.
    const user = await this.userRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    return {
      user,
    }
  }
}
