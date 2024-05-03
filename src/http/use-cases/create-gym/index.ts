import type { Gym } from '@prisma/client'

import type { GymsRepository } from '@/repositories/interfaces/gyms-repository'

interface CreateGymUseCaseRequest {
  title: string
  description: string | null
  phone: string | null
  latitude: number
  longitude: number
}

interface CreateGymUseCaseResponse {
  gym: Gym
}

export class CreateGymUseCase {
  // Obtendo as dependências do caso de uso ao invés de instância-las.
  constructor(private gymsRepository: GymsRepository) {}

  // execute => Único método a ser chamado desse caso de uso.
  async execute({
    title,
    description,
    phone,
    latitude,
    longitude,
  }: CreateGymUseCaseRequest): Promise<CreateGymUseCaseResponse> {
    // Busca no banco de dados se tem algum usuário criado com esse e-mail.

    const gym = await this.gymsRepository.create({
      title,
      description,
      phone,
      latitude,
      longitude,
    })

    return {
      gym,
    }
  }
}
