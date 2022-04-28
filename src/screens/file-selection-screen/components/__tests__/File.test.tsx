import { fireEvent, render } from 'test-utils';
import { DisplayModeProvider } from '../../../../screens/file-selection-screen/context/DisplayModeContext';
import { FileTypeProvider } from '../../../../screens/file-selection-screen/context/FileTypeContext';
import { InkMLFile } from '../../../../types/file-import-types';
import colors from '../../../../style/colors';
import { FileSelectionModeProvider } from '../../context/FileSelectionModeContext';
import { SelectedFilesProvider } from '../../context/SelectedFilesContext';
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
        <FileSelectionModeProvider>
          <SelectedFilesProvider>
            <File file={inkmlFileMock} />
          </SelectedFilesProvider>
        </FileSelectionModeProvider>
      </FileTypeProvider>
    </DisplayModeProvider>,
  );

  expect(queryByText(/test.inkml/i)).toBeTruthy();
});

test('it navigates to the inkml annotation screen when it contains an inkml file and it is pressed', () => {
  const { getByText } = render(
    <DisplayModeProvider>
      <FileTypeProvider>
        <FileSelectionModeProvider>
          <SelectedFilesProvider>
            <File file={inkmlFileMock} />
          </SelectedFilesProvider>
        </FileSelectionModeProvider>
      </FileTypeProvider>
    </DisplayModeProvider>,
  );

  fireEvent(getByText(/test.inkml/i), 'press');
  expect(mockedNavigate).toHaveBeenCalledWith('InkMLAnnotationScreen', {
    file: inkmlFileMock,
  });
});

test('it navigates to the image annotation screen when it contains an image file and it is pressed', () => {
  const { getByText } = render(
    <DisplayModeProvider>
      <FileTypeProvider initialType="image">
        <FileSelectionModeProvider>
          <SelectedFilesProvider>
            <File file={imageFileMock} />
          </SelectedFilesProvider>
        </FileSelectionModeProvider>
      </FileTypeProvider>
    </DisplayModeProvider>,
  );

  fireEvent(getByText(/test.png/i), 'press');

  expect(mockedNavigate).toHaveBeenCalledWith('ImageAnnotationScreen', {
    file: imageFileMock,
  });
});

test('it is selected on long press in block mode', () => {
  const { getByTestId } = render(
    <DisplayModeProvider>
      <FileTypeProvider>
        <FileSelectionModeProvider>
          <SelectedFilesProvider>
            <File file={inkmlFileMock} />
          </SelectedFilesProvider>
        </FileSelectionModeProvider>
      </FileTypeProvider>
    </DisplayModeProvider>,
  );

  fireEvent(getByTestId('file-block'), 'onLongPress');

  expect(getByTestId('file-block')).toHaveStyle({
    borderColor: colors.secondary,
  });
});

test('it is selected on long press in list mode', () => {
  const { getByTestId } = render(
    <DisplayModeProvider initialMode="list">
      <FileTypeProvider>
        <FileSelectionModeProvider>
          <SelectedFilesProvider>
            <File file={inkmlFileMock} />
          </SelectedFilesProvider>
        </FileSelectionModeProvider>
      </FileTypeProvider>
    </DisplayModeProvider>,
  );

  fireEvent(getByTestId('file-list'), 'onLongPress');

  expect(getByTestId('file-list')).toHaveStyle({
    borderColor: colors.secondary,
  });
});

test('it is selected on press when in multiple selection mode', () => {
  const { getByText, getByTestId } = render(
    <DisplayModeProvider>
      <FileTypeProvider>
        <FileSelectionModeProvider initialType="multiple">
          <SelectedFilesProvider>
            <File file={inkmlFileMock} />
          </SelectedFilesProvider>
        </FileSelectionModeProvider>
      </FileTypeProvider>
    </DisplayModeProvider>,
  );

  fireEvent(getByText(/test.inkml/i), 'press');

  expect(getByTestId('file-block')).toHaveStyle({
    borderColor: colors.secondary,
  });
});

test('it is unselected on press', () => {
  const { getByText, getByTestId } = render(
    <DisplayModeProvider>
      <FileTypeProvider>
        <FileSelectionModeProvider initialType="multiple">
          <SelectedFilesProvider>
            <File file={inkmlFileMock} />
          </SelectedFilesProvider>
        </FileSelectionModeProvider>
      </FileTypeProvider>
    </DisplayModeProvider>,
  );

  fireEvent(getByText(/test.inkml/i), 'onLongPress');
  fireEvent(getByText(/test.inkml/i), 'press');

  expect(getByTestId('file-block')).toHaveStyle({
    borderColor: colors.primary,
  });
});
