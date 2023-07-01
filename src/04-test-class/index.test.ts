import {
  getBankAccount,
  BankAccount,
  InsufficientFundsError,
  TransferFailedError,
  SynchronizationFailedError,
} from '.';
import lodash from 'lodash';

const initialBalance = 58;
const initialBalance2 = 99;
const withdrawErrorAmount = 59;
const transferErrorAmount = 59;
const depositAmount = 9;
const withdrawAmount = 58;
const transferAmount = 58;
const fetchedBalance = 101;

describe('BankAccount', () => {
  test('should create account with initial balance', () => {
    const bankAccount = getBankAccount(initialBalance);
    expect(bankAccount).toBeInstanceOf(BankAccount);
    expect(bankAccount.getBalance()).toBe(initialBalance);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const bankAccount = getBankAccount(initialBalance);
    expect(() => bankAccount.withdraw(withdrawErrorAmount)).toThrow(
      InsufficientFundsError,
    );
  });

  test('should throw error when transferring more than balance', () => {
    const bankAccount = getBankAccount(initialBalance);
    const bankAccount2 = getBankAccount(initialBalance2);
    expect(() =>
      bankAccount.transfer(transferErrorAmount, bankAccount2),
    ).toThrow(InsufficientFundsError);
  });

  test('should throw error when transferring to the same account', () => {
    const bankAccount = getBankAccount(initialBalance);
    expect(() =>
      bankAccount.transfer(transferErrorAmount, bankAccount),
    ).toThrow(TransferFailedError);
  });

  test('should deposit money', () => {
    const bankAccount = getBankAccount(initialBalance);
    bankAccount.deposit(depositAmount);
    expect(bankAccount.getBalance()).toBe(initialBalance + depositAmount);
  });

  test('should withdraw money', () => {
    const bankAccount = getBankAccount(initialBalance);
    bankAccount.withdraw(withdrawAmount);
    expect(bankAccount.getBalance()).toBe(initialBalance - withdrawAmount);
  });

  test('should transfer money', () => {
    const bankAccount = getBankAccount(initialBalance);
    const bankAccount2 = getBankAccount(initialBalance2);
    bankAccount.transfer(transferAmount, bankAccount2);
    expect(bankAccount.getBalance()).toBe(initialBalance - transferAmount);
    expect(bankAccount2.getBalance()).toBe(initialBalance2 + transferAmount);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    const bankAccount = getBankAccount(initialBalance);

    lodash.random = jest
      .fn()
      .mockImplementationOnce(() => fetchedBalance)
      .mockImplementationOnce(() => 1); // request succedes

    const balance: number | null = await bankAccount.fetchBalance();
    expect(balance).toEqual(expect.any(Number));
    expect(lodash.random).toHaveBeenCalledTimes(2);
  });

  test('fetchBalance should return null in case if request fails', async () => {
    const bankAccount = getBankAccount(initialBalance);

    lodash.random = jest
      .fn()
      .mockImplementationOnce(() => fetchedBalance)
      .mockImplementationOnce(() => 0); // request fails

    const balance: number | null = await bankAccount.fetchBalance();
    expect(balance).toBeNull();
    expect(lodash.random).toHaveBeenCalledTimes(2);
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const bankAccount = getBankAccount(initialBalance);
    bankAccount.fetchBalance = jest.fn(async () => fetchedBalance);

    await expect(bankAccount.synchronizeBalance()).resolves.not.toThrow();
    expect(bankAccount.fetchBalance).toHaveBeenCalled();
    expect(bankAccount.getBalance()).toBe(fetchedBalance);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    const bankAccount = getBankAccount(initialBalance);
    bankAccount.fetchBalance = jest.fn(async () => null);

    await expect(bankAccount.synchronizeBalance()).rejects.toThrow(
      SynchronizationFailedError,
    );
    expect(bankAccount.fetchBalance).toHaveBeenCalled();
  });
});
