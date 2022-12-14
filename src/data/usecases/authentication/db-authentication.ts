import { HashCompare } from 'data/protocols/criptography/hash-comparer'
import { TokenGenerator } from 'data/protocols/criptography/token-generator'
import { Authentication, AuthenticationModel } from '../../../domain/usecases/authentication/authentication'
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashCompare: HashCompare,
    private readonly tokenGenerator: TokenGenerator
  ) { }

  async auth (authentication: AuthenticationModel): Promise<string | null> {
    const account = await this.loadAccountByEmailRepository.load(authentication.email)
    if (account) {
      const isValid = await this.hashCompare.compare(authentication.password, account.password)
      if (isValid) return this.tokenGenerator.generate(account.id)
    }
    return null
  }
}
