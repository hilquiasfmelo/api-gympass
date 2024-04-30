export class UserAlreadyExistsError extends Error {
  constructor() {
    // construtor da class Error do Javascript
    super('E-mail já existente na base dados.')
  }
}
