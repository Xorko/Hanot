import {useContext} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {ModeContext} from '../../../context/ModeContext';
import Icon from 'react-native-vector-icons/FontAwesome5';

function ChangeModeButton() {
  const {mode, changeMode} = useContext(ModeContext);

  const handlePress = () => {
    mode === 'block' ? changeMode('list') : changeMode('block');
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
      <View>
        <Icon name={mode === 'block' ? 'th' : 'list'} size={40} />
      </View>
    </TouchableOpacity>
  );
}

export default ChangeModeButton;
