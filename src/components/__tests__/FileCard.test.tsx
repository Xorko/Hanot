import { nanoid } from 'nanoid';
import { FileTypeProvider } from '../../context/FileTypeContext';
import { DisplayModeProvider } from '../../screens/file-selection-screen/context/DisplayModeContext';
import { FileSelectionModeProvider } from '../../screens/file-selection-screen/context/FileSelectionModeContext';
import { SelectedFilesProvider } from '../../screens/file-selection-screen/context/SelectedFilesContext';
import colors from '../../style/colors';
import { InkMLFile } from '../../types/file-import-types';
import { fireEvent, render } from '../../utils/test-utils';
import File from '../FileCard';

const mockedNavigate = jest.fn();
const id = nanoid();

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
  id,
  fileName: 'test.inkml',
};

const imageFileMock: InkMLFile = {
  id,
  fileName: 'test.png',
};

afterEach(() => {
  mockedNavigate.mockClear();
});

test('it displays the filename', () => {
  const { queryByText } = render(
    <DisplayModeProvider>
      <FileSelectionModeProvider>
        <SelectedFilesProvider>
          <File file={inkmlFileMock} />
        </SelectedFilesProvider>
      </FileSelectionModeProvider>
    </DisplayModeProvider>,
  );

  expect(queryByText(/test.inkml/i)).toBeTruthy();
});

test('it navigates to the inkml annotation screen when it contains an inkml file and it is pressed', () => {
  const { getByText } = render(
    <DisplayModeProvider>
      <FileSelectionModeProvider>
        <SelectedFilesProvider>
          <File file={inkmlFileMock} />
        </SelectedFilesProvider>
      </FileSelectionModeProvider>
    </DisplayModeProvider>,
  );

  fireEvent(getByText(/test.inkml/i), 'press');
  expect(mockedNavigate).toHaveBeenCalledWith('AnnotationScreen', {
    screen: 'Annotation',
    params: {
      file: inkmlFileMock,
      type: 'inkml',
    },
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

  expect(mockedNavigate).toHaveBeenCalledWith('AnnotationScreen', {
    screen: 'Annotation',
    params: {
      file: imageFileMock,
      type: 'image',
    },
  });
});

test('it is selected on long press in block mode', () => {
  const { getByTestId } = render(
    <DisplayModeProvider>
      <FileSelectionModeProvider>
        <SelectedFilesProvider>
          <File file={inkmlFileMock} />
        </SelectedFilesProvider>
      </FileSelectionModeProvider>
    </DisplayModeProvider>,
  );

  fireEvent(getByTestId('file-block'), 'onLongPress');

  expect(getByTestId('file-block')).toHaveStyle({
    opacity: 0.5,
  });
});

test('it is selected on long press in list mode', () => {
  const { getByTestId } = render(
    <DisplayModeProvider initialMode="list">
      <FileSelectionModeProvider>
        <SelectedFilesProvider>
          <File file={inkmlFileMock} />
        </SelectedFilesProvider>
      </FileSelectionModeProvider>
    </DisplayModeProvider>,
  );

  fireEvent(getByTestId('file-list'), 'onLongPress');

  expect(getByTestId('file-list')).toHaveStyle({
    opacity: 0.5,
  });
});

test('it is selected on press when in multiple selection mode', () => {
  const { getByText, getByTestId } = render(
    <DisplayModeProvider>
      <FileSelectionModeProvider initialType="multiple">
        <SelectedFilesProvider>
          <File file={inkmlFileMock} />
        </SelectedFilesProvider>
      </FileSelectionModeProvider>
    </DisplayModeProvider>,
  );

  fireEvent(getByText(/test.inkml/i), 'press');

  expect(getByTestId('file-block')).toHaveStyle({
    opacity: 0.5,
  });
});

test('it is unselected on press', () => {
  const { getByText, getByTestId } = render(
    <DisplayModeProvider>
      <FileSelectionModeProvider initialType="multiple">
        <SelectedFilesProvider>
          <File file={inkmlFileMock} />
        </SelectedFilesProvider>
      </FileSelectionModeProvider>
    </DisplayModeProvider>,
  );

  fireEvent(getByText(/test.inkml/i), 'onLongPress');
  fireEvent(getByText(/test.inkml/i), 'press');

  expect(getByTestId('file-block')).toHaveStyle({
    borderColor: colors.primary,
  });
});
