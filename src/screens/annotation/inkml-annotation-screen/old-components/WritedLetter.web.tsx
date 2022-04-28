import * as Trace from '../../../../core/trace';
import { Dimension } from '../types/annotation-types';
import { getMaxValue, getMinValue } from '../utils/letter-utils';

type WrittedLetterProps = {
  traces: Trace.Type[];
  sizeComponent: { width: number; height: number };
};

function WritedLetter({ traces, sizeComponent }: WrittedLetterProps) {
  console.log('traces', traces);
  /**
   * Computing size of current letter
   */
  const xcoords = traces.map(trace => trace.dots.map(({ x }) => x)).flat();
  const ycoords = traces.map(trace => trace.dots.map(({ y }) => y)).flat();
  const minX = getMinValue(xcoords);
  const minY = getMinValue(ycoords);
  const lengthLetter = getMaxValue(xcoords) - minX;
  const heightLetter = getMaxValue(ycoords) - minY;

  /**
   * Initializing of dimensions used for resize and place letter
   */
  const dimensions: Dimension = {
    factorSize: 1,
    posHorizontal: 0,
    posVertical: 0,
  };
  // To resize a letter too big
  if (heightLetter - sizeComponent.height > 0) {
    dimensions.factorSize = 1 - (heightLetter - sizeComponent.height) / 100;
  }
  dimensions.posHorizontal = -minX + (sizeComponent.width - lengthLetter) / 2;
  dimensions.posVertical = -minY + sizeComponent.height - heightLetter - 10;

  return (
    <>
      {traces.map(trace => (
        <polyline
          key={traces.indexOf(trace)}
          points={trace.dots
            .map(
              ({ x, y }) =>
                `${x * dimensions.factorSize + dimensions.posHorizontal},
            ${y * dimensions.factorSize + dimensions.posVertical}`,
            )
            .join(' ')}
          strokeWidth="4"
          stroke="black"
          fill="none"
        />
      ))}
    </>
  );
}

export default WritedLetter;
