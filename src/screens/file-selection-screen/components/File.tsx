import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StyleSheet, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Text from '../../../components/Text';
import colors from '../../../style/colors';
import { RootStackParamList } from '../../../types/navigation-types';
import { useDisplayMode } from '../context/DisplayModeContext';
import { useFileType } from '../context/FileTypeContext';
import { ImageFile, InkMLFile } from '../types/file-import-types';

interface FileProps {
  file: InkMLFile | ImageFile;
}

function File({ file }: FileProps) {
  const { displayMode } = useDisplayMode();
  const { fileType } = useFileType();

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const handlePress = () => {
    switch (fileType) {
      case 'image':
        navigation.navigate('ImageAnnotationScreen', {
          file: file as ImageFile,
        });
        break;
      case 'inkml':
        navigation.navigate('InkMLAnnotationScreen', {
          file: file as InkMLFile,
        });
        break;
      default:
        break;
    }
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      {displayMode === 'list' && <ListItem file={file} />}
      {displayMode === 'block' && <BlockItem file={file} />}
    </TouchableOpacity>
  );
};

function ListItem({ file }: FileProps) {
  return (
    <View style={listStyles.container}>
      <Text variant="light" style={styles.filename}>
        {file.fileName}
      </Text>
    </View>
  );
}

function BlockItem({ file }: FileProps) {
  return (
    <View style={blockStyles.container}>
      <View style={blockStyles.preview}>
        <Text variant="secondary">Preview</Text>
      </View>
      <View style={blockStyles.filenameContainer}>
        <Text variant="light" style={styles.filename}>
          {file.fileName}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  filename: {
    fontWeight: 'bold',
  },
});

const listStyles = StyleSheet.create({
  container: {
    alignContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 20,
    paddingHorizontal: 150,
  },
});

const blockStyles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    padding: 20,
    width: '97%', // Modify this to increase or decrease the gap between the items
  },
  preview: {
    width: 200,
    height: 50,
    borderRadius: 10,
    backgroundColor: colors.light,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filenameContainer: {
    marginTop: 10,
  },
});

export default File;
