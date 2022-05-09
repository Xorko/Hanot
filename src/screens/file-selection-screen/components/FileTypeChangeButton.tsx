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
        iconName={fileType === 'image' ? 'file-image' : 'file-code'}
        onPress={() => setFileType(fileType === 'image' ? 'inkml' : 'image')}
      />
      <Text variant="dark">{fileType === 'image' ? 'Image' : 'InkML'}</Text>
    </>
  );
};

export default FileTypeChangeButton;
