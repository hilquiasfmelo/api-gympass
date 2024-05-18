import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'

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
    await request(app.server).post('/users').send({
      name: 'Hilquias Ferreira Melo',
      email: 'hilquiasfmelo@gmail.com',
      password: '12345678',
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
