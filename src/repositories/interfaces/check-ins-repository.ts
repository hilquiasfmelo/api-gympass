import { type CheckIn, Prisma } from '@prisma/client'

export interface CheckInsRepository {
  // CheckInUncheckedCreateInput => traz consigo, já o id do usuário e da academia previamente criadas.
  create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>
  // Busca se existe um check-in de um usuário em uma determinada data.
  findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null>
}
