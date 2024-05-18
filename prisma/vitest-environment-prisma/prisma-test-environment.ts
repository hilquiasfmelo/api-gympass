import 'dotenv/config'

import { execSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'

import { PrismaClient } from '@prisma/client'
import { Environment } from 'vitest'

const prisma = new PrismaClient()

// "postgresql://docker:docker@localhost:5432/dbgympass?schema=public"

function generateDatabaseURL(schema: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('Por favor, insira a variável de ambient DATABASE_URL.')
  }

  const url = new URL(process.env.DATABASE_URL)

  // set => inseri um novo valor na variável passada no primeiro parâmetro.
  url.searchParams.set('schema', schema)

  return url.toString()
}

export default <Environment>{
  name: 'prisma',
  transformMode: 'ssr',

  // Executa antes de cada arquivo de teste.
  async setup() {
    const schema = randomUUID()

    const databaseURL = generateDatabaseURL(schema)

    process.env.DATABASE_URL = databaseURL

    // execSync => executa um comando como se estivesse no terminal.
    // deploy => realiza as migrations sem verificar alterações nas mesmas.
    execSync('pnpm prisma migrate deploy')

    return {
      // Executa após os testes da aplicação executarem.
      async teardown() {
        await prisma.$executeRawUnsafe(
          `DROP SCHEMA IF EXISTS "${schema}" CASCADE`,
        )

        await prisma.$disconnect()
      },
    }
  },
}
