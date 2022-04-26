import * as Dot from '../../../../core/dot';
import * as Trace from '../../../../core/trace';

type HitBoxProps = {
  dot: Dot.Type;
  dimensions: {
    factorSize: number;
    posHorizontal: number;
    posVertical: number;
  };
  handlePressHitBox: (indexOfTrace: number) => void;
  indexOfTrace: number;
  editLetterTraces: (traces: Trace.Type[]) => void;
};

function Hitbox({
  dot,
  indexOfTrace,
  handlePressHitBox,
  dimensions,
  editLetterTraces,
}: HitBoxProps) {
  return (
    <circle
      onClick={() => {
        handlePressHitBox(indexOfTrace);
        editLetterTraces([]);
      }}
      cx={dot.x * dimensions.factorSize + dimensions.posHorizontal}
      cy={dot.y * dimensions.factorSize + dimensions.posVertical}
      r={5}
      fill={'red'}
    />
  );
}

export default Hitbox;
