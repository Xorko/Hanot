import {Animated, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

function AddLetterButton() {
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
          <Text style={styles.text}> + </Text>
        </Animated.View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#005b9f',
    borderRadius: 100,
  },
  text: {
    alignSelf: 'center',
    color: '#dff9fb',
    fontSize: 35,
    fontWeight: '700',
    letterSpacing: 1.5,
    padding: 5,
    paddingVertical: 8,
  },
});

export default AddLetterButton;
