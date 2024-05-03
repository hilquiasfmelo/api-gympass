import type { Gym } from '@prisma/client'

import type { GymsRepository } from '@/repositories/interfaces/gyms-repository'

interface SearchGymsUseCaseRequest {
  query: string
  page: number
}

interface SearchGymsUseCaseResponse {
  gyms: Gym[]
}

export class SearchGymsUseCase {
  // Obtendo as dependências do caso de uso ao invés de instância-las.
  constructor(private gymsRepository: GymsRepository) {}

  // execute => Único método a ser chamado desse caso de uso.
  async execute({
    query,
    page,
  }: SearchGymsUseCaseRequest): Promise<SearchGymsUseCaseResponse> {
    const gyms = await this.gymsRepository.searchMany(query, page)

    return {
      gyms,
    }
  }
}
