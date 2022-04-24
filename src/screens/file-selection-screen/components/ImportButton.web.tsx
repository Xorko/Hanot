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

  const handlePress = async (event: React.ChangeEvent<HTMLInputElement>) => {
    let files;

    switch (fileType) {
      case 'image':
        files = await handleFileImport('image', event);
        break;
      case 'inkml':
        files = await handleFileImport('inkml', event);
        break;
    }

    addFiles(files);
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
