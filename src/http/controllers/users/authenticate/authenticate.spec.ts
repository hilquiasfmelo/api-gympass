import { hash } from 'bcryptjs'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'
import { prisma } from '@/lib/prisma'

describe('Authenticate (e2e)', () => {
  beforeAll(async () => {
    // Aguarda a aplicação inicializar antes de todos os testes.
    await app.ready()
  })

  afterAll(async () => {
    // Aguarda a aplicação finalizar antes de todos os testes.
    await app.close()
  })

  it('Deve ser possível se autenticar', async () => {
    await prisma.user.create({
      data: {
        name: 'Hilquias Ferreira Melo',
        email: 'hilquiasfmelo@gmail.com',
        password_hash: await hash('12345678', 6),
        role: 'ADMIN',
      },
    })

    const response = await request(app.server).post('/sessions').send({
      email: 'hilquiasfmelo@gmail.com',
      password: '12345678',
    })

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual({
      token: expect.any(String),
    })
  })
})
