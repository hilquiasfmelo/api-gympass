export class ResourceNotFoundError extends Error {
  constructor() {
    // construtor da class Error do Javascript
    super('Recurso não encontrado na base de dados.')
  }
}
