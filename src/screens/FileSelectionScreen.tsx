import {Button, Dimensions, StyleSheet, View} from 'react-native';
import {Shadow} from 'react-native-shadow-2';
import Files from '../Components_remake/Files';
import SideBar from '../Components_remake/SideBar';

const windowWidth = Dimensions.get('window').width;

interface FileSelectionScreenProps {
  navigation: any;
}

function FileSelectionScreen(props: FileSelectionScreenProps) {
  const annotationScreen = () => props.navigation.navigate('AnnotationScreen');

  return (
    <View style={styles.screen}>
      <SideBar />
      <Shadow containerViewStyle={{alignSelf: 'flex-end'}}>
        <View style={styles.annotation}>
          <Button
            title="Tout sélectionner"
            onPress={() => annotationScreen()}
          />
          <Files />
        </View>
      </Shadow>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    height: '100%',
    width: '100%',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  annotation: {
    flex: 1,
    width: windowWidth / 1.07,
    backgroundColor: '#e1e2e1',
    padding: '5%',
    justifyContent: 'flex-start',
    borderRadius: 40,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
});
/*

type FileSelectionScreenProps = DrawerScreenProps<
  DrawerParamList,
  'File Selection'
>;
function FileSelectionScreen({navigation}: FileSelectionScreenProps) {
  return (
    <View style={styles.center}>
      <Button onPress={() => navigation.goBack()} title="Go back" />
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
*/
export default FileSelectionScreen;
