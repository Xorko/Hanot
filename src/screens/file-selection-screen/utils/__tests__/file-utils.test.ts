import { handleOpenInkmlFiles } from '../file-utils';

afterEach(() => {
  jest.clearAllMocks();
});

describe('handleOpenFiles', () => {
  it('must return an empty array if no file is selected', async () => {
    jest.mock('react-native-fs', () => {
      return {
        readFile: jest.fn().mockReturnValueOnce(undefined),
      };
    });

    const result = await handleOpenInkmlFiles();
    expect(result).toEqual([]);
  });
});
