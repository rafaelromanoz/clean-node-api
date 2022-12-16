import { Express, Router } from 'express'
import { readdirSync } from 'fs'
import { join } from 'path'

const pathToRoutes = join(__dirname, '../routes')

export default (app: Express): void => {
  const router = Router()
  app.use('/api', router)
  readdirSync(pathToRoutes).map(async file => {
    if (!file.endsWith('.map')) {
      (await import (`../routes/${file}`)).default(router)
    }
  })
}
