import { randomUUID } from 'node:crypto'

import { Gym, Prisma } from '@prisma/client'

import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates'

import type {
  FindManyNearbyParams,
  GymsRepository,
} from '../interfaces/gyms-repository'

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

  // Retorna as academias cadastradas que estão à menos de 10km de distância do usuário.
  async findManyNearby(params: FindManyNearbyParams) {
    return this.items.filter((item) => {
      const distance = getDistanceBetweenCoordinates(
        {
          latitude: params.latitude,
          longitude: params.longitude,
        },
        {
          // Tem que ser convertido para um número, pois o Prisma retorna um valor do tipo Decimal.
          latitude: item.latitude.toNumber(),
          longitude: item.longitude.toNumber(),
        },
      )

      return distance < 10
    })
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
