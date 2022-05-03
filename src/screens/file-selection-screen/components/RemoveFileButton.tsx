import IconButton from '../../../components/IconButton';
import { useFileType } from '../../../context/FileTypeContext';
import { useAppDispatch } from '../../../stores/hooks';
import { useFileSelectionMode } from '../context/FileSelectionModeContext';
import { useSelectedFiles } from '../context/SelectedFilesContext';
import { removeImageFiles, removeTextFiles } from '../loaded-files-slice';

const RemoveFileButton = () => {
  const { selectedFiles, setSelectedFiles } = useSelectedFiles();
  const { fileType } = useFileType();
  const { fileSelectionMode, setFileSelectionMode } = useFileSelectionMode();
  const dispatch = useAppDispatch();

  const handlePress = () => {
    switch (fileType) {
      case 'inkml':
        dispatch(removeTextFiles(selectedFiles));
        break;
      case 'image':
        dispatch(removeImageFiles(selectedFiles));
        break;
      default:
        break;
    }

    setSelectedFiles([]);
    setFileSelectionMode('single');
  };

  return (
    <IconButton
      library="material"
      iconName="close-circle"
      color="danger"
      onPress={handlePress}
      pressable={fileSelectionMode === 'multiple'}
    />
  );
};

export default RemoveFileButton;
