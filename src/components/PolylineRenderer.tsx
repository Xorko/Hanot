import { Polyline } from 'react-native-svg';
import colors from '../style/colors';

type PolylineRendererProps = {
  points: { x: number; y: number }[];
  strokeWidth?: number;
  strokeColor?: string;
  onPress?: (...args: any[]) => void;
  minCoordinates?: { minX: number; minY: number; scale: number };
};

function PolylineRenderer({
  points,
  strokeWidth = 2,
  strokeColor = colors.dark,
  onPress,
  minCoordinates = { minX: 0, minY: 0, scale: 1 },
}: PolylineRendererProps) {
  const path = points
    .map(({ x, y }) => {
      return `${x} ${y}`;
    })
    .join(' ');

  return (
    <Polyline
      onPress={onPress}
      points={path}
      strokeWidth={strokeWidth}
      stroke={strokeColor}
      fill="none"
      transform={`translate(${-minCoordinates.minX},${-minCoordinates.minY})`}
      scale={minCoordinates.scale}
    />
  );
}

export default PolylineRenderer;
