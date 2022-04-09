import {useContext} from 'react';
import {TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {FileTypeContext} from '../context/FileTypeContext';

const FileTypeChangeButton = () => {
  const {type, changeType} = useContext(FileTypeContext);

  const handlePress = () => {
    changeType();
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
      <View>
        <Icon name={type === 'inkml' ? 'file-code' : 'file-image'} size={40} />
      </View>
    </TouchableOpacity>
  );
};

export default FileTypeChangeButton;
