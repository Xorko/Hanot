import { Pressable, View } from 'react-native';
import IconAnt from 'react-native-vector-icons/AntDesign';
import IconFA5 from 'react-native-vector-icons/FontAwesome5';
import IconMaterial from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../style/colors';

type IconLibrary = 'FA5' | 'AntDesign' | 'Material';

type IconButtonProps = {
  iconName: string;
  iconSize?: number;
  onPress?: () => void;
  library: IconLibrary;
  color?: keyof typeof colors;
};

function IconButton({
  iconName,
  iconSize,
  onPress,
  library,
  color,
}: IconButtonProps) {
  const iconColor = color ? colors[color] : undefined;

  return (
    <Pressable
      onPress={onPress}
      testID="icon-btn"
      style={({ pressed }) => ({
        opacity: pressed ? 0.5 : 1,
      })}>
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
    </Pressable>
  );
}

export default IconButton;
