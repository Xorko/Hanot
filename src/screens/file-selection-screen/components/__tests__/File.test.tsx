import { fireEvent, render } from 'test-utils';
import { DisplayModeProvider } from '../../../../screens/file-selection-screen/context/DisplayModeContext';
import { FileTypeProvider } from '../../../../screens/file-selection-screen/context/FileTypeContext';
import { InkMLFile } from '../../../../screens/file-selection-screen/types/file-import-types';
import File from '../File';

const mockedNavigate = jest.fn();

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: mockedNavigate,
    }),
  };
});

const inkmlFileMock: InkMLFile = {
  fileName: 'test.inkml',
  filePath: '/path/to/test.inkml',
};

const imageFileMock: InkMLFile = {
  fileName: 'test.png',
  filePath: '/path/to/test.png',
};

test('it displays the filename', () => {
  const { queryByText } = render(
    <DisplayModeProvider>
      <FileTypeProvider>
        <File file={inkmlFileMock} />
      </FileTypeProvider>
    </DisplayModeProvider>,
  );
  expect(queryByText('test.inkml')).toBeTruthy();
});

test('it navigates to the inkml annotation screen when it contains an inkml file and it is pressed', () => {
  const { getByText } = render(
    <DisplayModeProvider>
      <FileTypeProvider>
        <File file={inkmlFileMock} />
      </FileTypeProvider>
    </DisplayModeProvider>,
  );

  expect(getByText('test.inkml')).toBeTruthy();

  fireEvent(getByText('test.inkml'), 'press');
  expect(mockedNavigate).toHaveBeenCalledWith('InkMLAnnotationScreen', {
    file: inkmlFileMock,
  });
});

test('it navigates to the image annotation screen when it contains an image file and it is pressed', () => {
  const { getByText } = render(
    <DisplayModeProvider>
      <FileTypeProvider initialType="image">
        <File file={imageFileMock} />
      </FileTypeProvider>
    </DisplayModeProvider>,
  );

  expect(getByText('test.png')).toBeTruthy();

  fireEvent(getByText('test.png'), 'press');
  expect(mockedNavigate).toHaveBeenCalledWith('ImageAnnotationScreen', {
    file: imageFileMock,
  });
});
