import { hash } from 'bcryptjs'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'
import { prisma } from '@/lib/prisma'

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
    const response = await prisma.user.create({
      data: {
        name: 'Hilquias Ferreira Melo',
        email: 'hilquiasfmelo@gmail.com',
        password_hash: await hash('12345678', 6),
        role: 'ADMIN',
      },
    })

    expect(response.id).toEqual(expect.any(String))
  })
})
