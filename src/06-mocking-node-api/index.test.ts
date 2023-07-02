import { readFileAsynchronously, doStuffByTimeout, doStuffByInterval } from '.';
import path from 'path';
import fs from 'fs';
import fsPromises from 'fs/promises';

jest.mock('fs', () => {
  return {
    existsSync: jest.fn(),
  };
});

jest.mock('fs/promises', () => {
  return {
    readFile: jest.fn(),
  };
});

describe('doStuffByTimeout', () => {
  let timeoutCallback: jest.Mock;
  const timeout = 1000;

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    jest.spyOn(global, 'setTimeout');
    timeoutCallback = jest.fn();
  });

  test('should set timeout with provided callback and timeout', () => {
    doStuffByTimeout(timeoutCallback, timeout);

    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), timeout);
  });

  test('should call callback only after timeout', () => {
    doStuffByTimeout(timeoutCallback, timeout);

    expect(timeoutCallback).not.toHaveBeenCalled();
    jest.runAllTimers();
    expect(timeoutCallback).toHaveBeenCalledTimes(1);
  });
});

describe('doStuffByInterval', () => {
  let intervalCallback: jest.Mock;
  const interval = 1001;
  const intervalCallsNum = 5;

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    jest.spyOn(global, 'setInterval');
    intervalCallback = jest.fn();
  });

  test('should set interval with provided callback and timeout', () => {
    doStuffByInterval(intervalCallback, interval);

    expect(setInterval).toHaveBeenCalledTimes(1);
    expect(setInterval).toHaveBeenLastCalledWith(
      expect.any(Function),
      interval,
    );
  });

  test('should call callback multiple times after multiple intervals', () => {
    doStuffByInterval(intervalCallback, interval);

    expect(intervalCallback).not.toHaveBeenCalled();
    jest.advanceTimersByTime(interval * intervalCallsNum);
    expect(intervalCallback).toHaveBeenCalledTimes(5);
  });
});

describe('readFileAsynchronously', () => {
  const pathToFile = 'file1.txt';
  const fileBuffer = Buffer.from('file content', 'utf-8');

  afterAll(() => {
    jest.unmock('fs');
    jest.unmock('fs/promises');
  });

  test('should call join with pathToFile', async () => {
    const mockedPathJoin = jest.spyOn(path, 'join');

    await readFileAsynchronously(pathToFile);
    expect(mockedPathJoin.mock.lastCall).toContainEqual(pathToFile);
    expect(mockedPathJoin).toHaveBeenCalled();
    expect(mockedPathJoin).toHaveBeenCalledTimes(1);

    mockedPathJoin.mockRestore();
  });

  test('should return null if file does not exist', async () => {
    fs.existsSync = jest.fn(() => false);

    const fileContent: string | null = await readFileAsynchronously(pathToFile);
    expect(fileContent).toBeNull();
    expect(fs.existsSync).toHaveBeenCalledTimes(1);
  });

  test('should return file content if file exists', async () => {
    fs.existsSync = jest.fn(() => true);

    fsPromises.readFile = jest.fn().mockResolvedValue(fileBuffer);
    const fileContent: string | null = await readFileAsynchronously(pathToFile);

    expect(fileContent).not.toBeNull();
    expect(fileContent).toBe(fileBuffer.toString());
    expect(fs.existsSync).toHaveBeenCalledTimes(1);
    expect(fsPromises.readFile).toHaveBeenCalledTimes(1);
  });
});
