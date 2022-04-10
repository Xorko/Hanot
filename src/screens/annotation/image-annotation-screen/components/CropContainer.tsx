import React from 'react';
import {
  Dimensions,
  NativeSyntheticEvent,
  StyleSheet,
  TextInput,
  TextInputSubmitEditingEventData,
  View,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useAppDispatch} from '../../../../app/hooks';
import {setCurrentAnnotatedImageCropAnnotationAtIndex} from '../current-annotated-image';
import {Point} from '../types/image-annotation-types';
import Crop from './Crop';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

interface CropContainerPropsType {
  path: Point[];
  selectCrop: () => void;
  selected: boolean;
  index: number;
}

const CropContainer = ({
  path,
  selectCrop,
  selected,
  index,
}: CropContainerPropsType) => {
  const dispatch = useAppDispatch();

  const handleTextSubmit = (
    e: NativeSyntheticEvent<TextInputSubmitEditingEventData>,
  ) => {
    dispatch(
      setCurrentAnnotatedImageCropAnnotationAtIndex({
        index,
        annotation: e.nativeEvent.text,
      }),
    );
  };

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={selectCrop}>
      <View
        style={selected ? {...styles.box, ...styles.seletedBox} : styles.box}>
        <View style={styles.letterWriting}>
          <Crop path={path} />
        </View>
        <View style={styles.letterTitle}>
          <TextInput
            onSubmitEditing={handleTextSubmit}
            placeholder="Crop annotation"
            maxLength={1}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  box: {
    alignSelf: 'center',
    backgroundColor: '#2196f3',
    height: windowHeight / 3,
    width: windowWidth / 7,
    borderRadius: 15,
    marginHorizontal: 5,
  },
  seletedBox: {
    backgroundColor: '#607d8b',
  },
  letterWriting: {
    margin: 10,
    height: '70%',
    backgroundColor: '#6ec6ff',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  letterTitle: {
    backgroundColor: '#6ec6ff',
    height: '18%',
    borderRadius: 10,
    marginBottom: 12,
    marginTop: 0,
    marginHorizontal: 60,
  },
});

export default CropContainer;
