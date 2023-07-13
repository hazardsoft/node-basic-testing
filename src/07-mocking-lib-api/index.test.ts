import axios from 'axios';
import 'lodash';
import { throttledGetDataFromApi } from './index';

const baseURL = 'https://jsonplaceholder.typicode.com';
const relativePath = 'users';
const response = { data: { username: 'user1', age: 20 } };

jest.mock('axios');
jest.mock('lodash', () => {
  return {
    throttle: jest.fn((fn) => fn),
  };
});

describe('throttledGetDataFromApi', () => {
  beforeEach(() => {
    axios.create = jest.fn().mockReturnThis();
    axios.get = jest.fn().mockResolvedValue(response);
  });

  afterAll(() => {
    jest.unmock('axios');
    jest.unmock('lodash');
  });

  test('should create instance with provided base url', async () => {
    const axiosCreateMock = axios.create as jest.Mock;
    await throttledGetDataFromApi(relativePath);

    expect(axiosCreateMock).toHaveBeenCalledTimes(1);
    expect(axiosCreateMock.mock.lastCall).toContainEqual({ baseURL });
  });

  test('should perform request to correct provided url', async () => {
    const axiosGetMock = axios.get as jest.Mock;
    await throttledGetDataFromApi(relativePath);

    expect(axiosGetMock).toHaveBeenCalledTimes(1);
    expect(axiosGetMock.mock.lastCall).toContain(relativePath);
  });

  test('should return response data', async () => {
    const axiosGetMock = axios.get as jest.Mock;
    const data = await throttledGetDataFromApi(relativePath);

    expect(axiosGetMock).toHaveBeenCalledTimes(1);
    expect(data).toEqual(response.data);
  });
});
