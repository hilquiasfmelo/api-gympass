import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { InvalidCredentialsError } from '@/http/use-cases/authenticate/errors/invalid-credentials-error'
import { makeAuthenticateUseCase } from '@/http/use-cases/authenticate/factory/make-authenticate-use-case'

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

    const { user } = await authenticateUseCase.execute({
      email,
      password,
    })

    // Criação do token JWT assim que o usuário se autentica. Passando no payload a informação do seu ID.
    const token = await reply.jwtSign(
      {
        // Envia no payload qual o cargo desse usuário.
        role: user.role,
      },
      {
        sign: {
          sub: user.id,
        },
      },
    )

    // Token secundário gerado para ativar o token original e continuar deixando o usuário logado.
    const refreshToken = await reply.jwtSign(
      {
        // Envia no payload qual o cargo desse usuário.
        role: user.role,
      },
      {
        sign: {
          sub: user.id,
          // O usuário só vai perder o acesso se ficar 7 dias sem acessar a aplicação.
          expiresIn: '7d',
        },
      },
    )

    return reply
      .setCookie('refreshToken', refreshToken, {
        // Define quais rotas da aplicação terão acesso a esse cookie.
        path: '/',
        // Define que o cookie será encriptado através do HTTPs.
        secure: true,
        sameSite: true,
        // Define somente acesso ao cookie através de requisição e resposta, não fica salvo no browser.
        httpOnly: true,
      })
      .status(200)
      .send({
        token,
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
}
