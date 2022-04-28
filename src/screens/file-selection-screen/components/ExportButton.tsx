import { Platform } from 'react-native';
import IconButton from '../../../components/IconButton';
import { exportInk } from '../../../core/output';
import { builder } from '../../../lib/fast-xml-parser';
import { useAppSelector } from '../../../stores/hooks';
import { useFileType } from '../context/FileTypeContext';
import { useSelectedFiles } from '../context/SelectedFilesContext';
import {
  callFunctionWithPermission,
  createImageExport,
  exportFile,
  shareToFiles,
} from '../utils/export-utils';

function ExportButton() {
  const { fileType } = useFileType();
  const { annotatedImages } = useAppSelector(state => state.annotatedImages);
  const { annotatedInkml } = useAppSelector(state => state.annotatedInkml);
  const { selectedFiles, setSelectedFiles } = useSelectedFiles();

  const exportImage = (
    id: string,
    fileName: string,
    multipleFiles: boolean,
  ) => {
    const imageIndex = annotatedImages.findIndex(image => image.id === id);
    if (imageIndex !== -1) {
      const imageToExport = annotatedImages[imageIndex];
      const fileContent = createImageExport(
        imageToExport.imagePixels,
        imageToExport.imageWidth,
      );
      callFunctionWithPermission(() =>
        exportFile(fileContent, fileName, multipleFiles),
      );
    } else {
      console.error('Image has not been annotated');
    }
  };

  const exportInkml = (
    id: string,
    fileName: string,
    multipleFiles: boolean,
  ) => {
    const inkmlIndex = selectedFiles.findIndex(file => file.id === id);

    if (inkmlIndex !== -1) {
      const inkmlToExport = annotatedInkml[inkmlIndex];
      if (inkmlToExport) {
        const dataToExport = exportInk(inkmlToExport.content);
        if (dataToExport) {
          const fileContent = builder.build(dataToExport);
          callFunctionWithPermission(() =>
            exportFile(fileContent, fileName, multipleFiles),
          );
        }
      }
    }
  };

  const handlePress = async () => {
    const multipleFiles = selectedFiles.length > 1;
    selectedFiles.forEach(file => {
      if (file.type === fileType) {
        switch (fileType) {
          case 'image':
            exportImage(file.id, file.fileName, multipleFiles);
            break;
          case 'inkml':
            exportInkml(file.id, file.fileName, multipleFiles);
            break;
        }
      }
    });
    setSelectedFiles([]);

    // It is necessary to ask the user where to save the files so he can access
    // it in the Files app (at least since iOS 15).
    //
    // https://github.com/itinance/react-native-fs/issues/1051#issuecomment-965481463
    // https://github.com/itinance/react-native-fs/issues/897#issuecomment-1024313510
    if (Platform.OS === 'ios') {
      const RNFS = (await import('react-native-fs')).default;

      const filePaths = (
        await RNFS.readDir(`${RNFS.TemporaryDirectoryPath}/annotated`)
      ).map(item => item.path);

      await shareToFiles(filePaths);

      filePaths.forEach(path => {
        RNFS.unlink(path);
      });
    }
  };

  return (
    <IconButton
      library="material"
      iconName="file-export"
      onPress={handlePress}
    />
  );
}

export default ExportButton;
