import { StyleSheet, View } from 'react-native';
import * as Progress from 'react-native-progress';

function ProgressCircle() {
  return (
    <View style={styles.progressCircle}>
      <Progress.Circle size={30} indeterminate={true} />
    </View>
  );
}

const styles = StyleSheet.create({
  progressCircle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ProgressCircle;
