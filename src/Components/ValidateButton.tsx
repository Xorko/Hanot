import {Animated, StyleSheet, Text} from 'react-native';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';

function ValidateButton() {
  const animatedButtonScale = new Animated.Value(1);

  const onPressIn = () => {
    Animated.spring(animatedButtonScale, {
      toValue: 1.3,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(animatedButtonScale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const animatedScaleStyle = {
    transform: [{scale: animatedButtonScale}],
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {}}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      /* style={styles.test} */
    >
      <Animated.View style={[styles.button, animatedScaleStyle]}>
        <Text style={styles.text}> ✅ VALIDER </Text>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  /* test: {
    backgroundColor: 'white',
  }, */
  button: {
    marginBottom: '2%',
    marginRight: '2%',
    alignSelf: 'flex-end',
    backgroundColor: '#3E65FB',
    paddingVertical: '0.5%',
    paddingHorizontal: '1%',
    borderRadius: 50,
  },
  text: {
    color: '#D2D2D7',
    fontSize: 20,
    fontWeight: '500',
    letterSpacing: 1.5,
  },
});

export default ValidateButton;
