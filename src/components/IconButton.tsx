import { Pressable, View } from 'react-native';
import IconAnt from 'react-native-vector-icons/AntDesign';
import IconFA5 from 'react-native-vector-icons/FontAwesome5';
import IconMaterial from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../style/colors';

type IconLibrary = 'fa5' | 'antdesign' | 'material';

type IconButtonProps = {
  iconName: string;
  iconSize?: number;
  onPress?: () => void;
  library: IconLibrary;
  color?: keyof typeof colors;
  pressable?: boolean;
};

function IconButton({
  iconName,
  iconSize,
  onPress,
  library,
  color,
  pressable = true,
}: IconButtonProps) {
  const iconColor = color ? colors[color] : undefined;
  return (
    <Pressable
      disabled={!pressable}
      onPress={onPress}
      testID="icon-btn"
      style={({ pressed }) => ({
        opacity: pressed && pressable ? 0.5 : 1,
      })}>
      <View>
        {library === 'fa5' && (
          <IconFA5 color={iconColor} name={iconName} size={iconSize || 40} />
        )}
        {library === 'antdesign' && (
          <IconAnt color={iconColor} name={iconName} size={iconSize || 40} />
        )}
        {library === 'material' && (
          <IconMaterial
            color={pressable ? iconColor : colors.secondary}
            name={iconName}
            size={iconSize || 40}
            selectable={false}
          />
        )}
      </View>
    </Pressable>
  );
}

export default IconButton;
