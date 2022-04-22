import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import Buttons from './components/Buttons';
import ButtonsTop from './components/ButtonsTop';
import Files from './components/Files';
import { DisplayModeProvider } from './context/DisplayModeContext';
import { FileSelectionModeProvider } from './context/FileSelectionModeContext';
import { FileTypeProvider } from './context/FileTypeContext';
import { SelectedFilesProvider } from './context/SelectedFilesContext';

function TextFileSelectionScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <DisplayModeProvider>
        <FileTypeProvider>
          <FileSelectionModeProvider>
            <SelectedFilesProvider>
              <Toast />
              <View style={styles.header}>
                <ButtonsTop />
                <Buttons />
              </View>
              <View style={styles.files}>
                <Files />
              </View>
            </SelectedFilesProvider>
          </FileSelectionModeProvider>
        </FileTypeProvider>
      </DisplayModeProvider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginTop: 10,
    marginRight: 10,
  },
  files: {
    alignItems: 'center',
  },
});

export default TextFileSelectionScreen;
