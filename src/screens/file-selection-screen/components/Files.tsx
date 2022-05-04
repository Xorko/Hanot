import { FlatList, StyleSheet, View } from 'react-native';
import FileCard from '../../../components/FileCard';
import Text from '../../../components/Text';
import { useFileType } from '../../../context/FileTypeContext';
import { useAppSelector } from '../../../stores/hooks';
import { useDisplayMode } from '../context/DisplayModeContext';
import { LoadedFilesState } from '../loaded-files-slice';

function Files() {
  const { displayMode } = useDisplayMode();
  const { fileType } = useFileType();

  const files = useAppSelector((state: { loadedFiles: LoadedFilesState }) =>
    fileType === 'inkml'
      ? state.loadedFiles.textFileInfo
      : state.loadedFiles.imageFileInfo,
  );

  return (
    <FlatList
      data={files}
      renderItem={({ item }) => (
        <View style={displayMode === 'list' && styles.mb}>
          <FileCard file={item} />
        </View>
      )}
      numColumns={displayMode === 'block' ? 4 : 1}
      key={displayMode}
      contentContainerStyle={styles.contentContainer}
      columnWrapperStyle={displayMode === 'block' ? undefined : undefined}
      ListEmptyComponent={
        <Text variant="primary" style={styles.emptyListMessage}>
          Aucun fichier chargé
        </Text>
      }
    />
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingBottom: 20,
  },
  emptyListMessage: {
    fontSize: 35,
    fontWeight: '500',
  },
  mb: {
    marginBottom: 10,
  },
});
export default Files;
