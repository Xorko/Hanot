import IconButton from '../../../components/IconButton';

const OpenFileButton = () => {
  return (
    <IconButton
      library="material"
      iconName="pencil-circle"
      color="dark"
      onPress={() => console.log('hello')}
    />
  );
};

export default OpenFileButton;
