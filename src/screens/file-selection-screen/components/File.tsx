import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Text from '../../../components/Text';
import colors from '../../../style/colors';
import { RootStackParamList } from '../../../types/navigation-types';
import { useDisplayMode } from '../context/DisplayModeContext';
import { useFileType } from '../context/FileTypeContext';
import { useSelectedFiles } from '../context/SelectedFilesContext';
import { ImageFile, InkMLFile } from '../types/file-import-types';
import { getNFirstCharacters } from '../utils/string-utils';

interface FileProps {
  file: InkMLFile | ImageFile;
}

function File({ file }: FileProps) {
  const { displayMode } = useDisplayMode();
  const { fileType } = useFileType();
  const { selectedFiles, setSelectedFiles } = useSelectedFiles();

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

  const handleLongPress = () => {
    if (selectedFiles.some(e => e.filePath === file.filePath)) {
      setSelectedFiles(selectedFiles.filter(f => f.filePath !== file.filePath));
    } else {
      setSelectedFiles([
        ...selectedFiles,
        { filePath: file.filePath, type: fileType },
      ]);
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} onLongPress={handleLongPress}>
      {displayMode === 'list' && <ListItem file={file} />}
      {displayMode === 'block' && <BlockItem file={file} />}
    </TouchableOpacity>
  );
}

function ListItem({ file }: FileProps) {
  // Code duplicated from block item to avoid having delay for the border coloration when selecting files
  const { selectedFiles } = useSelectedFiles();

  const [borderColor, setBorderColor] = useState<string>(colors.primary);

  useEffect(() => {
    if (selectedFiles.some(e => e.filePath === file.filePath)) {
      setBorderColor(colors.danger);
    }
  }, [selectedFiles, file.filePath]);

  return (
    <View style={{ ...listStyles.container, borderColor }}>
      <Text
        variant="light"
        style={styles.filename}
        numberOfLines={1}
        ellipsizeMode="head">
        {getNFirstCharacters(file.fileName, 40)}
      </Text>
    </View>
  );
}

function BlockItem({ file }: FileProps) {
  // Code duplicated from block item to avoid having delay for the border coloration when selecting files
  const { selectedFiles } = useSelectedFiles();

  const [borderColor, setBorderColor] = useState<string>(colors.primary);

  useEffect(() => {
    if (selectedFiles.some(e => e.filePath === file.filePath)) {
      setBorderColor(colors.danger);
    } else {
      setBorderColor(colors.primary);
    }
  }, [selectedFiles, file.filePath]);

  return (
    <View style={{ ...blockStyles.container, borderColor }}>
      <View style={blockStyles.preview}>
        <Text variant="secondary">Preview</Text>
      </View>
      <View style={blockStyles.filenameContainer}>
        <Text variant="light" style={styles.filename}>
          {getNFirstCharacters(file.fileName, 22)}
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
    borderWidth: 4,
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
    marginBottom: 8,
    borderWidth: 4,
  },
  preview: {
    width: 200,
    height: 80,
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
