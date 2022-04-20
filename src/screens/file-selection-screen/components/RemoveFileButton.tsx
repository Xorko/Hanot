import { useAppDispatch } from '../../../stores/hooks';
import IconButton from '../../../components/IconButton';
import { useSelectedFiles } from '../context/SelectedFilesContext';
import { removeTextFile } from '../loaded-files-slice';

const RemoveFileButton = () => {
  const { selectedFiles, setSelectedFiles } = useSelectedFiles();
  const dispatch = useAppDispatch();

  const handlePress = () => {
    selectedFiles.forEach(file => {
      dispatch(removeTextFile(file));
    });
    setSelectedFiles([]);
  };

  return (
    <IconButton
      library="AntDesign"
      iconName="closecircle"
      color="danger"
      onPress={handlePress}
    />
  );
};

export default RemoveFileButton;
