import { handleFileImport } from '../file-utils';

afterEach(() => {
  jest.clearAllMocks();
});

describe('handleFileImport', () => {
  it('must return an empty array if no file is selected', async () => {
    const result = await handleFileImport('inkml');
    expect(result).toEqual([]);
  });
});
