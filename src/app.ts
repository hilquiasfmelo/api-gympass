import fastify from 'fastify'
import { ZodError } from 'zod'

import { env } from './env'
import { appRoutes } from './http/routes'

export const app = fastify()

app.register(appRoutes)

// Tratando erros globais.
app.setErrorHandler((error, _request, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Obteve-se um erro em alguma validação dos dados.',
      issues: error.format(),
    })
  }

  if (env.NODE_ENV !== 'production') {
    console.log(error)
  } else {
    // TODO: Aqui devemos relizar logs em alguma ferramenta externa como Datadog/NewRelic/Sentry.
  }

  return reply.status(500).send({ message: 'Interno erro do servidor.' })
})
