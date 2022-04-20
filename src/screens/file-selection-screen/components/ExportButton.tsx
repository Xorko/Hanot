import IconButton from '../../../components/IconButton';
import { useFileType } from '../context/FileTypeContext';

function ExportButton() {
  const { fileType } = useFileType();

  const handlePress = () => {
    switch (fileType) {
      case 'image':
        break;
      case 'inkml':
        break;
      default:
        break;
    }
  };

  return (
    <IconButton
      library="Material"
      iconName="file-export"
      onPress={handlePress}
    />
  );
}

export default ExportButton;
