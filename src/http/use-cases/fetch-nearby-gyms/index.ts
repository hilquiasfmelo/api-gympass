import type { Gym } from '@prisma/client'

import type { GymsRepository } from '@/repositories/interfaces/gyms-repository'

interface FetchNearbyUseCaseRequest {
  userLatitude: number
  userLongitude: number
}

interface FetchNearbyUseCaseResponse {
  gyms: Gym[]
}

export class FetchNearbyUseCase {
  // Obtendo as dependências do caso de uso ao invés de instância-las.
  constructor(private gymsRepository: GymsRepository) {}

  // execute => Único método a ser chamado desse caso de uso.
  async execute({
    userLatitude,
    userLongitude,
  }: FetchNearbyUseCaseRequest): Promise<FetchNearbyUseCaseResponse> {
    const gyms = await this.gymsRepository.findManyNearby({
      latitude: userLatitude,
      longitude: userLongitude,
    })

    return {
      gyms,
    }
  }
}
