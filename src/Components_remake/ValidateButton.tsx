import {Animated, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

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
    <TouchableOpacity
      onPress={() => {}}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      activeOpacity={1}>
      <View>
        <Animated.View style={[styles.button, animatedScaleStyle]}>
          <Text style={styles.text}> VALIDER </Text>
        </Animated.View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  /* test: {
    backgroundColor: 'white',✅
  }, */
  button: {
    marginBottom: '2%',
    marginRight: '2%',
    alignSelf: 'flex-end',
    backgroundColor: '#6ab04c',
    paddingVertical: '0.5%',
    paddingHorizontal: '1%',
    borderRadius: 50,
  },
  text: {
    color: '#dff9fb',
    fontSize: 20,
    fontWeight: '500',
    letterSpacing: 1.5,
  },
});

export default ValidateButton;
