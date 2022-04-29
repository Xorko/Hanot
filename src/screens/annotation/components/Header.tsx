import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import IconButton from '../../../components/IconButton';
import type { FileType } from '../../../types/file-types';
import { RootStackParamList } from '../../../types/navigation-types';
import { useCurrentStatePanelContext } from '../context/CurrentStatePanelContext';
import HelpBanner from './HelpBanner';

type HeaderProps = {
  type: FileType;
};

type HeaderButtonProps = {
  toggleHelp: () => void;
};

function Header({ type }: HeaderProps) {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const { currentStatePanel, setCurrentStatePanel } =
    useCurrentStatePanelContext();

  // Using a ref instead of a state avoids having to re-render the component when the value is changed
  const showHelp = useRef<boolean>(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const fadeOut = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const toggleHelp = () => {
    showHelp.current ? fadeOut() : fadeIn();
    showHelp.current = !showHelp.current;
  };

  const handlePanel = () => {
    setCurrentStatePanel(!currentStatePanel);
    console.log('currentStatePanel: ' + currentStatePanel);
  };

  return (
    <View style={headerStyles.container}>
      <View style={headerStyles.row}>
        <IconButton
          library="material"
          iconName="menu"
          onPress={handlePanel}
          iconSize={50}
          color="dark"
        />
        <View style={headerStyles.ml}>
          <HelpButton toggleHelp={toggleHelp} />
        </View>
      </View>
      <HelpBanner type={type} fadeAnim={fadeAnim} />
      <View style={headerStyles.row}>
        <IconButton
          library="material"
          iconName="checkbox-marked"
          onPress={() => {}}
          iconSize={50}
          color="success"
        />

        <View style={headerStyles.ml}>
          <IconButton
            library="material"
            iconName="home"
            onPress={() => navigation.navigate('FileSelectionScreen', {})}
            iconSize={50}
            color="dark"
          />
        </View>
      </View>
    </View>
  );
}

function HelpButton({ toggleHelp }: HeaderButtonProps) {
  return (
    <View style={sectionStyles.container}>
      <IconButton
        library="material"
        iconName="help-box"
        onPress={toggleHelp}
        iconSize={50}
        color="info"
      />
    </View>
  );
}

const headerStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  row: {
    flexDirection: 'row',
  },
  ml: {
    marginLeft: 7,
  },
});

const sectionStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
});

export default Header;
