import '@fastify/jwt'

declare module '@fastify/jwt' {
  interface FastifyJWT {
    user: {
      // Nada mais é do que o ID do usuário.
      sub: string
      role: 'ADMIN' | 'MEMBER'
    }
  }
}
