import IconButton from '../../../components/IconButton';
import { useFileType } from '../context/FileTypeContext';

const FileTypeChangeButton = () => {
  const { fileType, setFileType } = useFileType();

  return (
    <IconButton
      iconName={fileType === 'inkml' ? 'file-code' : 'file-image'}
      onPress={() => setFileType(fileType === 'inkml' ? 'image' : 'inkml')}
    />
  );
};

export default FileTypeChangeButton;
