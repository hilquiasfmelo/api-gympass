import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Nearby Gyms (e2e)', () => {
  beforeAll(async () => {
    // Aguarda a aplicação inicializar antes de todos os testes.
    await app.ready()
  })

  afterAll(async () => {
    // Aguarda a aplicação finalizar antes de todos os testes.
    await app.close()
  })

  it('Deve ser possível listar academias próximas.', async () => {
    const { token } = await createAndAuthenticateUser(app, true)

    // Criação de uma academia.
    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Chad Castro Gym Pŕoxima',
        description: 'Somente uma descrição.',
        phone: '965-6998',
        latitude: -27.2092052,
        longitude: -49.6401091,
      })

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Typescript Castro Gym Longe',
        description: 'Somente uma descrição.',
        phone: '965-6998',
        latitude: -27.0610928,
        longitude: -49.5229501,
      })

    const response = await request(app.server)
      .get('/gyms/nearby')
      .query({
        latitude: -27.2092052,
        longitude: -49.6401091,
      })
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.gyms).toHaveLength(1)
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: 'Chad Castro Gym Pŕoxima',
      }),
    ])
  })
})
