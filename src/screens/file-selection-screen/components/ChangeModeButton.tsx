import IconButton from '../../../components/IconButton';
import { useDisplayMode } from '../context/DisplayModeContext';

function ChangeModeButton() {
  const { displayMode, setDisplayMode } = useDisplayMode();

  const handlePress = () => {
    displayMode === 'block' ? setDisplayMode('list') : setDisplayMode('block');
  };

  return (
    <IconButton
      library="FA5"
      iconName={displayMode === 'list' ? 'th' : 'list'}
      onPress={handlePress}
    />
  );
}

export default ChangeModeButton;
