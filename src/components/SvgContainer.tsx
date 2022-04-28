import Svg from 'react-native-svg';

type SvgContainerProps = {
  children: React.ReactNode;
  viewBox?: string;
};

function SvgContainer({ children, viewBox }: SvgContainerProps) {
  return (
    <Svg width="100%" height="100%" viewBox={viewBox}>
      {children}
    </Svg>
  );
}

export default SvgContainer;
