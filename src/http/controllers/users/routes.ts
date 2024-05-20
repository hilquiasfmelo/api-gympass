import { FastifyInstance } from 'fastify'

import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { verifyUserRole } from '@/http/middlewares/verify-user-role'

import { authenticate } from './authenticate'
import { profile } from './profile'
import { refresh } from './refresh'
import { register } from './register'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/users', { onRequest: [verifyUserRole('ADMIN')] }, register)
  app.post('/sessions', authenticate)

  app.patch('/token/refresh', refresh)

  /**
   * Rotas abaixo só serão chamadas somente quando o usuário estiver autenticado.
   * Middleware direto em uma rota que executa somente se o usuário estiver autenticado.
   * (onRequest) => Executa antes dos controllers.
   */
  app.get('/me', { onRequest: [verifyJWT] }, profile)
}
