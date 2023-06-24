import { HttpStatusCode } from 'axios'
import { MongoError } from 'mongodb'

export enum DBErrorCodes {
  DOCUMENT_EXISTS = 'DOCUMENT_EXISTS',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  FIELD_REQUIRED = 'FIELD_REQUIRED',
  CONNECTION_REFUSED = 'CONNECTION_REFUSED',
  AUTHENTICATION_FAILED = 'AUTHENTICATION_FAILED',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  QUERY_SYNTAX_ERROR = 'QUERY_SYNTAX_ERROR',
  INDEX_NOT_FOUND = 'INDEX_NOT_FOUND',
  STORAGE_LIMIT_EXCEEDED = 'STORAGE_LIMIT_EXCEEDED',
  READ_ERROR = 'READ_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

export class DatabaseException extends Error {
  constructor(errorCode: DBErrorCodes, statusCode: HttpStatusCode, errorOrMessage?: MongoError | string) {
    const message = typeof errorOrMessage === 'string' ? errorOrMessage : errorOrMessage?.message ?? undefined
    const error = errorOrMessage instanceof MongoError ? errorOrMessage : undefined

    super(message)
    this.name = 'DatabaseException'
    this.errorCode = errorCode
    this.error = error
    this.statusCode = statusCode
  }

  public errorCode: DBErrorCodes
  public error?: MongoError
  public statusCode?: HttpStatusCode

  static extractErrorMessage(error: MongoError | any): string | MongoError {
    if (error.code === 11000 && error.keyValue) {
      const fieldName = Object.keys(error.keyValue)[0]
      const fieldValue = error.keyValue[fieldName]

      return `Duplicate key error: Field '${fieldName}' with value '${fieldValue}' already exists.`
    }

    if (error.code === 121 && error.result?.result?.validationErrors) {
      const validationErrors = error.result.result.validationErrors
      const errorMessages = validationErrors.map((validationError: any) => validationError.message)
      return `Validation error: ${errorMessages.join(', ')}`
    }

    if (error.code === 14 && error.errmsg) {
      const fieldNameMatch = error.errmsg.match(/index: (\w+)_\w+ dup key/)
      const fieldName = fieldNameMatch ? fieldNameMatch[1] : ''
      return `Field '${fieldName}' is required.`
    }

    return error
  }
}

export class DatabaseErrorHandlers {
  public static handleError(error: MongoError): void {
    let errorCode: DBErrorCodes
    let statusCode: HttpStatusCode
    let errorMessage: string | MongoError

    switch (error.code) {
      case 11000:
        errorCode = DBErrorCodes.DOCUMENT_EXISTS
        errorMessage = DatabaseException.extractErrorMessage(error)
        statusCode = HttpStatusCode.NotFound
        break
      case 121:
        errorCode = DBErrorCodes.VALIDATION_ERROR
        errorMessage = DatabaseException.extractErrorMessage(error)
        statusCode = HttpStatusCode.BadRequest
        break
      case 14:
        errorCode = DBErrorCodes.FIELD_REQUIRED
        errorMessage = DatabaseException.extractErrorMessage(error)
        statusCode = HttpStatusCode.BadRequest
        break
      case 7:
        errorCode = DBErrorCodes.CONNECTION_REFUSED
        errorMessage = DatabaseException.extractErrorMessage(error)
        statusCode = HttpStatusCode.BadGateway
        break
      case 18:
        errorCode = DBErrorCodes.AUTHENTICATION_FAILED
        errorMessage = DatabaseException.extractErrorMessage(error)
        statusCode = HttpStatusCode.BadGateway
        break
      case 50:
        errorCode = DBErrorCodes.TIMEOUT_ERROR
        errorMessage = DatabaseException.extractErrorMessage(error)
        statusCode = HttpStatusCode.GatewayTimeout
        break
      case 2:
        errorCode = DBErrorCodes.QUERY_SYNTAX_ERROR
        errorMessage = DatabaseException.extractErrorMessage(error)
        statusCode = HttpStatusCode.InternalServerError
        break
      case 27:
        errorCode = DBErrorCodes.INDEX_NOT_FOUND
        errorMessage = DatabaseException.extractErrorMessage(error)
        statusCode = HttpStatusCode.NotFound
        break
      case 10003:
        errorCode = DBErrorCodes.STORAGE_LIMIT_EXCEEDED
        errorMessage = DatabaseException.extractErrorMessage(error)
        statusCode = HttpStatusCode.GatewayTimeout
        break
      case 286:
        errorCode = DBErrorCodes.READ_ERROR
        errorMessage = DatabaseException.extractErrorMessage(error)
        statusCode = HttpStatusCode.InternalServerError
        break
      default:
        errorCode = DBErrorCodes.UNKNOWN_ERROR
        errorMessage = error
        statusCode = HttpStatusCode.InternalServerError
        break
    }

    throw new DatabaseException(errorCode, statusCode, errorMessage)
  }
}
