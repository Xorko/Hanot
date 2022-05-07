import { useRef } from 'react';
import { View } from 'react-native';
import IconButton from '../../../components/IconButton';
import Text from '../../../components/Text';
import { useFileType } from '../../../context/FileTypeContext';
import { useAppDispatch } from '../../../stores/hooks';
import { addImageFile, addTextFile } from '../loaded-files-slice';
import { handleFileImport } from '../utils/import-utils';

const ImportButton = () => {
  const { fileType } = useFileType();
  const inputRef = useRef<HTMLInputElement>(null);

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

    if (inputRef.current) {
      inputRef.current.value = '';
    }

    addFiles(files);
  };

  return (
    <View>
      <label htmlFor="file-input">
        <IconButton library="material" iconName="file-import" color="dark" />
      </label>
      <input
        type="file"
        accept={fileType === 'image' ? 'image/*' : '.inkml'}
        multiple
        id="file-input"
        ref={inputRef}
        style={inputStyle}
        onChange={event => handlePress(event)}
      />
      <Text variant="dark">Ouvrir</Text>
    </View>
  );
};

const inputStyle = {
  display: 'none',
};

export default ImportButton;
