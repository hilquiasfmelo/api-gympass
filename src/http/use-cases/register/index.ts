import type { User } from '@prisma/client'
import { hash } from 'bcryptjs'

import { UsersRepository } from '@/repositories/interfaces/users-repository'

import { UserAlreadyExistsError } from './errors/user-already-exists-error'

interface RegisterUseCaseRequest {
  name: string
  email: string
  password: string
  role: 'ADMIN' | 'MEMBER'
}

interface RegisterUseCaseResponse {
  user: User
}

export class RegisterUseCase {
  // Obtendo as dependências do caso de uso ao invés de instância-las.
  constructor(private usersRepository: UsersRepository) {}

  // execute => Único método a ser chamado desse caso de uso.
  async execute({
    name,
    email,
    password,
    role,
  }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
    // Gerando hash da senha.
    const password_hash = await hash(password, 6)

    // Busca no banco de dados se tem algum usuário criado com esse e-mail.
    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError()
    }

    const user = await this.usersRepository.create({
      name,
      email,
      password_hash,
      role,
    })

    return { user }
  }
}
