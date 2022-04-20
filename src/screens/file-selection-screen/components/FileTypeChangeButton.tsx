import IconButton from '../../../components/IconButton';
import { useFileType } from '../context/FileTypeContext';

const FileTypeChangeButton = () => {
  const { fileType, setFileType } = useFileType();

  return (
    <IconButton
      library="Material"
      color="dark"
      iconName={fileType === 'image' ? 'file-code' : 'file-image'}
      onPress={() => setFileType(fileType === 'inkml' ? 'image' : 'inkml')}
    />
  );
};

export default FileTypeChangeButton;
