import IconButton from '../../../components/IconButton';

const OpenFileButton = () => {
  return (
    <IconButton
      library="Material"
      iconName="pencil-circle"
      color="danger"
      onPress={() => console.log('hello')}
    />
  );
};

export default OpenFileButton;