import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { InvalidCredentialsError } from '../use-cases/authenticate/errors/invalid-credentials-error'
import { makeAuthenticateUseCase } from '../use-cases/authenticate/factory/make-authenticate-use-case'

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })

  // parse => dispara automaticamente um erro caso a validação não esteja de acordo, fazendo assim com que todo o código abaixo após ele não execute mais.
  const { email, password } = authenticateBodySchema.parse(request.body)

  try {
    const authenticateUseCase = makeAuthenticateUseCase()

    await authenticateUseCase.execute({
      email,
      password,
    })
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return reply.status(400).send({
        message: err.message,
      })
    }

    // Uma camada acima irá tratar esse erro.
    throw err
  }

  return reply.status(200).send()
}
