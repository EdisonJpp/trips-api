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

    if (errors.length > 0) {
      console.log(errors, 'edispn')
      const errorMessages = extractNestedValidationErrors(errors)
      res.status(400).json({ error: errorMessages })
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

function extractNestedValidationErrors(errors: ValidationError[]): string[] {
  const nestedErrors: string[] = []

  for (const error of errors) {
    if (error.children && error.children.length > 0) {
      nestedErrors.push(...extractNestedValidationErrors(error.children))
    }

    if (error.constraints) {
      const errorMessages = Object.values(error.constraints)
      nestedErrors.push(...errorMessages)
    }
  }

  return nestedErrors
}
