import { Encrypter } from '../../../data/protocols/criptography/encrypter'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { Decrypter } from '../../../data/protocols/criptography/decrypter'

export class JwtAdapter implements Encrypter, Decrypter {
  constructor (private readonly secret: string) { }

  async encrypt (value: string): Promise<string> {
    return jwt.sign({ id: value }, this.secret)
  }

  async decrypt (token: string): Promise<string | JwtPayload> {
    return jwt.verify(token, this.secret)
  }
}
