import { StyleSheet, View } from 'react-native';
import ChangeModeButton from './ChangeModeButton';
import FileTypeChangeButton from './FileTypeChangeButton';
import FullSelectionButton from './FullSelectionButton';
import ImportButton from './ImportButton';

const cancelPress = () => {
  console.log('Annuler');
};

function FullSelectionPress() {
  //const { selectedFiles, setSelectedFiles } = useSelectedFiles();

  console.log('Tout sélectionner');
}

function ButtonsTop() {
  return (
    <View style={styles.container}>
      <View style={styles.pl}>
        <ImportButton />
      </View>
      <View style={styles.mode}>
        <View style={styles.jc}>
          <FullSelectionButton
            show={true}
            buttonText="Annuler"
            onPress={() => cancelPress()}
          />
        </View>
        <View style={styles.jc}>
          <FullSelectionButton
            show={true}
            buttonText="Tout sélectionner"
            onPress={() => FullSelectionPress()}
          />
        </View>
        <View style={styles.pl}>
          <FileTypeChangeButton />
        </View>
        <View style={styles.pl}>
          <ChangeModeButton />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    marginTop: 20,
  },
  mode: {
    flexDirection: 'row',
  },
  pl: {
    paddingHorizontal: 20,
  },
  jc: {
    justifyContent: 'center',
    marginHorizontal: 10,
  },
});

export default ButtonsTop;
