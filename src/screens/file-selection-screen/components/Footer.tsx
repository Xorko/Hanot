import { View } from 'react-native';
import IconButton from '../../../components/IconButton';

const Footer = () => {
  return (
    <View>
      <IconButton
        iconName="help-circle-outline"
        onPress={() => ''}
        library="material"
        color="info"
      />
    </View>
  );
};

export default Footer;
