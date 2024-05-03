import { randomUUID } from 'node:crypto'

import { Gym, Prisma } from '@prisma/client'

import type { GymsRepository } from '../interfaces/gyms-repository'

export class InMemoryGymsRepository implements GymsRepository {
  // Criação da base de dados fictícia
  public items: Gym[] = []

  async searchMany(query: string, page: number) {
    return this.items
      .filter((item) => item.title.includes(query))
      .slice((page - 1) * 20, page * 20)
  }

  async findById(id: string) {
    const gym = this.items.find((item) => item.id === id)

    if (!gym) {
      return null
    }

    return gym
  }

  async create(data: Prisma.GymCreateInput) {
    const gym = {
      id: data.id ?? randomUUID(),
      title: data.title,
      description: data.description ?? null,
      phone: data.phone ?? null,
      latitude: new Prisma.Decimal(data.latitude.toString()),
      longitude: new Prisma.Decimal(data.longitude.toString()),
      // TODO: Verificar se é necessário adicionar o created_at.
    }

    this.items.push(gym)

    return gym
  }
}
