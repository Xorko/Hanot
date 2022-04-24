import cloneDeep from 'lodash/cloneDeep';
import { Platform } from 'react-native';
import Toast from 'react-native-toast-message';
import { Pixel } from '../../annotation/image-annotation-screen/types/image-annotation-types';

// RNFS can't be imported on web so we can't use `import`
const RNFS = Platform.OS !== 'web' && require('react-native-fs');

// RNPermissions can't be imported on web so we can't use `import`
const { PERMISSIONS, request, RESULTS } =
  Platform.OS !== 'web' && require('react-native-permissions');

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
      .map((pixel: Pixel) => pixel.annotation + ';')
      .forEach((pixel: string) => res.push(pixel));
    res.push('\n');
  }
  return res.join('');
};

/**
 * Asks permission to write a file for different platform
 */
const platformPermission = () => {
  try {
    switch (Platform.OS) {
      case 'ios':
        return request(PERMISSIONS.IOS.MEDIA_LIBRARY);
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
    const permission = await platformPermission();
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
 * @param mutilple option for many export
 */
export const exportFile = async (
  fileContent: string,
  fileName: string,
  mutilple?: boolean,
) => {
  const path =
    Platform.OS === 'ios'
      ? RNFS.DocumentDirectoryPath
      : RNFS.ExternalDirectoryPath;
  const outputPath = `${path}/Documents/Hanot`;
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

    if (!mutilple) {
      Toast.show({
        type: 'success',
        text1: fileName + ' annotation has been exported',
        text2: 'location: ' + outputPath,
      });
    }
  } catch (err) {
    Toast.show({
      type: 'error',
      text1: fileName + ' export failed',
      text2: err as string,
      visibilityTime: 5001,
    });
  }

  if (mutilple) {
    Toast.show({
      type: 'success',
      text1: 'Export Finished',
      text2: 'location: ' + outputPath,
      visibilityTime: 6000,
    });
  }

  return outputPath;
};
