import IconButton from '../../../components/IconButton';
import { useAppDispatch } from '../../../stores/hooks';
import { useFileType } from '../context/FileTypeContext';
import { addImageFile, addTextFile } from '../loaded-files-slice';
import { handleFileImport } from '../utils/file-utils';

const ImportButton = () => {
  const { fileType } = useFileType();

  const dispatch = useAppDispatch();

  const addFiles = (fileInfo: any[]) => {
    switch (fileType) {
      case 'image':
        dispatch(addImageFile(fileInfo));
        break;
      case 'inkml':
        dispatch(addTextFile(fileInfo));
        break;
      default:
        break;
    }
  };

  const handlePress = () => {
    switch (fileType) {
      case 'image':
        handleFileImport('image').then(addFiles);
        break;
      case 'inkml':
        handleFileImport('inkml').then(addFiles);
        break;
      default:
        break;
    }
  };

  return (
    <IconButton
      library="Material"
      iconName="file-import"
      color="dark"
      onPress={handlePress}
    />
  );
};

export default ImportButton;
