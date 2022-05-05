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
    <circle
      onClick={onPress}
      cx={dot.x}
      cy={dot.y}
      r={3}
      fill={colors.info}
      transform={`scale(${
        transform.scale
      }) translate(${-transform.translateX} ${-transform.translateY})`}
    />
  );
}

export default SplitPoint;
