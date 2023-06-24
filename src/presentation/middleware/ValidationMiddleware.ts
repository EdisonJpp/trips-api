import { plainToInstance } from 'class-transformer'
import { validate, ValidationError } from 'class-validator'
import { NextFunction, Request, Response } from 'express'

export enum ValidationTarget {
  BODY = 'body',
  QUERY_PARAMS = 'query'
}

export function validationMiddleware<T>(
  type: T | any,
  target: ValidationTarget = ValidationTarget.BODY,
  skipMissingProperties = false
): (req: Request, res: Response, next: NextFunction) => Promise<void> {
  return async (req: Request, res: Response, next: NextFunction) => {
    let data: any

    switch (target) {
      case ValidationTarget.BODY:
        data = req.body
        break
      case ValidationTarget.QUERY_PARAMS:
        data = req.query
        break
      default:
        data = req.body
    }

    const object = plainToInstance(type, data)
    const errors = await validate(object, { skipMissingProperties })
    console.log(errors, 'ssss')
    if (errors.length > 0) {
      const errorMessages = errors.map((error: ValidationError) => Object.values(error.constraints || {})).flat()
      res.status(400).json({ error: errorMessages.length > 0 ? errorMessages : errors })
    } else {
      switch (target) {
        case ValidationTarget.BODY:
          req.body = object
          break
        case ValidationTarget.QUERY_PARAMS:
          req.query = object as any
          break
        default:
          req.body = object
      }
      next()
    }
  }
}
