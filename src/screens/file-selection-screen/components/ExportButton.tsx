import { Platform, StyleSheet, View } from 'react-native';
import IconButton from '../../../components/IconButton';
import Text from '../../../components/Text';
import { useFileType } from '../../../context/FileTypeContext';
import { exportInkML } from '../../../core/output';
import { builder } from '../../../lib/fast-xml-parser';
import { useAppSelector } from '../../../stores/hooks';
import { useFileSelectionMode } from '../context/FileSelectionModeContext';
import { useSelectedFiles } from '../context/SelectedFilesContext';
import {
  callFunctionWithPermission,
  createImageExport,
  exportFile,
  exportFileWeb,
  shareToFiles,
} from '../utils/export-utils';

function ExportButton() {
  const { fileType } = useFileType();
  const { annotatedImages } = useAppSelector(state => state.annotatedImages);
  const { annotatedInkml } = useAppSelector(state => state.annotatedInkml);
  const { selectedFiles, setSelectedFiles } = useSelectedFiles();
  const { fileSelectionMode, setFileSelectionMode } = useFileSelectionMode();

  const exportImage = (
    id: string,
    fileName: string,
    multipleFiles: boolean,
  ) => {
    const imageIndex = annotatedImages.findIndex(image => image.id === id);
    if (imageIndex !== -1) {
      const imageToExport = annotatedImages[imageIndex];
      if (imageToExport.imageSize) {
        const fileContent = createImageExport(
          imageToExport.imagePixels,
          imageToExport.imageSize.width,
        );

        if (Platform.OS === 'web') {
          exportFileWeb(fileContent, fileName, 'text/csv;charset=utf-8;');
        } else {
          callFunctionWithPermission(() =>
            exportFile(fileContent, fileName, multipleFiles),
          );
        }
      }
    } else {
      console.error('Image has not been annotated');
    }
  };

  const exportInkml = (
    id: string,
    fileName: string,
    multipleFiles: boolean,
  ) => {
    const inkmlIndex = annotatedInkml.findIndex(file => file.id === id);

    if (inkmlIndex !== -1) {
      const inkmlToExport = annotatedInkml[inkmlIndex];
      if (inkmlToExport) {
        const dataToExport = exportInkML(inkmlToExport);
        if (dataToExport) {
          const fileContent = builder.build(dataToExport);
          if (Platform.OS === 'web') {
            exportFileWeb(fileContent, fileName, 'text/inkML;charset=utf-8;');
          } else {
            callFunctionWithPermission(() =>
              exportFile(fileContent, fileName, multipleFiles),
            );
          }
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
    setFileSelectionMode('single');

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
    <View style={styles.container}>
      <IconButton
        library="material"
        iconName="file-export"
        iconSize={60}
        color="primary"
        onPress={handlePress}
        pressable={fileSelectionMode === 'multiple'}
      />
      <Text variant="dark">Exporter</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
});

export default ExportButton;
