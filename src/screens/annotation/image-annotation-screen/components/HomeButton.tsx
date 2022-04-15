import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React from 'react';
import {Button} from 'react-native';
import {useAppDispatch} from '../../../../app/hooks';
import {RootStackParamList} from '../../../../types/navigation-types';
import {reset} from '../current-annotated-image';

const HomeButton = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const dispatch = useAppDispatch();

  return (
    <Button
      title="Menu"
      onPress={() => {
        dispatch(reset());
        navigation.navigate('FileSelectionScreen', {});
      }}
    />
  );
};

export default HomeButton;
