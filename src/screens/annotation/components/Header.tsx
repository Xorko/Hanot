import { useNavigation } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';
import { BackHandler, StyleSheet, View } from 'react-native';
import IconButton from '../../../components/IconButton';
import { useDrawerFilesContext } from '../../../context/DrawerFilesContext';
import type { FileType } from '../../../types/file-types';
import { NavigationProp } from '../../../types/navigation-types';
import HelpBanner from './HelpBanner';

type HeaderProps = {
  type: FileType;
  onValidate?: () => void;
  onGoBack?: () => void;
};

type HeaderButtonProps = {
  toggleHelp: () => void;
};

function Header({ type, onValidate, onGoBack }: HeaderProps) {
  const navigation = useNavigation<NavigationProp>();

  const [showHelp, setShowHelp] = useState<boolean>(false);
  const { setOpenedFiles } = useDrawerFilesContext();

  const toggleHelp = () => {
    setShowHelp(!showHelp);
  };

  const handleHomePress = useCallback(() => {
    setOpenedFiles([]);
    navigation.getParent()?.navigate('FileSelectionScreen'); // The parent of this navigator is the RootStack
    onGoBack?.();
    return true;
  }, [navigation, onGoBack]);

  useEffect(() => {
    if (onGoBack) {
      BackHandler.addEventListener('hardwareBackPress', handleHomePress);
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', handleHomePress);
      };
    }
  }, [handleHomePress, onGoBack]);

  return (
    <View style={headerStyles.container}>
      <View style={headerStyles.row}>
        <IconButton
          library="material"
          iconName="menu"
          onPress={navigation.toggleDrawer}
          iconSize={50}
          color="dark"
        />
        <View style={headerStyles.ml}>
          <HelpButton toggleHelp={toggleHelp} />
        </View>
      </View>
      {showHelp && <HelpBanner type={type} />}
      <View style={headerStyles.row}>
        <IconButton
          library="material"
          iconName="checkbox-marked"
          onPress={onValidate}
          iconSize={50}
          color="success"
        />

        <View style={headerStyles.ml}>
          <IconButton
            library="material"
            iconName="home"
            onPress={handleHomePress}
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
