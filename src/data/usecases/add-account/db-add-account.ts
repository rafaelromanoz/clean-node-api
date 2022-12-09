import { AddAccount, AccountModel, Encrypter, AddAccountModel } from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  constructor (private readonly encrypter: Encrypter) { }

  async add (account: AddAccountModel): Promise<AccountModel> {
    await this.encrypter.encrypt(account.password)
    return {
      password: 'aaa',
      email: 'aa',
      name: 'aaaa',
      id: 'aaa'
    }
  }
}
