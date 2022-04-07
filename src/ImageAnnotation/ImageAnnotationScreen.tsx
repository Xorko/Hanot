import {useNavigation} from '@react-navigation/native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {StackNavigationProp} from '@react-navigation/stack';
import {useState} from 'react';
import {Button, Dimensions, StyleSheet, View} from 'react-native';
import SideBar from '../Components_remake/SideBar';
import {ImageSourceContext} from '../Context/ImageSourceContext';
import {RootStackParamList} from '../types/NavigationTypes';
import ImageAnnotationContainer from './ImageAnnotationContainer';
import ImageLettersMenu from './ImageLettersMenu';

const windowWidth = Dimensions.get('window').width;

type ImageAnnotationScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'ImageAnnotationScreen'
>;

const ImageAnnotationScreen = ({route}: ImageAnnotationScreenProps) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const {file} = route.params;

  const [imageSource, setImageSource] = useState<string>(file.image);

  const changeSource = (newSrc: string) => {
    setImageSource(newSrc);
  };

  return (
    <View style={styles.screen}>
      <SideBar />
      <View style={styles.annotation}>
        <View style={styles.home}>
          <Button
            title="Menu"
            onPress={() => navigation.navigate('FileSelectionScreen', {})}
          />
        </View>
        <ImageSourceContext.Provider
          value={{
            imageSource: imageSource,
            changeSource: changeSource,
          }}>
          <ImageLettersMenu />
          {!!imageSource && <ImageAnnotationContainer />}
        </ImageSourceContext.Provider>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  annotation: {
    flex: 1,
    width: windowWidth / 1.07,
    backgroundColor: '#e1e2e1',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderRadius: 40,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  screen: {
    height: '100%',
    width: '100%',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  home: {
    position: 'absolute',
    right: 30,
    top: 30,
  },
});

export default ImageAnnotationScreen;
