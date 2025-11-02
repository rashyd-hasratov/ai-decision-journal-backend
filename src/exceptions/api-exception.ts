class ApiException extends Error {
  status: number;
  errors?: unknown[];

  constructor(status: number, message: string, errors?: unknown[]) {
    super(message);
    this.status = status;
    this.errors = errors;
  }

  static UnauthorizedException() {
    return new ApiException(401, "User is not authorized.", []);
  }

  static BadRequestException(message: string, errors?: unknown[]) {
    return new ApiException(400, message, errors);
  }

  static NotFoundException(message: string) {
    return new ApiException(404, message);
  }
}

export default ApiException;
