import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEffect, useLayoutEffect, useState } from 'react';
import {
  Image,
  LayoutChangeEvent,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDrawerFilesContext } from '../context/DrawerFilesContext';
import { useFileType } from '../context/FileTypeContext';
import { Transform } from '../screens/annotation/inkml-annotation/types/annotation-types';
import { getTransform } from '../screens/annotation/inkml-annotation/utils/transform-utils';
import { useDisplayMode } from '../screens/file-selection-screen/context/DisplayModeContext';
import { useFileSelectionMode } from '../screens/file-selection-screen/context/FileSelectionModeContext';
import { useSelectedFiles } from '../screens/file-selection-screen/context/SelectedFilesContext';
import { limitStringLength } from '../screens/file-selection-screen/utils/string-utils';
import { useAppSelector } from '../stores/hooks';
import colors from '../style/colors';
import type {
  AnnotatedImage,
  AnnotatedInkml,
} from '../types/annotated-files-types';
import { Coordinates, Size } from '../types/coordinates-types';
import { ImageFile, InkMLFile } from '../types/file-import-types';
import { RootStackParamList } from '../types/navigation-types';
import { getPointsFromInkML, getPointsFromTrace } from '../utils/word-utils';
import PolylineRenderer from './PolylineRenderer';
import SvgContainer from './SvgContainer';
import Text from './Text';

type FileProps = {
  file: InkMLFile | ImageFile;
};

type FileItemProps = FileProps & {
  isSelected?: boolean;
  isAnnotated?: boolean;
};

function FileCard({ file }: FileProps) {
  const [isSelected, setIsSelected] = useState<boolean>(false);
  const { displayMode } = useDisplayMode();
  const { fileType } = useFileType();
  const { selectedFiles, setSelectedFiles } = useSelectedFiles();
  const { setOpenedFiles } = useDrawerFilesContext();
  const { fileSelectionMode, setFileSelectionMode } = useFileSelectionMode();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const isAnnotated = useAppSelector(state => {
    let annotatedFiles: (AnnotatedInkml | AnnotatedImage)[];

    switch (fileType) {
      case 'inkml':
        annotatedFiles = state.annotatedInkml.annotatedInkml;
        break;
      case 'image':
        annotatedFiles = state.annotatedImages.annotatedImages;
        break;
    }

    return (
      annotatedFiles.filter(annotatedFile => annotatedFile.id === file.id)
        .length > 0
    );
  });

  /**
   * Navigates to the correct annotation screen based on the file type.
   */
  const handleNavigation = () => {
    switch (fileType) {
      case 'image':
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
        <ListItem
          file={file}
          isSelected={isSelected}
          isAnnotated={isAnnotated}
        />
      )}
      {displayMode === 'block' && (
        <BlockItem
          file={file}
          isSelected={isSelected}
          isAnnotated={isAnnotated}
        />
      )}
    </TouchableOpacity>
  );
}

function ListItem({ file, isSelected, isAnnotated }: FileItemProps) {
  return (
    <View
      style={[
        listStyles.container,
        isAnnotated && styles.annotated,
        isSelected && styles.selected,
      ]}
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

function BlockItem({ file, isSelected, isAnnotated }: FileItemProps) {
  const [areaSize, setAreaSize] = useState<Size>();
  const [transform, setTransform] = useState<Transform>();
  const [tracegroupsCoordinates, setTracegroupsCoordinates] =
    useState<Coordinates[][]>();
  const { fileType } = useFileType();

  const handleLayoutChange = (event: LayoutChangeEvent) => {
    setAreaSize(event.nativeEvent.layout);
  };

  useLayoutEffect(() => {
    if (areaSize) {
      switch (fileType) {
        case 'inkml':
          const content = (file as InkMLFile).content;
          if (content) {
            // TODO: Adapt this to support multiple words in a single file
            const tracegroupsTraces = content.words[0].tracegroups
              .map(tracegroup => tracegroup.traces)
              .flat();
            const traces = content.words[0].defaultTraceGroup.concat(
              ...tracegroupsTraces,
            );
            setTracegroupsCoordinates(traces.map(getPointsFromTrace));
            setTransform(getTransform(getPointsFromInkML(content), areaSize));
          }
          break;
      }
    }
  }, [areaSize, fileType, file]);

  return (
    <View
      style={[
        blockStyles.container,
        isAnnotated && styles.annotated,
        isSelected && styles.selected,
      ]}
      testID="file-block">
      <View style={blockStyles.preview} onLayout={handleLayoutChange}>
        {fileType === 'inkml' && (
          <SvgContainer>
            {tracegroupsCoordinates &&
              transform &&
              tracegroupsCoordinates.map((points, idx) => (
                <PolylineRenderer
                  key={idx}
                  points={points}
                  transform={transform}
                />
              ))}
          </SvgContainer>
        )}
        {fileType === 'image' && (
          <Image
            source={{ uri: (file as ImageFile).image }}
            style={blockStyles.imagePreview}
          />
        )}
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
    opacity: 0.5,
  },
  annotated: {
    backgroundColor: colors.success,
    borderColor: colors.success,
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
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  filenameContainer: {
    marginTop: 10,
  },
});

export { BlockItem as BlockFileCard };
export default FileCard;
