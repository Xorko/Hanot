import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

type FullSelectionButtonProps = {
  show: boolean;
  buttonText: string;
  onPress: () => void;
};

function FullSelectionButton({
  show,
  buttonText,
  onPress,
}: FullSelectionButtonProps) {
  const [shouldShow] = useState(show);

  return (
    <View>
      {shouldShow ? (
        <TouchableOpacity onPress={onPress}>
          <View style={styles.container}>
            <Text style={styles.police}>{buttonText}</Text>
          </View>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: 'white',
    backgroundColor: 'black',
    marginHorizontal: 10,
  },
  police: {
    color: 'white',
    marginHorizontal: 20,
    fontSize: 20,
  },
});

export default FullSelectionButton;
