import { StyleSheet, View } from 'react-native';
import DeleteButton from './DeleteButton';
import ValidateButton from './ValidateButton';

type CropContainerButtonsPropsType = {
  annotate: () => void;
  deleteCrop: () => void;
};

const CropContainerButtons = ({
  annotate,
  deleteCrop,
}: CropContainerButtonsPropsType) => {
  //===========================================================================
  // Render
  //===========================================================================

  return (
    <View style={styles.container}>
      <ValidateButton validateCrop={annotate} />
      <DeleteButton deleteCrop={deleteCrop} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
});

export default CropContainerButtons;
