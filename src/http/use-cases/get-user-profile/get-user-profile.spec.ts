import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'

import { GetUserProfileUseCase } from '.'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

let usersRepository: InMemoryUsersRepository
let sut: GetUserProfileUseCase

describe('Get Profile Use Case', () => {
  // beforeEach => função que executada antes de cada um dos testes. Definindo um contexto limpo para cada um dos testes.
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new GetUserProfileUseCase(usersRepository)
  })

  it('Deve ser possível buscar os dados do perfil de um usuário.', async () => {
    const createdUser = await usersRepository.create({
      name: 'Hilquias Ferreira Melo',
      email: 'hilquiasfmelo@gmail.com',
      password_hash: '123456',
    })

    const { user } = await sut.execute({
      userId: createdUser.id,
    })

    expect(user.id).toEqual(expect.any(String))
    expect(user.name).toEqual('Hilquias Ferreira Melo')
  })

  it('Não deve ser possível buscar dados do perfil de um usuário que não existe.', async () => {
    expect(async () => {
      await sut.execute({
        userId: 'id-nao-existe',
      })
    }).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
