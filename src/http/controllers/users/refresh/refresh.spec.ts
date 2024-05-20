import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Refresh Token (e2e)', () => {
  beforeAll(async () => {
    // Aguarda a aplicação inicializar antes de todos os testes.
    await app.ready()
  })

  afterAll(async () => {
    // Aguarda a aplicação finalizar antes de todos os testes.
    await app.close()
  })

  it('Deve ser possível atualizar um token', async () => {
    const { cookies } = await createAndAuthenticateUser(app, true)

    const response = await request(app.server)
      .patch('/token/refresh')
      .set('Cookie', cookies)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual({
      token: expect.any(String),
    })
    expect(response.get('Set-Cookie')).toEqual([
      expect.stringContaining('refreshToken='),
    ])
  })
})
