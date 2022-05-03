import { useEffect, useState } from 'react';
import * as Trace from '../../../../core/trace';
import { useAppSelector } from '../../../../stores/hooks';
import WordSvg from './WordSvg';

function Workspace() {
  const [defaultTraces, setDefaultTraces] = useState<Trace.Type[]>([]);

  const currentWord = useAppSelector(state => state.currentWord);

  useEffect(() => {
    setDefaultTraces(currentWord ? currentWord.defaultTraceGroup : []);
  }, [currentWord]);

  return <WordSvg traces={defaultTraces} />;
}

export default Workspace;
