import { FastifyInstance } from 'fastify'

import { verifyJWT } from '@/http/middlewares/verify-jwt'

import { authenticate } from './authenticate'
import { profile } from './profile'
import { register } from './register'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/users', register)
  app.post('/sessions', authenticate)

  /**
   * Rotas abaixo só serão chamadas somente quando o usuário estiver autenticado.
   * Middleware direto em uma rota que executa somente se o usuário estiver autenticado.
   * (onRequest) => Executa antes dos controllers.
   */
  app.get('/me', { onRequest: [verifyJWT] }, profile)
}
