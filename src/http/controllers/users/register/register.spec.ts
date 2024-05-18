import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'

describe('Register (e2e)', () => {
  beforeAll(async () => {
    // Aguarda a aplicação inicializar antes de todos os testes.
    await app.ready()
  })

  afterAll(async () => {
    // Aguarda a aplicação finalizar antes de todos os testes.
    await app.close()
  })

  it('Deve ser possível se registrar', async () => {
    const response = await request(app.server).post('/users').send({
      name: 'Hilquias Ferreira Melo',
      email: 'hilquiasfmelo@gmail.com',
      password: '12345678',
    })

    expect(response.statusCode).toEqual(201)
  })
})
