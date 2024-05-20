import { hash } from 'bcryptjs'
import type { FastifyInstance } from 'fastify'
import request from 'supertest'

import { prisma } from '@/lib/prisma'

export async function createAndAuthenticateUser(
  app: FastifyInstance,
  isAdmin = false,
) {
  await prisma.user.create({
    data: {
      name: 'Hilquias Ferreira Melo',
      email: 'hilquiasfmelo@gmail.com',
      password_hash: await hash('12345678', 6),
      role: isAdmin ? 'ADMIN' : 'MEMBER',
    },
  })

  const authResponse = await request(app.server).post('/sessions').send({
    email: 'hilquiasfmelo@gmail.com',
    password: '12345678',
  })

  // Buscar os cookies da requisição.
  const cookies = authResponse.get('Set-Cookie') ?? []

  const { token } = authResponse.body

  return { token, cookies }
}
