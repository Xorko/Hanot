import IconButton from '../../../components/IconButton';
import { useAppDispatch } from '../../../stores/hooks';
import { useFileType } from '../context/FileTypeContext';
import { addImageFile, addTextFile } from '../loaded-files-slice';
import {
  handleOpenImageFiles,
  handleOpenInkmlFiles
} from '../utils/file-utils';

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
        handleOpenImageFiles().then(addFiles);
        break;
      case 'inkml':
        handleOpenInkmlFiles().then(addFiles);
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
      onPress={() => handlePress()}
    />
  );
};

export default ImportButton;
