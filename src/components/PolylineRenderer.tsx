import { Polyline } from 'react-native-svg';
import { Transform } from '../screens/annotation/inkml-annotation-screen/types/annotation-types';
import colors from '../style/colors';

type PolylineRendererProps = {
  points: { x: number; y: number }[];
  strokeWidth?: number;
  strokeColor?: string;
  onPress?: (...args: any[]) => void;
  transform?: Transform;
};

function PolylineRenderer({
  points,
  strokeWidth = 2,
  strokeColor = colors.dark,
  onPress,
  transform = { translateX: 0, translateY: 0, scale: 1 },
}: PolylineRendererProps) {
  const path = points
    .map(({ x, y }) => {
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <Polyline
      onPress={onPress}
      points={path}
      strokeWidth={strokeWidth}
      stroke={strokeColor}
      fill="none"
      transform={`translate(${-transform.translateX},${-transform.translateY})`}
      scale={transform.scale}
    />
  );
}

export default PolylineRenderer;
