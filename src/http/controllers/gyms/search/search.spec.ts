import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Search Gyms (e2e)', () => {
  beforeAll(async () => {
    // Aguarda a aplicação inicializar antes de todos os testes.
    await app.ready()
  })

  afterAll(async () => {
    // Aguarda a aplicação finalizar antes de todos os testes.
    await app.close()
  })

  it('Deve ser possível buscar uma academia pelo título.', async () => {
    const { token } = await createAndAuthenticateUser(app)

    // Criação de uma academia.
    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Chad Castro Gym',
        description: 'Somente uma descrição.',
        phone: '965-6998',
        latitude: -2.557903,
        longitude: -44.1990842,
      })

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Typescript Castro Gym',
        description: 'Somente uma descrição.',
        phone: '965-6998',
        latitude: -2.557903,
        longitude: -44.1990842,
      })

    const response = await request(app.server)
      .get('/gyms/search')
      .query({
        query: 'Typescript',
      })
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.gyms).toHaveLength(1)
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: 'Typescript Castro Gym',
      }),
    ])
  })
})
