import {useContext} from 'react';
import {TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {useAppDispatch} from '../../../app/hooks';
import {FileTypeContext} from '../context/FileTypeContext';
import {
  addImageFile,
  addTextFile,
} from '../../../features/files/loaded-files-slice';
import {
  handleOpenImageFiles,
  handleOpenInkmlFiles,
} from '../../../utils/file-utils';

const ImportButton = () => {
  const {type} = useContext(FileTypeContext);

  const dispatch = useAppDispatch();

  const addFiles = (fileInfo: any[]) => {
    switch (type) {
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
    switch (type) {
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
    <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
      <View>
        <Icon name={'file-import'} size={40} />
      </View>
    </TouchableOpacity>
  );
};

export default ImportButton;
