import { FastifyReply, FastifyRequest } from 'fastify'

export async function refresh(request: FastifyRequest, reply: FastifyReply) {
  // Só sera gerado um novo token se existe um refresh token válido nos cookies da requisição.
  await request.jwtVerify({
    /**
     * Valida se o usuário está autenticado, mas não verifica o conteúdo que está no cabeçalho da aplicação.
     * Ela verifica lá nos cookies da requisição se existe um refresh token, se existir é revalidado o token original.
     */
    onlyCookie: true,
  })

  // Gera um novo token.
  const token = await reply.jwtSign(
    {
      // Envia no payload qual o cargo desse usuário.
      role: request.user.role,
    },
    {
      sign: {
        // Busca o ID do usuário logado.
        sub: request.user.sub,
      },
    },
  )

  // Gera um novo refresh token.
  const refreshToken = await reply.jwtSign(
    {
      // Envia no payload qual o cargo desse usuário.
      role: request.user.role,
    },
    {
      sign: {
        sub: request.user.sub,
        expiresIn: '7d',
      },
    },
  )

  return reply
    .setCookie('refreshToken', refreshToken, {
      path: '/',
      secure: true,
      sameSite: true,
      httpOnly: true,
    })
    .status(200)
    .send({
      token,
    })
}
