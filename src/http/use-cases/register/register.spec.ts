import { compare } from 'bcryptjs'
import { describe, expect, it } from 'vitest'

import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'

import { RegisterUseCase } from '.'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

describe('Register Use Case', () => {
  it('A senha do usuário deve ser criptografada no momento do registro.', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(usersRepository)

    const { user } = await registerUseCase.execute({
      name: 'Hilquias Ferreira Melo',
      email: 'hilquiasfmelo@hotmail.com',
      password: '123456',
    })

    // Compara se a senha informada é igual a senha criptografada na base de dados.
    const isPasswordCorrectlHashed = await compare('123456', user.password_hash)

    expect(isPasswordCorrectlHashed).toBe(true)
  })

  it('Não deve ser possível criar um usuário com um e-mail repetido.', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(usersRepository)

    const email = 'hilquiasfmelo@hotmail.com'

    await registerUseCase.execute({
      name: 'Hilquias Ferreira Melo',
      email,
      password: '123456',
    })

    expect(async () => {
      await registerUseCase.execute({
        name: 'Hilquias Ferreira Melo',
        email,
        password: '123456',
      })
    }).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })

  it('Deve ser possível registrar um usuário.', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(usersRepository)

    const { user } = await registerUseCase.execute({
      name: 'Hilquias Ferreira Melo',
      email: 'hilquiasfmelo@hotmail.com',
      password: '123456',
    })

    // Espero que Id do usuário criado seja igual a qualquer string
    expect(user.id).toEqual(expect.any(String))
  })
})
