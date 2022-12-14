import {
  Authentication,
  AuthenticationModel,
  LoadAccountByEmailRepository,
  Encrypter,
  HashCompare,
  UpdateAccessTokenRepository
} from './db-authentication-protocols'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashCompare: HashCompare,
    private readonly encrypter: Encrypter,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
  ) { }

  async auth (authentication: AuthenticationModel): Promise<string | null> {
    const account = await this.loadAccountByEmailRepository.load(authentication.email)
    if (account) {
      const isValid = await this.hashCompare.compare(authentication.password, account.password)
      if (isValid) {
        const acessToken = await this.encrypter.encrypt(account.id)
        await this.updateAccessTokenRepository.update(account.id, acessToken)
        return acessToken
      }
    }
    return null
  }
}
