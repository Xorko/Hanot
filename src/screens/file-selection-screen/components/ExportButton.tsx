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
} from '../utils/export-utils';

function ExportButton() {
  const { fileType } = useFileType();
  const { annotatedImages } = useAppSelector(state => state.annotatedImages);
  const { annotatedInkml } = useAppSelector(state => state.annotatedInkml);
  const { selectedFiles } = useSelectedFiles();

  const exportImage = (
    filePath: string,
    fileName: string,
    multipleFiles: boolean,
  ) => {
    const imageIndex = annotatedImages.findIndex(
      image => image.filePath === filePath,
    );
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
    filePath: string,
    fileName: string,
    multipleFiles: boolean,
  ) => {
    const inkmlIndex = selectedFiles.findIndex(
      file => file.filePath === filePath,
    );

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

  const handlePress = () => {
    const multipleFiles = selectedFiles.length > 1;
    selectedFiles.forEach(file => {
      if (file.type === fileType) {
        switch (fileType) {
          case 'image':
            exportImage(file.filePath, file.fileName, multipleFiles);
            break;
          case 'inkml':
            exportInkml(file.filePath, file.fileName, multipleFiles);
            break;
          default:
            break;
        }
      }
    });
  };

  return (
    <IconButton
      library="Material"
      iconName="file-export"
      onPress={handlePress}
    />
  );
}

export default ExportButton;
