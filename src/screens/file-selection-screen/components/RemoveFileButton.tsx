import IconButton from '../../../components/IconButton';

const RemoveFileButton = () => {
  return (
    <IconButton
      library="AntDesign"
      iconName="closecircle"
      color="danger"
      onPress={() => console.log('hello')}
    />
  );
};

export default RemoveFileButton;
