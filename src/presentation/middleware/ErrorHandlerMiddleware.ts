import { DatabaseException } from '@/infrastructure/config/database/DatabaseException'
import { type NextFunction, Request, Response } from 'express'
import { injectable } from 'inversify'

@injectable()
export class ErrorHandlerMiddleware {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handle(error: any, req: Request, res: Response, _next: NextFunction): void {
    if (error instanceof DatabaseException) {
      res.status(error.statusCode ?? 500).json(error)
    }

    res.status(error.status ?? 500).send(error)
  }
}
