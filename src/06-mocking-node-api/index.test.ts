import { readFileAsynchronously } from '.';
import path from 'path';
import fs from 'fs';
import fsPromises from 'fs/promises';

const pathToFile = 'file1.txt';
const fileBuffer = Buffer.from('file content', 'utf-8');

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
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    // Write your test here
  });

  test('should call callback only after timeout', () => {
    // Write your test here
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    // Write your test here
  });

  test('should call callback multiple times after multiple intervals', () => {
    // Write your test here
  });
});

describe('readFileAsynchronously', () => {
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
