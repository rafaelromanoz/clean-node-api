import { AccountModel, AddAccountModel, Hasher, AddAccountRepository } from './db-add-account-protocols'
import { DbAddAccount } from './db-add-account'

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (_accountData: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email',
        password: 'hashed_password'
      }
      return new Promise(resolve => resolve(fakeAccount))
    }
  }
  return new AddAccountRepositoryStub()
}

const makeHasher = (): Hasher => {
  class HasherStub implements Hasher {
    async hash (_value: string): Promise<string> {
      return new Promise(resolve => resolve('hashed_password'))
    }
  }
  return new HasherStub()
}

interface SutTypes {
  sut: DbAddAccount
  HasherStub: Hasher
  addAccountRepositoryStub: AddAccountRepository
}

const makeSut = (): SutTypes => {
  const addAccountRepositoryStub = makeAddAccountRepository()
  const HasherStub = makeHasher()
  const sut = new DbAddAccount(HasherStub, addAccountRepositoryStub)
  return {
    sut,
    HasherStub,
    addAccountRepositoryStub
  }
}

describe('DbAddAccount usecase', () => {
  test('Should call Hasher with correct password', async () => {
    const { sut, HasherStub } = makeSut()
    const hashSpy = jest.spyOn(HasherStub, 'hash')
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }
    await sut.add(accountData)
    expect(hashSpy).toHaveBeenCalledWith('valid_password')
  })

  test('Should throw if Hash throws', async () => {
    const { sut, HasherStub } = makeSut()
    jest.spyOn(HasherStub, 'hash')
      .mockReturnValueOnce(new Promise((_resolve, reject) => reject(new Error())))
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }
    const promise = sut.add(accountData)
    await expect(promise).rejects.toThrow()
  })

  test('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'hashed_password'
    }
    await sut.add(accountData)
    expect(addSpy).toHaveBeenCalledWith({
      ...accountData
    })
  })

  test('Should throw if Hasher throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    jest.spyOn(addAccountRepositoryStub, 'add')
      .mockReturnValueOnce(new Promise((_resolve, reject) => (reject(new Error()))))
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'hashed_password'
    }
    const promise = sut.add(accountData)
    await expect(promise).rejects.toThrow()
  })

  test('Should return an account on success', async () => {
    const { sut } = makeSut()
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'hashed_password'
    }
    const account = await sut.add(accountData)
    expect(account).toEqual({
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid_email',
      password: 'hashed_password'
    })
  })
})
