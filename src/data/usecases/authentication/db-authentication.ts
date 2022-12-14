import { HashCompare } from 'data/protocols/criptography/hash-comparer'
import { TokenGenerator } from 'data/protocols/criptography/token-generator'
import { UpdateAccessTokenRepository } from 'data/protocols/db/update-access-token-repository'
import { Authentication, AuthenticationModel } from '../../../domain/usecases/authentication/authentication'
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashCompare: HashCompare,
    private readonly tokenGenerator: TokenGenerator,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
  ) { }

  async auth (authentication: AuthenticationModel): Promise<string | null> {
    const account = await this.loadAccountByEmailRepository.load(authentication.email)
    if (account) {
      const isValid = await this.hashCompare.compare(authentication.password, account.password)
      if (isValid) {
        const acessToken = await this.tokenGenerator.generate(account.id)
        await this.updateAccessTokenRepository.update(account.id, acessToken)
        return acessToken
      }
    }
    return null
  }
}
