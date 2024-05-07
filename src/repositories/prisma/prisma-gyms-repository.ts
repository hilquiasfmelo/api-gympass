import type { Gym, Prisma } from '@prisma/client'

import { prisma } from '@/lib/prisma'

import type {
  FindManyNearbyParams,
  GymsRepository,
} from '../interfaces/gyms-repository'

export class PrismaGymsRepository implements GymsRepository {
  async findById(id: string) {
    const gym = await prisma.gym.findUnique({
      where: {
        id,
      },
    })

    return gym
  }

  // Busca as academias cadastradas que estão à menos de 10km de distância do usuário.
  async findManyNearby({ latitude, longitude }: FindManyNearbyParams) {
    // Define o tipo de retorno para a variável gyms.
    const gyms = await prisma.$queryRaw<Gym[]>`
      SELECT * from gyms
      WHERE ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( latitude ) ) ) ) <= 10
    `

    return gyms
  }

  async searchMany(query: string, page: number) {
    const gyms = await prisma.gym.findMany({
      where: {
        title: {
          contains: query,
        },
      },
      // Define quantos itens desejamos trazer.
      take: 20,
      // Define quantos itens desejamos pular.
      skip: (page - 1) * 20,
    })

    return gyms
  }

  async create(data: Prisma.GymCreateInput) {
    const gym = await prisma.gym.create({
      data,
    })

    return gym
  }
}
