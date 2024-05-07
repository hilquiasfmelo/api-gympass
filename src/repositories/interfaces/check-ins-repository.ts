import { type CheckIn, Prisma } from '@prisma/client'

export interface CheckInsRepository {
  findById(id: string): Promise<CheckIn | null>

  // CheckInUncheckedCreateInput => traz consigo, já o id do usuário e da academia previamente criadas.
  create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>

  // Busca se existe um check-in de um usuário em uma determinada data.
  findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null>

  // Busca todos os check ins de um usuário.
  findManyByUserId(userId: string, page: number): Promise<CheckIn[]>

  // Busca a quantidade de check ins feito pelo usuário.
  countByUserId(userId: string): Promise<number>

  // Atualiza o check in para um novo valor na base dados.
  save(checkIn: CheckIn): Promise<CheckIn>
}
