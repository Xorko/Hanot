import { useEffect, useState } from 'react';
import * as Trace from '../../../../core/trace';
import { useAppSelector } from '../../../../stores/hooks';
import { Size } from '../../../../types/coordinates-types';
import { getPointFromWord } from '../../../../utils/word-utils';
import { usePolylineTransformContext } from '../context/PolylineTransformContext';
import { getTransform } from '../utils/transform-utils';
import WordSvg from './WordSvg';

type WordSvgPropsType = {
  areaSize: Size;
};

function Workspace({ areaSize }: WordSvgPropsType) {
  const { transform, setTransform } = usePolylineTransformContext();

  const [defaultTraces, setDefaultTraces] = useState<Trace.Type[]>([]);

  const currentWord = useAppSelector(state => state.currentWord);

  useEffect(() => {
    if (currentWord) {
      setTransform(getTransform(getPointFromWord(currentWord), areaSize));
      setDefaultTraces(currentWord.defaultTraceGroup);
    } else {
      setDefaultTraces([]);
    }
  }, [areaSize, currentWord, setTransform]);

  return <>{transform && <WordSvg traces={defaultTraces} />}</>;
}

export default Workspace;
