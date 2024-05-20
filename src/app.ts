import fastifyCookie from '@fastify/cookie'
import fastifyJwt from '@fastify/jwt'
import fastify from 'fastify'
import { ZodError } from 'zod'

import { env } from './env'
import { checkInsRoutes } from './http/controllers/check-ins/routes'
import { gymsRoutes } from './http/controllers/gyms/routes'
import { usersRoutes } from './http/controllers/users/routes'

export const app = fastify()

// Registando o JWT na aplicação.
app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: 'refreshToken',
    signed: false,
  },
  sign: {
    // A cada 10 min a aplicação checa se o usuário tem um refresh token para atualizar o token original.
    expiresIn: '10m',
  },
})

// Registrando os cookies.
app.register(fastifyCookie)

app.register(usersRoutes)
app.register(gymsRoutes)
app.register(checkInsRoutes)

// Tratando erros globais.
app.setErrorHandler((error, _request, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Houve erro em alguma validação dos dados.',
      issues: error.format(),
    })
  }

  if (env.NODE_ENV !== 'production') {
    console.log(error)
  } else {
    // TODO: Aqui devemos relizar logs em alguma ferramenta externa como Datadog/NewRelic/Sentry.
  }

  return reply.status(500).send({ message: 'Erro interno do servidor.' })
})
