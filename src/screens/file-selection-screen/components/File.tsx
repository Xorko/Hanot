import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';
import Text from '../../../components/Text';
import { useDrawerFilesContext } from '../../../context/DrawerFilesContext';
import colors from '../../../style/colors';
import { ImageFile, InkMLFile } from '../../../types/file-import-types';
import { RootStackParamList } from '../../../types/navigation-types';
import { resetCurrentAnnotatedImage } from '../../annotation/image-annotation-screen/current-annotated-image';
import { useDisplayMode } from '../context/DisplayModeContext';
import { useFileSelectionMode } from '../context/FileSelectionModeContext';
import { useFileType } from '../context/FileTypeContext';
import { useSelectedFiles } from '../context/SelectedFilesContext';
import { limitStringLength } from '../utils/string-utils';

type FileProps = {
  file: InkMLFile | ImageFile;
};

type FileItemProps = FileProps & {
  isSelected?: boolean;
};

function File({ file }: FileProps) {
  const [isSelected, setIsSelected] = useState<boolean>(false);
  const { displayMode } = useDisplayMode();
  const { fileType } = useFileType();
  const { selectedFiles, setSelectedFiles } = useSelectedFiles();
  const { setOpenedFiles } = useDrawerFilesContext();
  const { fileSelectionMode, setFileSelectionMode } = useFileSelectionMode();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const dispatch = useDispatch();

  /**
   * Navigates to the correct annotation screen based on the file type.
   */
  const handleNavigation = () => {
    switch (fileType) {
      case 'image':
        dispatch(resetCurrentAnnotatedImage());
        navigation.navigate('AnnotationScreen', {
          screen: 'Annotation',
          params: {
            type: fileType,
            file: file as ImageFile,
          },
        });
        break;
      case 'inkml':
        navigation.navigate('AnnotationScreen', {
          screen: 'Annotation',
          params: {
            type: fileType,
            file: file as InkMLFile,
          },
        });
        break;
    }
  };

  /**
   * Handles the selection of a file.
   */
  const handleSelection = () => {
    if (selectedFiles.some(e => e.id === file.id)) {
      setSelectedFiles(selectedFiles.filter(f => f.id !== file.id));

      if (selectedFiles.length === 1) {
        setFileSelectionMode('single');
      }
    } else {
      setSelectedFiles([
        ...selectedFiles,
        { id: file.id, type: fileType, fileName: file.fileName },
      ]);
    }
  };

  /**
   * Acivates the multiple selection mode on long press on a file (and selects it).
   */
  const handleFileLongPress = () => {
    setFileSelectionMode('multiple');
    handleSelection();
  };

  /**
   * Handles the press on a file.
   * It will select the file if the file selection mode is multiple or it will
   * navigates to the annotation screen to annote it.
   */
  const handleFilePress = () => {
    switch (fileSelectionMode) {
      case 'multiple':
        handleSelection();
        break;
      case 'single':
        handleNavigation();
        setOpenedFiles([file.id]);
        break;
    }
  };

  useEffect(() => {
    if (selectedFiles.some(e => e.id === file.id)) {
      setIsSelected(true);
    } else {
      setIsSelected(false);
    }
  }, [selectedFiles, file.id]);

  return (
    <TouchableOpacity
      onPress={handleFilePress}
      onLongPress={handleFileLongPress}>
      {displayMode === 'list' && (
        <ListItem file={file} isSelected={isSelected} />
      )}
      {displayMode === 'block' && (
        <BlockItem file={file} isSelected={isSelected} />
      )}
    </TouchableOpacity>
  );
}

function ListItem({ file, isSelected }: FileItemProps) {
  return (
    <View
      style={[listStyles.container, isSelected && styles.selected]}
      testID="file-list">
      <Text
        variant="light"
        style={styles.filename}
        numberOfLines={1}
        ellipsizeMode="head">
        {limitStringLength(file.fileName, 40)}
      </Text>
    </View>
  );
}

function BlockItem({ file, isSelected }: FileItemProps) {
  return (
    <View
      style={[blockStyles.container, isSelected && styles.selected]}
      testID="file-block">
      <View style={blockStyles.preview}>
        <Text variant="secondary">Preview</Text>
      </View>
      <View style={blockStyles.filenameContainer}>
        <Text variant="light" style={styles.filename}>
          {limitStringLength(file.fileName, 22)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  filename: {
    fontWeight: 'bold',
  },
  selected: {
    borderColor: colors.secondary,
  },
});

const listStyles = StyleSheet.create({
  container: {
    alignContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 20,
    paddingHorizontal: 150,
    borderRadius: 10,
    borderWidth: 4,
    borderColor: colors.primary,
  },
});

const blockStyles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    width: '97%', // Modify this to increase or decrease the gap between the items
    marginBottom: 8,
    borderRadius: 10,
    borderWidth: 4,
    borderColor: colors.primary,
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

export { BlockItem as BlockFile };
export default File;
