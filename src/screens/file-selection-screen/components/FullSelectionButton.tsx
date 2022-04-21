import { useState } from 'react';
import Button from '../../../components/Button';

type FullSelectionButtonProps = {
  show: boolean;
  buttonText: string;
  onPress: () => void;
};

function FullSelectionButton({
  show,
  buttonText,
  onPress,
}: FullSelectionButtonProps) {
  const [shouldShow] = useState(show);

  return shouldShow ? (
    <Button title={buttonText} variant="dark" onPress={onPress} />
  ) : null;
}
/*
const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: 'white',
    backgroundColor: 'black',
    marginHorizontal: 10,
  },
  police: {
    color: 'white',
    marginHorizontal: 20,
    fontSize: 20,
  },
});
*/
export default FullSelectionButton;
