import type { Gym } from '@prisma/client'

import type { GymsRepository } from '../interfaces/gyms-repository'

export class InMemoryGymsRepository implements GymsRepository {
  // Criação da base de dados fictícia
  public items: Gym[] = []

  async findById(id: string) {
    const gym = this.items.find((item) => item.id === id)

    if (!gym) {
      return null
    }

    return gym
  }
}
