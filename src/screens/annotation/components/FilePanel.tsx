import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

function FilePanel() {
  return (
    <TouchableOpacity style={styles.allFilePanel}>
      <View style={styles.area}>
        <View style={styles.image}>
          <Text>Image</Text>
        </View>
        <View style={styles.fileNameArea}>
          <Text>FileName</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  allFilePanel: {
    marginVertical: 10,
  },
  area: {
    borderWidth: 1,
    width: '100%',
    height: 50,
    flexDirection: 'row',
    backgroundColor: 'white',
  },
  image: {
    margin: 5,
    borderWidth: 1,
    width: '30%',
  },
  fileNameArea: {
    justifyContent: 'center',
    marginHorizontal: 10,
    width: '30%',
  },
  fileNameStyle: {
    color: 'red',
  },
});

export default FilePanel;
