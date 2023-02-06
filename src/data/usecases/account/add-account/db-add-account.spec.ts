import { AccountModel, AddAccountParams, Hasher, AddAccountRepository, LoadAccountByEmailRepository } from './db-add-account-protocols'
import { DbAddAccount } from './db-add-account'

const makeFakeAccount = (): AccountModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password'
})

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (_accountData: AddAccountParams): Promise<AccountModel> {
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

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadByEmail (email: string): Promise<AccountModel> {
      // @ts-expect-error
      return new Promise(resolve => resolve(null))
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

const makeHasher = (): Hasher => {
  class HasherStub implements Hasher {
    async hash (_value: string): Promise<string> {
      return new Promise(resolve => resolve('hashed_password'))
    }
  }
  return new HasherStub()
}

type SutTypes = {
  sut: DbAddAccount
  HasherStub: Hasher
  addAccountRepositoryStub: AddAccountRepository
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
}

const makeSut = (): SutTypes => {
  const addAccountRepositoryStub = makeAddAccountRepository()
  const HasherStub = makeHasher()
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
  const sut = new DbAddAccount(HasherStub, addAccountRepositoryStub, loadAccountByEmailRepositoryStub)
  return {
    sut,
    HasherStub,
    addAccountRepositoryStub,
    loadAccountByEmailRepositoryStub
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

  test('Should return null if LoadAccountByEmailRepository', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(new Promise(resolve => resolve(makeFakeAccount())))
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'hashed_password'
    }
    const account = await sut.add(accountData)
    expect(account).toBeNull()
  })

  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const accountData = {
      name: 'valid_name',
      email: 'any_email@mail.com',
      password: 'hashed_password'
    }
    const { loadAccountByEmailRepositoryStub, sut } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
    await sut.add(accountData)
    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com')
  })
})
