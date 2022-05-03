import { Circle } from 'react-native-svg';
import * as Dot from '../../../../core/dot';
import colors from '../../../../style/colors';
import { usePolylineTransformContext } from '../context/PolylineTransformContext';

type SpliPointPropsType = {
  dot: Dot.Type;
  onPress: () => void;
};

function SplitPoint({ dot, onPress }: SpliPointPropsType) {
  const { transform } = usePolylineTransformContext();

  return (
    <Circle
      onPress={onPress}
      cx={dot.x}
      cy={dot.y}
      r={3}
      fill={colors.info}
      transform={`translate(${-transform.translateX},${-transform.translateY})`}
      scale={transform.scale}
    />
  );
}

export default SplitPoint;
