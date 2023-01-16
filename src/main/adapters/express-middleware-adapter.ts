import { Middleware } from '@/presentation/protocols/middleware'
import { HttpRequest } from '@/presentation/protocols'
import { NextFunction, Request, Response } from 'express'

export const adaptMiddleware = (middleware: Middleware) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const httpRequest: HttpRequest = {
      headers: req.headers
    }
    const httpResponse = await middleware.handle(httpRequest)
    if (httpResponse?.statusCode === 200) {
      Object.assign(req, httpResponse.body)
      return next()
    } else {
      return res.status(httpResponse?.statusCode as number).json({
        error: httpResponse?.body.message
      })
    }
  }
}
