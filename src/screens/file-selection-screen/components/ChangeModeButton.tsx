import IconButton from '../../../components/IconButton';
import Text from '../../../components/Text';
import { useDisplayMode } from '../context/DisplayModeContext';

function ChangeModeButton() {
  const { displayMode, setDisplayMode } = useDisplayMode();

  const handlePress = () => {
    displayMode === 'block' ? setDisplayMode('list') : setDisplayMode('block');
  };

  return (
    <>
      <IconButton
        library="material"
        iconSize={50}
        color="dark"
        iconName={displayMode === 'list' ? 'format-list-bulleted' : 'view-grid'}
        onPress={handlePress}
      />
      <Text variant="dark">Mode d'affichage</Text>
    </>
  );
}

export default ChangeModeButton;
