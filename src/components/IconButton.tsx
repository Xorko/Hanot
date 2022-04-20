import { TouchableOpacity, View } from 'react-native';
import IconAnt from 'react-native-vector-icons/AntDesign';
import IconFA5 from 'react-native-vector-icons/FontAwesome5';
import IconMaterial from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../style/colors';

type IconLibrary = 'FA5' | 'AntDesign' | 'Material';

type IconButtonProps = {
  iconName: string;
  iconSize?: number;
  activeOpacity?: number;
  onPress: () => void;
  library: IconLibrary;
  color?: keyof typeof colors;
};

function IconButton({
  iconName,
  iconSize,
  activeOpacity,
  onPress,
  library,
  color,
}: IconButtonProps) {
  const iconColor = color ? colors[color] : undefined;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={activeOpacity || 0.8}
      testID="icon-btn">
      <View>
        {library === 'FA5' && (
          <IconFA5 color={iconColor} name={iconName} size={iconSize || 40} />
        )}
        {library === 'AntDesign' && (
          <IconAnt color={iconColor} name={iconName} size={iconSize || 40} />
        )}
        {library === 'Material' && (
          <IconMaterial
            color={iconColor}
            name={iconName}
            size={iconSize || 40}
          />
        )}
      </View>
    </TouchableOpacity>
  );
}

export default IconButton;
