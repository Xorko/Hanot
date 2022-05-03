import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { Button } from 'react-native';
import { RootStackParamList } from '../../../../types/navigation-types';

function HomeButton() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  return (
    <Button
      title="Menu"
      onPress={() => {
        navigation.navigate('FileSelectionScreen', { reset: true });
      }}
    />
  );
}

export default HomeButton;
