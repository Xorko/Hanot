import cloneDeep from 'lodash/cloneDeep';
import { Platform } from 'react-native';
import Toast from 'react-native-toast-message';
import { Pixel } from '../../annotation/image-annotation/types/image-annotation-types';

// RNFS can't be imported on web so we can't use `import`
const RNFS = Platform.OS !== 'web' && require('react-native-fs');

// RNPermissions can't be imported on web so we can't use `import`
const { PERMISSIONS, request, RESULTS } =
  Platform.OS !== 'web' && require('react-native-permissions');

/**
 * Open the iOS file share prompt to export files to the Files app
 * @param files Array of filepaths of the files to share
 */
export const shareToFiles = async (files: string[]) => {
  const Share = (await import('react-native-share')).default;

  const shareOptions = {
    title: 'Save to files',
    failOnCancel: false,
    saveToFiles: true,
    urls: files, // base64 with mimeType or path to local file
  };

  try {
    await Share.open(shareOptions);
  } catch (err) {} // Ignore errors
};

/**
 * Creates the content of the file to be exported
 * @param pixels The annotated pixels
 * @param imageWidth The width of the image
 * @returns The string of the csv file
 */
export const createImageExport = (pixels: Pixel[], imageWidth: number) => {
  const res: string[] = [];

  const pixelsCopy = cloneDeep(pixels);
  while (pixelsCopy.length) {
    pixelsCopy
      .splice(0, imageWidth)
      .map((pixel: Pixel) => `${pixel.color},${pixel.annotation};`)
      .forEach((pixel: string) => res.push(pixel));
    res.push('\n');
  }
  return res.join('');
};

/**
 * Asks permission to write a file for different platform
 */
const requestWritePermission = () => {
  try {
    switch (Platform.OS) {
      case 'ios':
        // No need to ask permission on iOS
        return RESULTS.GRANTED;
      case 'android':
        return request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE);

      default:
        break;
    }
  } catch (err) {
    console.error(err);
  }
};

/**
 * Asks permisson and execute the callback
 * @param callback function to execute
 */
export const callFunctionWithPermission = async (callback: () => any) => {
  try {
    const permission = await requestWritePermission();
    switch (permission) {
      case RESULTS.GRANTED:
        callback();
        break;

      case RESULTS.DENIED:
        break;

      default:
        break;
    }
  } catch (error) {
    console.warn(error);
  }
};

/**
 * Creates a Directory for the Export
 * @param path path of the Directory
 */
const createDirectory = (path: string) => {
  RNFS.mkdir(path);
};

/**
 * Exports a file
 * @param fileName name of the file
 * @param fileContent the file in string form
 * @param mutiple option for many export
 */
export const exportFile = async (
  fileContent: string,
  fileName: string,
  mutiple?: boolean,
) => {
  const outputPath =
    Platform.OS === 'ios'
      ? `${RNFS.TemporaryDirectoryPath}/annotated`
      : `${RNFS.ExternalDirectoryPath}/Documents/Hanot`;
  createDirectory(outputPath);
  let newFileName = fileName;

  if (!newFileName) {
    newFileName = 'output';
  } else {
    if (!newFileName.endsWith('inkml')) {
      const fileSubString = newFileName.substring(
        0,
        newFileName.lastIndexOf('.'),
      );
      newFileName = `${fileSubString ? fileSubString : newFileName}.csv`;
    }
    newFileName = `output_${newFileName}`;
  }
  const pathToWrite = `${outputPath}/${newFileName}`;

  try {
    await RNFS.writeFile(pathToWrite, fileContent, 'utf8');

    if (!mutiple) {
      Toast.show({
        type: 'success',
        text1: `${fileName} a été exporté`,
        text2: `emplacement: ${outputPath}`,
      });
    }
  } catch (err) {
    Toast.show({
      type: 'error',
      text1: `Export de ${fileName} échoué`,
      text2: err as string,
    });
  }

  if (mutiple) {
    Toast.show({
      type: 'success',
      text1: 'Export terminé',
      text2: `emplacement: ${outputPath}`,
    });
  }

  return outputPath;
};
