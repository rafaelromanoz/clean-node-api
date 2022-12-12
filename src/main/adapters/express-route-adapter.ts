import { Controller, HttpRequest } from '../../presentation/protocols'
import { Request, Response } from 'express'
export const adaptRoute = (controller: Controller) => {
  return async (req: Request, res: Response) => {
    const httpRequest: HttpRequest = {
      body: req.body
    }
    const httpResponse = await controller.handle(httpRequest)
    if (httpResponse?.statusCode === 200) {
      return res.status(httpResponse?.statusCode as number).json(httpResponse?.body)
    } else {
      return res.status(httpResponse?.statusCode as number).json({
        error: httpResponse?.body.message
      })
    }
  }
}
