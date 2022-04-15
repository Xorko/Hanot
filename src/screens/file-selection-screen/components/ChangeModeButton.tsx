import IconButton from '../../../components/IconButton';
import { useDisplayMode } from '../context/DisplayModeContext';

function ChangeModeButton() {
  const { displayMode, setDisplayMode } = useDisplayMode();

  const handlePress = () => {
    displayMode === 'block' ? setDisplayMode('list') : setDisplayMode('block');
  };

  return (
    <IconButton
      iconName={displayMode === 'block' ? 'th' : 'list'}
      onPress={handlePress}
    />
  );
}

export default ChangeModeButton;
