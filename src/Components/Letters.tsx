import {StyleSheet, Text, View} from 'react-native';

function Letters() {
  return (
    <View style={styles.box}>
      <Text>Letters</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  box: {
    alignSelf: 'center',
    marginBottom: '5%',
    paddingHorizontal: '1%',
    paddingVertical: '0.6%',
    backgroundColor: '#212B4E',
  },
});
export default Letters;
