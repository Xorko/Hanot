import { ScrollView, StyleSheet, View } from 'react-native';
import IconButton from '../../../components/IconButton';
import { useDrawerStateContext } from '../context/DrawerStateContext';
import FilePanel from './FilePanel';

function Drawer() {
  const { isOpen, setIsOpen } = useDrawerStateContext();

  return (
    <View>
      {isOpen && (
        <View style={styles.panel}>
          <View style={styles.buttons}>
            <IconButton
              library="material"
              iconName="close"
              onPress={() => setIsOpen(!isOpen)}
              iconSize={50}
              color="dark"
            />
          </View>
          <View style={styles.panelContent}>
            <ScrollView contentContainerStyle={styles.contentContainer}>
              <FilePanel />
              <FilePanel />
              <FilePanel />
              <FilePanel />
              <FilePanel />
              <FilePanel />
              <FilePanel />
              <FilePanel />
              <FilePanel />
              <FilePanel />
              <FilePanel />
              <FilePanel />
              <FilePanel />
              <FilePanel />
              <FilePanel />
              <FilePanel />
              <FilePanel />
              <FilePanel />
            </ScrollView>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    zIndex: 2,
    backgroundColor: '#005b9f',
    justifyContent: 'flex-start',
    width: '30%',
    position: 'absolute',
  },
  buttons: {
    flexDirection: 'row',
  },
  panelContent: {
    marginHorizontal: 20,
    marginTop: 100,
  },
  contentContainer: {
    paddingBottom: 50,
  },
});

export default Drawer;
