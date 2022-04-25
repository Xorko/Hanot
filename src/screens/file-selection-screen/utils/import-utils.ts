import React from 'react';
import { Platform } from 'react-native';
import DocumentPicker, {
  DocumentPickerResponse,
  types,
} from 'react-native-document-picker';
import { constructData } from '../../../core/input';
import { parser } from '../../../lib/fast-xml-parser';
import { ImageFile, InkMLFile } from '../types/file-import-types';
import type { FileType } from '../types/files-type';

// RNFS can't be imported on the web so we can't use `import`
const RNFS = Platform.OS !== 'web' && require('react-native-fs');

/**
 * Converts a FileList to an array of File objects
 *
 * @param fileList The FileList to convert
 * @returns A list of File objects
 */
const fileListToFileArray = (fileList: FileList) => {
  const fileArray = [];

  for (let i = 0; i < fileList.length; i++) {
    fileArray.push(fileList[i]);
  }

  return fileArray;
};

/**
 * Opens the file picker and returns selected files
 *
 * Warning: it allows every file type because there is no MIME type for InkML files
 *
 * @returns The selected files
 */
const pickInkMLFiles = () => {
  try {
    return DocumentPicker.pickMultiple();
  } catch (err) {
    if (!DocumentPicker.isCancel(err)) {
      throw err;
    }
  }
};

/**
 * Opens the file picker and returns selected image files
 *
 * @returns The selected image files
 */
const pickImageFiles = () => {
  try {
    return DocumentPicker.pickMultiple({ type: [types.images] });
  } catch (err) {
    if (!DocumentPicker.isCancel(err)) {
      throw err;
    }
  }
};

/**
 * Handles the file selection for web and mobile
 *
 * @param files The FileList from the web file picker. Optional.
 * @returns The list of selected files
 */
const selectFiles = async (files?: FileList, type?: FileType) => {
  let pickedFiles: (DocumentPickerResponse | File)[] | undefined;

  if (Platform.OS !== 'web') {
    try {
      pickedFiles = await (type === 'image'
        ? pickImageFiles()
        : pickInkMLFiles());
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) {
        throw err;
      }
    }
  } else {
    if (files) {
      pickedFiles = fileListToFileArray(files);
    }
  }

  if (type === 'inkml' && pickedFiles) {
    // Files must have the .inkml extension to avoid loading any files
    pickedFiles = pickedFiles.filter(file => file.name.endsWith('.inkml'));
  }

  return pickedFiles;
};

/**
 * Reads a file and returns its content as text on mobile
 *
 * @param file The file to read
 * @returns The content of the file as text
 */
const readTextFileMobile = (file: DocumentPickerResponse) => {
  return RNFS.readFile(file.uri, 'utf8') as string;
};

/**
 * Reads a file and returns its content as text on the web
 *
 * @param file The file to read
 * @returns The content of the file as text
 */
const readTextFileWeb = (file: File) => file.text();

/**
 * Handles the text file reading for web and mobile
 *
 * @param file The text file to read
 * @returns The content of the file as text
 */
const readTextFile = (file: DocumentPickerResponse | File) =>
  Platform.OS === 'web'
    ? readTextFileWeb(file as File)
    : readTextFileMobile(file as DocumentPickerResponse);

/**
 * Reads an image file and encodes it in base64 on mobile
 *
 * @param file The image file to read
 * @returns The image file in base64
 */
const readImageFileMobile = (file: DocumentPickerResponse) => {
  return RNFS.readFile(file.uri, 'base64') as string;
};

/**
 * Reads an image file and returns it in base64 on the web
 *
 * @param file The image file to read
 * @returns The image file in base64
 */
const readImageFileWeb = (file: File) => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result?.toString() || '');
    reader.onerror = error => reject(error);
  });
};

/**
 * Handles the image file base64 encoding for web and mobile
 *
 * @param file The text file to read
 * @returns The file content as text
 */
const readImageFile = (file: DocumentPickerResponse | File) =>
  Platform.OS === 'web'
    ? readImageFileWeb(file as File)
    : readImageFileMobile(file as DocumentPickerResponse);

/**
 * Reads a file and returns its content
 *
 * @param file The file to read
 * @param type The type of file to read
 * @returns The content of the file as text if type = inkml or the file in base64 if type = image
 */
const readFile = (file: DocumentPickerResponse | File, type: FileType) => {
  switch (type) {
    case 'image':
      return readImageFile(file);
    case 'inkml':
      return readTextFile(file);
  }
};

/**
 * Parses an XML file
 *
 * @param xml The XML file as text
 * @returns An object containing the parsed XML
 */
const parseXML = (xml: string) => {
  return parser.parse(xml);
};

/**
 * Parses an InkML file
 *
 * @param pickedFiles The selected files
 * @param fileContent The content of the file to parse
 * @param index The index of the file to parse
 * @returns The parsed file as InkMLFile
 */
const parseInkML = (
  pickedFiles: (DocumentPickerResponse | File)[],
  fileContent: string,
  index: number,
): InkMLFile => {
  const parsed = constructData(parseXML(fileContent).ink);
  return {
    content: parsed,
    fileName: pickedFiles![index].name,
    filePath:
      Platform.OS === 'web'
        ? (pickedFiles![index] as File).webkitRelativePath // WARNING: this is only supported on webkit browsers (e.g. Chrome)
        : (pickedFiles![index] as DocumentPickerResponse).uri,
  };
};

/**
 * Encodes an image file in base64
 *
 * @param pickedFiles The selected files
 * @param fileContent The content of the file to parse
 * @param index The index of the file to parse
 * @returns The parsed file as ImageFile
 */
const encodeImage = (
  pickedFiles: (DocumentPickerResponse | File)[],
  fileContent: string,
  index: number,
): ImageFile => {
  const image = 'data:' + pickedFiles![index].type + ';base64,' + fileContent;
  return {
    image,
    fileName: pickedFiles![index].name,
    filePath:
      Platform.OS === 'web'
        ? (pickedFiles![index] as File).webkitRelativePath
        : (pickedFiles![index] as DocumentPickerResponse).uri,
  };
};

/**
 * Handles the file parsing for web and mobile
 *
 * @param pickedFiles The picked files
 * @param type The type of file to parse
 * @returns The parsed files as InkMLFile[] or ImageFile[]
 */
const parseFiles = async (
  pickedFiles: (DocumentPickerResponse | File)[],
  type: FileType,
) => {
  const readFiles = pickedFiles.map(file => readFile(file, type));

  const files = await Promise.all(readFiles);
  return files.map((fileContent, i) => {
    switch (type) {
      case 'inkml':
        return parseInkML(pickedFiles, fileContent, i);
      case 'image':
        return encodeImage(pickedFiles, files[i], i);
    }
  });
};

/**
 * Handles the file import for web and mobile
 *
 * @param type The type of file to import
 * @param event The event that triggered the file import (web only).
 * @returns The parsed files as (InkMLFile | ImageFile)[] or empty array if no files were selected
 */
export const handleFileImport = async (
  type: FileType,
  event?: React.ChangeEvent<HTMLInputElement>,
) => {
  const pickedFiles = await selectFiles(
    event?.target?.files || undefined,
    type,
  );

  if (pickedFiles) {
    return parseFiles(pickedFiles, type);
  }
  return [];
};
