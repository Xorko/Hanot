import React from 'react';
import {View, Button, StyleSheet, Dimensions, ViewStyle} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Shadow} from 'react-native-shadow-2';
import SideBar from '../Components_remake/SideBar';
import ImageAnnotationContainer from './ImageAnnotationContainer';
import ImageLettersMenu from './ImageLettersMenu';

const windowWidth = Dimensions.get('window').width;

const ImageAnnotationScreen = () => {
  const navigation = useNavigation();

  const shadowStyle: ViewStyle = {alignSelf: 'flex-end'};

  return (
    <View style={styles.screen}>
      <SideBar />
      <Shadow containerViewStyle={shadowStyle}>
        <View style={styles.annotation}>
          <View style={styles.home}>
            <Button
              title="Menu"
              onPress={() =>
                navigation.navigate('FileSelectionScreen' as never)
              }
            />
          </View>
          <ImageLettersMenu />
          <ImageAnnotationContainer />
        </View>
      </Shadow>
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
