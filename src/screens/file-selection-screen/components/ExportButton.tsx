import IconButton from '../../../components/IconButton';
import { useAppSelector } from '../../../stores/hooks';
import { useFileType } from '../context/FileTypeContext';
import { useSelectedFiles } from '../context/SelectedFilesContext';
import { createImageExport } from '../utils/export-utils';

function ExportButton() {
  const { fileType } = useFileType();
  const { annotatedImages } = useAppSelector(state => state.annotatedImages);
  const { selectedFiles } = useSelectedFiles();

  const exportImage = (filePath: string) => {
    const imageIndex = annotatedImages.findIndex(
      image => image.filePath === filePath,
    );
    if (imageIndex !== -1) {
      const imageToExport = annotatedImages[imageIndex];
      createImageExport(imageToExport.imagePixels, imageToExport.imageWidth),
        console.log(filePath);
    } else {
      console.error('Image has not been annotated');
    }
  };

  const handlePress = () => {
    selectedFiles.forEach(file => {
      if (file.type === fileType) {
        switch (fileType) {
          case 'image':
            exportImage(file.filePath);
            break;
          case 'inkml':
            console.log('inkml');
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
