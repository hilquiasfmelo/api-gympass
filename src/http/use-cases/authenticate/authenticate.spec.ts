import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'

import { AuthenticateUseCase } from '.'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

let usersRepository: InMemoryUsersRepository
let sut: AuthenticateUseCase

describe('Authenticate Use Case', () => {
  // beforeEach => função que executada antes de cada um dos testes. Definindo um contexto limpo para cada um dos testes.
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new AuthenticateUseCase(usersRepository)
  })

  it('Deve ser possível autenticar o usuário.', async () => {
    // Criação do usuário direto no repositório.
    await usersRepository.create({
      name: 'Hilquias Ferreira Melo',
      email: 'hilquiasfmelo@hotmail.com',
      password_hash: await hash('123456', 6),
    })

    const { user } = await sut.execute({
      email: 'hilquiasfmelo@hotmail.com',
      password: '123456',
    })

    // Espero que Id do usuário criado seja igual a qualquer string.
    expect(user.id).toEqual(expect.any(String))
  })

  it('Não deve ser possível se autenticar com um e-mail que não existe.', async () => {
    expect(async () => {
      await sut.execute({
        email: 'hilquiasfmelo@hotmail.com',
        password: '123456',
      })
    }).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('Não deve ser possível se autenticar com uma senha errada.', async () => {
    await usersRepository.create({
      name: 'Hilquias Ferreira Melo',
      email: 'hilquiasfmelo@hotmail.com',
      password_hash: await hash('123456', 6),
    })

    expect(async () => {
      await sut.execute({
        email: 'hilquiasfmelo@hotmail.com',
        password: 'senha-errada',
      })
    }).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
