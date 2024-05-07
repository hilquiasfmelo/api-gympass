export class LateCheckInValidationError extends Error {
  constructor() {
    // construtor da class Error do Javascript
    super(
      'O check-in só poderá ser validado até 20 minutos após a sua criação.',
    )
  }
}
