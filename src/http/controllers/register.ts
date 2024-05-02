import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { UserAlreadyExistsError } from '../use-cases/register/errors/user-already-exists-error'
import { makeRegisterUseCase } from '../use-cases/register/factory/make-register-use-case'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })

  // parse => dispara automaticamente um erro caso a validação não esteja de acordo, fazendo assim com que todo o código abaixo após ele não execute mais.
  const { name, email, password } = registerBodySchema.parse(request.body)

  try {
    const registerUseCase = makeRegisterUseCase()

    await registerUseCase.execute({
      name,
      email,
      password,
    })
  } catch (err) {
    if (err instanceof UserAlreadyExistsError) {
      return reply.status(409).send({
        message: err.message,
      })
    }

    // Uma camada acima irá tratar esse erro.
    throw err
  }

  return reply.status(201).send()
}
