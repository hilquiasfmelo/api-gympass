import type { FastifyInstance } from 'fastify'
import request from 'supertest'

export async function createAndAuthenticateUser(app: FastifyInstance) {
  await request(app.server).post('/users').send({
    name: 'Hilquias Ferreira Melo',
    email: 'hilquiasfmelo@gmail.com',
    password: '12345678',
  })

  const authResponse = await request(app.server).post('/sessions').send({
    email: 'hilquiasfmelo@gmail.com',
    password: '12345678',
  })

  const { token } = authResponse.body

  return { token }
}
