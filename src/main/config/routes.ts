import { Express, Router } from 'express'
import { readdirSync } from 'fs'
import path from 'path'

const pathToRoutes = path.join(__dirname, '../routes')

export default (app: Express): void => {
  const router = Router()
  app.use('/api', router)
  readdirSync(pathToRoutes).map(async file => {
    if (!file.includes('.test.')) {
      (await import (`../routes/${file}`)).default(router)
    }
  })
}
