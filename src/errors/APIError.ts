class APIError extends Error {
  public readonly statusCode: number
  public readonly data: any

  constructor(message: string, statusCode: number = 500, data: any = null) {
    super(message)
    this.statusCode = statusCode
    this.data = data
    Error.captureStackTrace(this, this.constructor)
  }
}

export default APIError
