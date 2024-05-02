import { compare } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'

import { RegisterUseCase } from '.'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

let usersRepository: InMemoryUsersRepository
let sut: RegisterUseCase

describe('Register Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new RegisterUseCase(usersRepository)
  })

  it('A senha do usuário deve ser criptografada no momento do registro.', async () => {
    const { user } = await sut.execute({
      name: 'Hilquias Ferreira Melo',
      email: 'hilquiasfmelo@hotmail.com',
      password: '123456',
    })

    // Compara se a senha informada é igual a senha criptografada na base de dados.
    const isPasswordCorrectlHashed = await compare('123456', user.password_hash)

    expect(isPasswordCorrectlHashed).toBe(true)
  })

  it('Não deve ser possível criar um usuário com um e-mail repetido.', async () => {
    const email = 'hilquiasfmelo@hotmail.com'

    await sut.execute({
      name: 'Hilquias Ferreira Melo',
      email,
      password: '123456',
    })

    expect(async () => {
      await sut.execute({
        name: 'Hilquias Ferreira Melo',
        email,
        password: '123456',
      })
    }).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })

  it('Deve ser possível registrar o usuário.', async () => {
    const { user } = await sut.execute({
      name: 'Hilquias Ferreira Melo',
      email: 'hilquiasfmelo@hotmail.com',
      password: '123456',
    })

    // Espero que Id do usuário criado seja igual a qualquer string
    expect(user.id).toEqual(expect.any(String))
  })
})
