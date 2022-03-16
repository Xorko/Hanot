import { XMLParser } from 'fast-xml-parser';
import { Platform } from 'react-native';
import DocumentPicker, {
  DocumentPickerResponse,
} from 'react-native-document-picker';
import { xmlToJsOptions } from '../shared/lib/fast-xml-parser-config';

const parser = new XMLParser();

/**
 * Opens the file picker and returns selected files
 * @returns The selected files
 */
export const pickFiles = (): Promise<DocumentPickerResponse[]> | undefined => {
  try {
    return DocumentPicker.pickMultiple();
  } catch (err) {
    console.error(err);
  }
};

/**
 * Reads a file and returns its content as text on mobile
 * @param file The file to read
 * @returns The content of the file as text
 */
export const readTextFileMobile = async (file: DocumentPickerResponse) => {
  const RNFS = require('react-native-fs'); // RNFS can't be imported on web so we can't use `import`
  return RNFS.readFile(file.uri, 'utf8');
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
  return parser.parse(xml, xmlToJsOptions);
};

/**
 * Handles the file selection
 * @returns The content of the files as JSON
 */
export const handleOpenFiles = async () => {
  const pickedFiles = await pickFiles();

  if (pickedFiles) {
    const readFiles = pickedFiles.map((file: DocumentPickerResponse) =>
      Platform.OS === 'web' ? readTextFileWeb(file) : readTextFileMobile(file),
    );
    const filesAsXML = Promise.all(readFiles).then((filesAsText: string[]) =>
      filesAsText.map((fileAsText, i) => {
        const parsed = parseXML(fileAsText);
        return {
          ...parsed,
          fileName: pickedFiles[i].name,
          filePath: pickedFiles[i].uri,
        };
      }),
    );

    return filesAsXML;
  }
  return [];
};
