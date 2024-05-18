import type { FastifyReply, FastifyRequest } from 'fastify'

export async function verifyJWT(request: FastifyRequest, reply: FastifyReply) {
  try {
    // Busca o token dentro do cabeçalho e se existir, valida se o token foi gerado pela aplicação.
    await request.jwtVerify()
  } catch (err) {
    return reply.status(401).send({
      message: 'Não autorizado ❌',
    })
  }
}
