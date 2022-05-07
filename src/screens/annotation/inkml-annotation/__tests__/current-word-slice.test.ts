import { merge } from 'lodash';
import { constructLetter } from '../../../../core/char';
import * as Dot from '../../../../core/dot';
import { createEmptyTraceGroup } from '../../../../core/input';
import * as Trace from '../../../../core/trace';
import * as TraceGroup from '../../../../core/tracegroup';
import * as Word from '../../../../core/word';
import currentWordReducer, {
  annotateTraceGroup,
  deleteTraceGroups,
  initWord,
  pushDots,
  pushTraceGroup,
  pushTraces,
  setDefaultTraceGroup,
  setFinalTraceGroups,
} from '../current-word-slice';

const initialWord: Word.Type = {
  tracegroups: [],
  defaultTraceGroup: [],
  annotations: {},
  attributes: {},
  predicted: undefined,
};

const customWord1: Word.Type = {
  tracegroups: [
    {
      traces: [],
      label: constructLetter('a'),
    },
    {
      traces: [],
      label: constructLetter('b'),
    },
  ],
  defaultTraceGroup: [
    {
      dots: [{ x: 5, y: 5, f: 3, t: 2 }],
      oldTrace: 2,
    },
  ],
  annotations: {},
  attributes: {},
  predicted: undefined,
};

function createFactory<T>(data: T) {
  return (...args: Partial<T>[]): T => {
    return merge({}, data, ...args);
  };
}

const factoryInitialWord = createFactory(initialWord);
const factoryCustomWord1 = createFactory(customWord1);

//afterEach(cleanup);

test('Test initWord', () => {
  const expectedWord = factoryInitialWord();

  expect(currentWordReducer(undefined, initWord(initialWord))).toEqual(
    expectedWord,
  );
});

test('Test pushTraces with empty array and a currentWord with no traceGroup in traceGroups', () => {
  const traces: Trace.Type[] = [];

  expect(() =>
    currentWordReducer(initialWord, pushTraces(traces)),
  ).toThrowErrorMatchingSnapshot();
});

test('Test pushTraces with one element array and a currentWord with no traceGroup in traceGroups', () => {
  const traces: Trace.Type[] = [
    {
      dots: [],
      oldTrace: 0,
    },
  ];

  expect(() =>
    currentWordReducer(initialWord, pushTraces(traces)),
  ).toThrowErrorMatchingSnapshot();
});

test('Test pushTraces with one element array and a currentWord with a traceGroup in traceGroups', () => {
  const traces: Trace.Type[] = [
    {
      dots: [],
      oldTrace: 0,
    },
  ];
  const expectedWord = factoryCustomWord1({
    tracegroups: [
      customWord1.tracegroups[0],
      {
        traces: traces,
        label: customWord1.tracegroups[1].label,
      },
    ],
  });
  expect(currentWordReducer(customWord1, pushTraces(traces))).toEqual(
    expectedWord,
  );
});

test('Test setDefaultTraceGroup', () => {
  const traces: Trace.Type[] = [
    {
      dots: [],
      oldTrace: 0,
    },
  ];
  const expectedWord = factoryInitialWord({
    defaultTraceGroup: traces,
  });
  expect(currentWordReducer(initialWord, setDefaultTraceGroup(traces))).toEqual(
    expectedWord,
  );
});

test('Test setDefaultTraceGroup on non-empty defaultTraceGroup field', () => {
  const traces: Trace.Type[] = [
    {
      dots: [],
      oldTrace: 0,
    },
  ];
  const expectedWord = factoryCustomWord1();
  expectedWord.defaultTraceGroup = traces;
  expect(currentWordReducer(customWord1, setDefaultTraceGroup(traces))).toEqual(
    expectedWord,
  );
});

test('Test setFinalTraceGroups', () => {
  const finaltraceGroups: TraceGroup.Type[] = [
    {
      traces: [],
      label: constructLetter('c'),
    },
  ];
  const expectedWord = factoryInitialWord({
    tracegroups: finaltraceGroups,
  });
  expect(
    currentWordReducer(initialWord, setFinalTraceGroups(finaltraceGroups)),
  ).toEqual(expectedWord);
});

test('Test setFinalTraceGroups on non-empty finalTraceGroups field', () => {
  const finaltraceGroups: TraceGroup.Type[] = [
    {
      traces: [],
      label: constructLetter('c'),
    },
  ];
  const expectedWord = factoryCustomWord1();
  expectedWord.tracegroups = finaltraceGroups;
  expect(
    currentWordReducer(customWord1, setFinalTraceGroups(finaltraceGroups)),
  ).toEqual(expectedWord);
});

test('Test deleteTraceGroups if oldTrace is out of bound of defaultTraceGroup', () => {
  const traceGroup: TraceGroup.Type = {
    traces: [
      {
        dots: [{ x: 5, y: 5, f: 3, t: 2 }],
        oldTrace: 2,
      },
    ],
    label: constructLetter('a'),
  };
  const expectedWord = factoryCustomWord1();
  expectedWord.defaultTraceGroup[traceGroup.traces[0].oldTrace] = {
    dots: traceGroup.traces[0].dots,
    oldTrace: -1,
  };

  expect(
    currentWordReducer(customWord1, deleteTraceGroups([traceGroup])),
  ).toEqual(expectedWord);
});

test('Test deleteTraceGroups', () => {
  const traceGroup: TraceGroup.Type = {
    traces: [
      {
        dots: [{ x: 6, y: 5, f: 3, t: 2 }],
        oldTrace: 0,
      },
    ],
    label: constructLetter('a'),
  };
  const expectedWord = factoryCustomWord1();
  expectedWord.defaultTraceGroup = [
    {
      dots: [
        { x: 6, y: 5, f: 3, t: 2 },
        { x: 5, y: 5, f: 3, t: 2 },
      ],
      oldTrace: 2,
    },
  ];
  expect(
    currentWordReducer(customWord1, deleteTraceGroups([traceGroup])),
  ).toEqual(expectedWord);
});

test('Test pushTraceGroup', () => {
  const expectedWord = factoryCustomWord1();
  expectedWord.tracegroups.push(createEmptyTraceGroup());
  expect(currentWordReducer(customWord1, pushTraceGroup())).toEqual(
    expectedWord,
  );
});

test('Test pushDots with incorrect idxTraceGroup parameter', () => {
  const leftTrace: Dot.Type[] = [{ x: 5, y: 5, f: 3, t: 2 }];
  const idxOldTrace: number = 6;
  const idxTraceGroup: number = -1;
  expect(() =>
    currentWordReducer(
      customWord1,
      pushDots({ leftTrace, idxOldTrace, idxTraceGroup }),
    ),
  ).toThrowErrorMatchingSnapshot();
});

test('Test pushDots', () => {
  const leftTrace: Dot.Type[] = [{ x: 5, y: 5, f: 3, t: 2 }];
  const idxOldTrace: number = 6;
  const idxTraceGroup: number = 1;
  const expectedWord = factoryCustomWord1();
  expectedWord.tracegroups[1].traces[0] = {
    dots: leftTrace,
    oldTrace: idxOldTrace,
  };
  expect(
    currentWordReducer(
      customWord1,
      pushDots({ leftTrace, idxOldTrace, idxTraceGroup }),
    ),
  ).toEqual(expectedWord);
});

test('Test annotateTraceGroup with incorrect index parameter', () => {
  const index: number = -1;
  const annotation: string = 'a';

  expect(() =>
    currentWordReducer(customWord1, annotateTraceGroup({ index, annotation })),
  ).toThrowErrorMatchingSnapshot();
});

test('Test annotateTraceGroup', () => {
  const index: number = 1;
  const annotation: string = 'a';
  const expectedWord = factoryCustomWord1();
  expectedWord.tracegroups[1].label = constructLetter(annotation);
  expect(
    currentWordReducer(customWord1, annotateTraceGroup({ index, annotation })),
  ).toEqual(expectedWord);
});
