import { Animated, StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../../../style/colors';
import { FileType } from '../../../types/file-types';

type HelpBannerProps = {
  type: FileType;
  fadeAnim?: Animated.Value;
};

function HelpBanner({ type, fadeAnim }: HelpBannerProps) {
  return (
    <Animated.View
      style={[
        bannerStyle.content,
        bannerStyle.shadow,
        { opacity: fadeAnim || 0 },
      ]}>
      <View style={bannerStyle.iconDescription}>
        <Icon name="comma-circle" size={30} color={colors.secondary} />
        <Text style={bannerStyle.ml}>Ajouter un signe diacritque</Text>
      </View>

      <View style={bannerStyle.iconDescription}>
        <Icon name="close-circle" size={30} color={colors.danger} />
        <Text style={bannerStyle.ml}>Supprimer la lettre</Text>
      </View>

      {type && (
        <View style={bannerStyle.iconDescription}>
          <Icon name="alert-circle" size={30} color={colors.warning} />
          <Text style={bannerStyle.ml}>Spécifier la lettre comme bruit</Text>
        </View>
      )}
    </Animated.View>
  );
}

const bannerStyle = StyleSheet.create({
  content: {
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 10,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
  },
  iconDescription: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  ml: {
    marginLeft: 5,
  },
});

export default HelpBanner;
