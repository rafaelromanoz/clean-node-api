import { Hasher } from '@/data/protocols/criptography/hasher'
import bcrypt from 'bcrypt'
import { HashCompare } from '@/data/protocols/criptography/hash-comparer'

export class BcryptAdapter implements Hasher, HashCompare {
  constructor (private readonly salt: number) { }

  async hash (value: string): Promise<string> {
    return bcrypt.hash(value, this.salt)
  }

  async compare (value: string, hash: string): Promise<boolean> {
    return bcrypt.compare(value, hash)
  }
}
