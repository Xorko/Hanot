import IconButton from '../../../components/IconButton';
import Text from '../../../components/Text';
import { useFileType } from '../../../context/FileTypeContext';

const FileTypeChangeButton = () => {
  const { fileType, setFileType } = useFileType();

  return (
    <>
      <IconButton
        library="material"
        iconSize={50}
        color={fileType === 'image' ? 'image' : 'inkml'}
        iconName={fileType === 'image' ? 'file-code' : 'file-image'}
        onPress={() => setFileType(fileType === 'inkml' ? 'image' : 'inkml')}
      />
      <Text variant="dark">InkML / Image</Text>
    </>
  );
};

export default FileTypeChangeButton;
