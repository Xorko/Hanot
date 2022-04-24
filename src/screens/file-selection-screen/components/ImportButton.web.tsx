import { View } from 'react-native';
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

  const handlePress = (event: React.ChangeEvent<HTMLInputElement>) => {
    switch (fileType) {
      case 'image':
        handleFileImport('image', event).then(addFiles);
        break;
      case 'inkml':
        handleFileImport('inkml', event).then(addFiles);
        break;
      default:
        break;
    }
  };

  return (
    <View>
      <label htmlFor="file-input">
        <IconButton library="Material" iconName="file-import" color="dark" />
      </label>
      <input
        type="file"
        multiple
        id="file-input"
        style={inputStyle}
        onChange={event => handlePress(event)}
      />
    </View>
  );
};

const inputStyle = {
  display: 'none',
};

export default ImportButton;
