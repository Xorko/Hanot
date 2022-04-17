import { TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

type IconButtonProps = {
  iconName: string;
  iconSize?: number;
  activeOpacity?: number;
  onPress: () => void;
};

function IconButton({
  iconName,
  iconSize,
  activeOpacity,
  onPress,
}: IconButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={activeOpacity || 0.8}
      testID="icon-btn">
      <View>
        <Icon name={iconName} size={iconSize || 40} />
      </View>
    </TouchableOpacity>
  );
}

export default IconButton;
