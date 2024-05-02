import type { User } from '@prisma/client'
import { compare } from 'bcryptjs'

import { UsersRepository } from '@/repositories/interfaces/users-repository'

import { InvalidCredentialsError } from './errors/invalid-credentials-error'

interface AuthenticateUseCaseRequest {
  email: string
  password: string
}

interface AuthenticateUseCaseResponse {
  user: User
}

export class AuthenticateUseCase {
  constructor(private userRepository: UsersRepository) {}

  async execute({
    email,
    password,
  }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
    // Valida se o email que o usuário está informando existe na base de dados
    const user = await this.userRepository.findByEmail(email)

    if (!user) {
      throw new InvalidCredentialsError()
    }

    // Valida se a senha que o usuário está informando bate com a que está na base de dados
    const doesPasswordMatches = await compare(password, user.password_hash)

    if (!doesPasswordMatches) {
      throw new InvalidCredentialsError()
    }

    return {
      user,
    }
  }
}
