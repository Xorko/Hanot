import { useEffect, useState } from 'react';
import * as Trace from '../../../../core/trace';
import { useAppSelector } from '../../../../stores/hooks';
import WordPolyline from './WordPolyline';

type WorkspaceProps = {
  wordMinCoordinates: { minX: number; minY: number; scale: number };
};

function Workspace({ wordMinCoordinates }: WorkspaceProps) {
  const [defaultTraces, setDefaultTraces] = useState<Trace.Type[]>([]);

  const currentWord = useAppSelector(state => state.currentWord);

  useEffect(() => {
    setDefaultTraces(currentWord ? currentWord.defaultTraceGroup : []);
  }, [currentWord]);

  return (
    <WordPolyline
      traces={defaultTraces}
      wordMinCoordinates={wordMinCoordinates}
    />
  );
}

export default Workspace;
