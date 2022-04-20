import { Platform } from 'react-native';
import DocumentPicker, {
  DocumentPickerResponse,
  types,
} from 'react-native-document-picker';
import { constructData } from '../../../core/input';
import { parser } from '../../../lib/fast-xml-parser';
import { ImageFile, InkMLFile } from '../types/file-import-types';

/**
 * Opens the file picker and returns selected files
 * @returns The selected files
 */
export const pickFiles = (): Promise<DocumentPickerResponse[]> | undefined => {
  try {
    return DocumentPicker.pickMultiple({ type: 'application/octet-stream' });
  } catch (err) {
    if (!DocumentPicker.isCancel(err)) {
      console.error(err);
    }
  }
};

/**
 * Reads a file and returns its content as text on mobile
 * @param file The file to read
 * @returns The content of the file as text
 */
export const readTextFileMobile = (file: DocumentPickerResponse) => {
  const RNFS = require('react-native-fs'); // RNFS can't be imported on web so we can't use `import`
  return RNFS.readFile(file.uri, 'utf8') as string;
};

/**
 * Reads the content of a file as text
 * @param file The selected file
 * @returns The file content as text
 */
export const readTextFileWeb = async (file: any) => file.text();

/**
 * Parses an XML file
 * @param xml The XML file as text
 * @returns An object containing the parsed XML
 */
export const parseXML = (xml: string) => {
  return parser.parse(xml);
};

/**
 * Handles the file selection
 * @returns The content of the files as JSON
 */
export const handleOpenInkmlFiles = async (): Promise<InkMLFile[]> => {
  let pickedFiles: DocumentPickerResponse[] | undefined;

  try {
    pickedFiles = await pickFiles();
  } catch (err) {
    if (!DocumentPicker.isCancel(err)) {
      console.error(err);
    }
  }

  if (pickedFiles) {
    const readFiles = pickedFiles.map((file: DocumentPickerResponse) =>
      Platform.OS === 'web' ? readTextFileWeb(file) : readTextFileMobile(file),
    );
    const filesAsXML = Promise.all(readFiles).then((filesAsText: string[]) =>
      filesAsText.map((fileAsText, i) => {
        const parsed = constructData(parseXML(fileAsText).ink);
        return {
          content: parsed,
          fileName: pickedFiles![i].name,
          filePath: pickedFiles![i].uri,
        };
      }),
    );

    return filesAsXML;
  }
  return [];
};

const pickImage = (): Promise<DocumentPickerResponse[]> | undefined => {
  try {
    return DocumentPicker.pickMultiple({ type: [types.images] });
  } catch (err) {
    if (!DocumentPicker.isCancel(err)) {
      console.error(err);
    }
  }
};

const readImageFile = async (file: DocumentPickerResponse) => {
  const RNFS = require('react-native-fs'); // RNFS can't be imported on web so we can't use `import`
  return RNFS.readFile(file.uri, 'base64');
};

export const handleOpenImageFiles = async (): Promise<ImageFile[]> => {
  let pickedFiles: DocumentPickerResponse[] | undefined;

  try {
    pickedFiles = await pickImage();
  } catch (err) {
    if (!DocumentPicker.isCancel(err)) {
      console.error(err);
    }
  }

  if (pickedFiles) {
    const readFiles = pickedFiles.map((file: DocumentPickerResponse) =>
      readImageFile(file),
    );

    const files = Promise.all(readFiles).then((res: string[]) =>
      res.map((_, i) => {
        const image = 'data:' + pickedFiles![i].type + ';base64,' + res[i];
        return {
          image,
          fileName: pickedFiles![i].name,
          filePath: pickedFiles![i].uri,
        };
      }),
    );
    return files;
  }
  return [];
};
