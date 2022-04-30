import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
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

  const [showHelp, setShowHelp] = useState<boolean>(false);

  const toggleHelp = () => {
    setShowHelp(!showHelp);
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
      {showHelp && <HelpBanner type={type} />}
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
