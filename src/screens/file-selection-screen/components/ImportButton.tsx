import IconButton from '../../../components/IconButton';
import Text from '../../../components/Text';
import { useFileType } from '../../../context/FileTypeContext';
import { useAppDispatch } from '../../../stores/hooks';
import { addImageFile, addTextFile } from '../loaded-files-slice';
import { handleFileImport } from '../utils/import-utils';

const ImportButton = () => {
  const { fileType } = useFileType();

  const dispatch = useAppDispatch();

  const addFiles = (fileInfo: any[]) => {
    switch (fileType) {
      case 'image':
        dispatch(addImageFile(fileInfo));
        break;
      case 'inkml':
        dispatch(addTextFile(fileInfo));
        break;
      default:
        break;
    }
  };

  const handlePress = async () => {
    let files;

    switch (fileType) {
      case 'image':
        files = await handleFileImport('image');
        break;
      case 'inkml':
        files = await handleFileImport('inkml');
        break;
    }

    addFiles(files);
  };

  return (
    <>
      <IconButton
        library="material"
        iconName="file-import"
        iconSize={50}
        color="dark"
        onPress={handlePress}
      />
      <Text variant="dark">Importer</Text>
    </>
  );
};

export default ImportButton;
